import './css/App.css';
import reload from './img/reload.svg';
import download from './img/download.svg';
import { useState } from 'react';

export default function App() {
  const [content, setContent] = useState(false);
  const [selected, setSelected] = useState([-1, -1]);
  const [shake, setShake] = useState(false);

  const handlePaste = (event, test) => {
    const str = event.clipboardData.getData('text');
    const all = str.split(/ [0-9]+[ ]{1,}[A-Z] |\n/);
    
    if (all.length < 4) { 
      setShake((prevState) => prevState + 1); 
      return; 
    } else {
      setShake(false);
    }

    const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    all.forEach((element, index) => {
      all[index] = {text: element, set: false, key: (index % 2 === 0 ? index / 2 + 1 : letters[(index - 1) / 2])};
    });

    setContent(all);
  }

  const handleDrop = (event, questionIndex) => {
    event.preventDefault();

    let answerIndex = event.dataTransfer.getData('answerIndex');

    updateArray(questionIndex, answerIndex);
  }

  const updateArray = (questionIndex, answerIndex) => {
    setContent((prevState) => {
      const update = prevState.slice();

      update[answerIndex - 1].set = false;
      update[questionIndex].set = true;

      const a = update[questionIndex + 1],
            b = update[answerIndex];
      
      update[answerIndex] = a;
      update[questionIndex + 1] = b;
      
      update[answerIndex].set = false;
      update[questionIndex + 1].set = true;

      return update;
    });
  }

  const handleDownload = (content) => {
    const page = prompt('Page number:');
    if (page === null) return;

    let longest = 0;
    for (let i = 0; i < content.length; i+=2) {
      const test = content[i].text.length;
      longest = test > longest ? test : longest;
    }

    let text = '';
    for (let i = 0; i < content.length; i+=2) {
      text += `${content[i].text}${' '.repeat(longest - content[i].text.length)} ${content[i].key}${(content.length > 18 && i < 18) ? ' ' : ''} ${content[i+1].key} ${content[i+1].text}${content.length - 2 === i ? '' : '\n'}`;
    }

    const blob = new Blob([text], { 
      type: "text/plain" 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `para ihop s.${page}`;
    link.href = url;
    link.click();
  }

  return (
    <div className="App">
      {!content && <textarea
        key={shake}
        className={'paste' + (shake ? ' shake' : '')}
        onPaste={handlePaste}
        value='Paste text here'
        readOnly
        autoFocus
      />
      }
      {content && <div className="content">
        {content.map((element, index) => { return (
          index % 2 === 0 ?
          <button
            key={index}
            className={'question' + (index === selected[0] ? ' selected' : '')}
            style={{backgroundColor: element.set ? 'var(--color3)' : ''}}
            onDragOver={event => event.preventDefault()}
            onDrop={event => handleDrop(event, index)}
            onClick={() => {
              setSelected((prevState) => {
                const update = prevState.slice();
                update[0] = index;
                if (update[0] !== -1 && update[1] !== -1) {
                  console.log(update[0] + ' ' + update[1])
                  updateArray(update[0], update[1]);
                  return [-1, -1];
                }
                return update;
              });
            }}
          >
            {element.text}
          </button>
          :
          <button
            key={index}
            className={'answer' + (index === selected[1] ? ' selected' : '')}
            style={{backgroundColor: element.set ? 'var(--color3)' : ''}}
            onDragStart={(event) => event.dataTransfer.setData('answerIndex', index)}
            onClick={() => {
              setSelected((prevState) => {
                const update = prevState.slice();
                update[1] = index;
                if (update[0] !== -1 && update[1] !== -1) {
                  console.log(update[0] + ' ' + update[1])
                  updateArray(update[0], update[1]);
                  return [-1, -1];
                }
                return update;
              });
            }}
            //draggable
          >
            {element.text}
          </button>
        )})}
      </div>}
      {content && <div className='buttons'>
        <button onClick={() => {setContent(false); setSelected([-1, -1])}}><img src={reload} alt='reset input' /></button>
        <button onClick={() => handleDownload(content)}><img src={download} alt='download' /></button>
      </div>}
    </div>
  );
}
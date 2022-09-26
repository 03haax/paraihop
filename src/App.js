import './css/App.css';
import reload from './img/reload.svg';
import checklist from './img/checklist.svg';
import arrow from './img/arrow.svg';
import { useState } from 'react';

import questions from './json/questions.json'
import facit from './json/facit.json'

import JSConfetti from 'js-confetti'

export default function App() {
  const [content, setContent] = useState(false);
  const [selected, setSelected] = useState([-1, -1]);
  const [page, setPage] = useState("");

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

  const check = (page, content) => {
    let allCorrect = true;
    for (let i = 0; i < facit[page].length; i++) {
      if (facit[page][i] !== content[i * 2 + 1].text) {
        content[i * 2].set = false;
        content[i * 2 + 1].set = false;
        allCorrect = false;
      }
    }

    setContent((prevState) => { const update = prevState.slice(); return update });

    if (allCorrect) {
      const jsConfetti = new JSConfetti()

      jsConfetti.addConfetti()
    }
  }

  const handlePage = (page) => {
    page = parseInt(page);
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].page === page) {

        if (questions[i].page === questions[i + 1].page) {
          let duplicate = parseInt(prompt("There are two questions on this page. Do you want 1 or 2?"));
          if (duplicate !== 1 && duplicate !== 2) break;
          if (duplicate === 2) i++;
        }

        let array = [];

        const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

        for (let x = 0; x < questions[i].questions.length; x++) {
          array.push({text: questions[i].questions[x], set: false, key: x + 1});
          array.push({text: questions[i].answers[x], set: false, key: letters[x]});
        }
        setPage(i);
        setContent(array);
        break;
      };
    }

    //no match
  }

  const handleKeyDown = (e, page) => {
    if (e.key === 'Enter') handlePage(page);
  }

  const handleChange = (e) => {
    setPage((prevState) => (e.target.validity.valid) ? e.target.value : prevState);
  }

  const handleClick = (index, i) => {
    setSelected((prevState) => {
      const update = prevState.slice();
      if (update[i] === index) {update[i] = -1; return update}  
      update[i] = index;
      if (update[0] !== -1 && update[1] !== -1) {
        updateArray(update[0], update[1]);
        return [-1, -1];
      }
      return update;
    });
  }

  return (
    <div className="App">
      {!content && <div id="page">
        <label htmlFor="pageInput">
          Look in the <a href="https://fileadmin.cs.lth.se/pgk/compendium.pdf">compendium</a> and enter a pagenumber to get the corresponding question
        </label>
        <input 
          type="text" 
          name="page"
          id="pageInput"
          onKeyDown={event => handleKeyDown(event, page)}
          onChange={handleChange}
          value={page}
          pattern="[0-9]*"
          autoFocus
        />
        <button 
          onClick={() => handlePage(page)}
        >
          <img src={arrow} alt="get page" />
        </button>
      </div>
      }
      {content && <div className="content">
        {content.map((element, index) => { return (
          index % 2 === 0 ?
          <button
            key={element.key}
            className={`question${index === selected[0] ? ' selected' : ''}${element.set ? ' set' : ''}`}
            onClick={() => handleClick(index, 0)}
          >
            {element.text}
          </button>
          :
          <button
            key={element.key}
            className={`answer${index === selected[1] ? ' selected' : ''}${element.set ? ' set' : ''}`}
            onClick={() => handleClick(index, 1)}
          >
            {element.text}
          </button>
        )})}
      </div>}
      {content && <div className='buttons'>
        <button onClick={() => {
          setContent(false); 
          setSelected([-1, -1]);
          setPage("");
        }}>
          <img src={reload} alt='reset input' />
        </button>
        <button onClick={() => check(page, content)}>
          <img src={checklist} alt='check answers' />
        </button>
      </div>}
    </div>
  );
}
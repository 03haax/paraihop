import { useState } from 'react';

import './css/Facit.css';

export default function Question() {
  const [long, setLong] = useState("");

  const handlePaste = (event, short) => {
    const str = event.clipboardData.getData('text');
    let array = str.split(/ [0-9]+[ ]{1,}[A-Z] |\n/);
    
    let questions = [], answers = [];
    for (let i = 0; i < array.length; i++) {
      let value = JSON.stringify(array[i]);
      i % 2 === 0 ? 
      questions.push(value):
      answers.push(value);
    }

    const page = prompt('page:');
    if (page === null) return;

    setLong((prevState) => `${prevState}{\n"page":${page},\n"questions":[${questions}],\n"answers":[${answers}]\n},\n`)
  }

  return (
    <div className="Facit">
        <textarea
            id="long"
            onPaste={handlePaste}
            readOnly
            autoFocus
            value={long}
        />
    </div>
  );
}
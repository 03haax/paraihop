import { useState } from 'react';

import './css/Facit.css';

export default function Facit2() {
  const [long, setLong] = useState("");

  const handlePaste = (event, short) => {
    const str = event.clipboardData.getData('text');
    let array = str.split(/ [0-9]+[ ]{1,}[A-Z] |\n/);
    
    let answers = [];
    for (let i = 1; i < array.length; i += 2) {
      let value = JSON.stringify(array[i]);
      answers.push(value);
    }

    setLong((prevState) => `${prevState}[${answers}],\n`)
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
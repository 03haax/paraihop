import { useState } from 'react';

import './css/Facit.css';

export default function Facit() {
  const [long, setLong] = useState("");

  const handlePaste = (event, short) => {
    const str = event.clipboardData.getData('text');
    let array = str.match(/ [0-9]+ [A-Z]/g);
    array = array.map((str) => str.slice(str.length - 1, str.length));
    
    array = array.map((str) => `"${str}"`);
    setLong((prevState) => `${prevState}[${array}],\n`)
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
import React, { useState } from 'react';

const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
    } else if (val === '=') {
      try {
        // eslint-disable-next-line
        const result = eval(equation + display);
        setDisplay(String(result));
        setEquation('');
      } catch {
        setDisplay('Error');
      }
    } else if (['+', '-', '*', '/'].includes(val)) {
      setEquation(equation + display + val);
      setDisplay('0');
    } else {
      setDisplay(display === '0' ? val : display + val);
    }
  };

  const buttons = [
    'C', '±', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  return (
    <div className="h-full flex flex-col bg-neutral-900 text-white">
      <div className="flex-1 flex flex-col items-end justify-end p-6 bg-black/20">
        <div className="text-white/40 text-sm h-6">{equation}</div>
        <div className="text-4xl font-light tracking-wider">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-px bg-white/10 p-px">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handlePress(btn)}
            className={`
              h-14 flex items-center justify-center text-lg font-medium transition-colors
              ${btn === '=' ? 'col-span-2 bg-cyan-600 hover:bg-cyan-500' : 'bg-neutral-800 hover:bg-neutral-700'}
              ${['/', '*', '-', '+'].includes(btn) ? 'bg-neutral-900 text-cyan-400' : ''}
            `}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalculatorApp;
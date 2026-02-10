import { useState } from 'react';
import { Calculator as CalcIcon, X } from 'lucide-react';

const Calculator = ({ onCalculate }) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    const current = parseFloat(display);
    
    if (prevValue === null) {
      setPrevValue(current);
    } else if (operator) {
      const result = calculate(prevValue, current, operator);
      setDisplay(String(result));
      setPrevValue(result);
    }
    
    setOperator(op);
    setIsNewNumber(true);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operator && prevValue !== null) {
      const current = parseFloat(display);
      const result = calculate(prevValue, current, operator);
      setDisplay(String(result));
      setPrevValue(null);
      setOperator(null);
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setIsNewNumber(true);
  };

  const handleUse = () => {
    const value = parseFloat(display);
    if (!isNaN(value) && onCalculate) {
      onCalculate(value);
    }
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['C', '0', '=', '+']
  ];

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-3 w-full max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalcIcon size={16} className="text-blue-500" />
          <span className="text-sm font-semibold">Kalkulator</span>
        </div>
      </div>

      {/* Display */}
      <div className="bg-dark-bg border border-gray-700 rounded-lg p-3 mb-3">
        <div className="text-right text-2xl font-mono font-bold truncate">
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {buttons.flat().map((btn, idx) => {
          const isOperator = ['+', '-', '*', '/'].includes(btn);
          const isEquals = btn === '=';
          const isClear = btn === 'C';
          
          return (
            <button
              key={idx}
              onClick={() => {
                if (btn === 'C') handleClear();
                else if (btn === '=') handleEquals();
                else if (isOperator) handleOperator(btn);
                else handleNumber(btn);
              }}
              className={`p-3 rounded-lg font-semibold transition-colors ${
                isClear
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : isEquals
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : isOperator
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {btn}
            </button>
          );
        })}
      </div>

      {/* Use Button */}
      <button
        onClick={handleUse}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-colors"
      >
        Gunakan Hasil
      </button>
    </div>
  );
};

export default Calculator;

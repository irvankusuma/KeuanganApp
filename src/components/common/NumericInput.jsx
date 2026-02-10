import { useState } from 'react';
import { Calculator, X } from 'lucide-react';
import { formatInputNumber } from '../utils/formatters';

const NumericInput = ({ value, onChange, placeholder = "0", label, required = false }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('');
  const [calcOperation, setCalcOperation] = useState(null);
  const [prevValue, setPrevValue] = useState(null);

  const handleCalcNumber = (num) => {
    if (calcDisplay === '0') {
      setCalcDisplay(num.toString());
    } else {
      setCalcDisplay(calcDisplay + num);
    }
  };

  const handleCalcOperation = (op) => {
    if (calcDisplay) {
      setPrevValue(parseFloat(calcDisplay.replace(/\./g, '')));
      setCalcOperation(op);
      setCalcDisplay('');
    }
  };

  const handleCalcEquals = () => {
    if (prevValue !== null && calcOperation && calcDisplay) {
      const current = parseFloat(calcDisplay.replace(/\./g, ''));
      let result = 0;
      
      switch (calcOperation) {
        case '+': result = prevValue + current; break;
        case '-': result = prevValue - current; break;
        case '*': result = prevValue * current; break;
        case '/': result = current !== 0 ? prevValue / current : 0; break;
        default: result = current;
      }
      
      setCalcDisplay(result.toString());
      setPrevValue(null);
      setCalcOperation(null);
    }
  };

  const handleCalcClear = () => {
    setCalcDisplay('');
    setPrevValue(null);
    setCalcOperation(null);
  };

  const handleUseCalcResult = () => {
    if (calcDisplay) {
      onChange({ target: { value: formatInputNumber(calcDisplay) } });
      setShowCalculator(false);
      handleCalcClear();
    }
  };

  return (
    <div>
      {label && <label className="label">{label}</label>}
      
      <div className="flex gap-2">
        <input
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange({ target: { value: formatInputNumber(e.target.value) } })}
          className="input-field flex-1"
          placeholder={placeholder}
          required={required}
        />
        
        <button
          type="button"
          onClick={() => setShowCalculator(true)}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          title="Kalkulator"
        >
          <Calculator size={20} />
        </button>
      </div>

      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Kalkulator</h3>
              <button onClick={() => setShowCalculator(false)} className="text-gray-400 hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <div className="bg-dark-bg p-4 rounded-lg mb-4 min-h-[60px]">
              {prevValue !== null && (
                <div className="text-xs text-gray-400 mb-1">
                  {prevValue.toLocaleString('id-ID')} {calcOperation || ''}
                </div>
              )}
              <div className="text-2xl font-mono text-right">
                {calcDisplay ? parseInt(calcDisplay).toLocaleString('id-ID') : '0'}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <button onClick={handleCalcClear} className="p-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium col-span-2">C</button>
              <button onClick={() => setCalcDisplay(calcDisplay.slice(0, -1))} className="p-3 bg-gray-600 hover:bg-gray-700 rounded-lg">←</button>
              <button onClick={() => handleCalcOperation('/')} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">÷</button>

              <button onClick={() => handleCalcNumber(7)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg">7</button>
              <button onClick={() => handleCalcNumber(8)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg">8</button>
              <button onClick={() => handleCalcNumber(9)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg">9</button>
              <button onClick={() => handleCalcOperation('*')} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">×</button>

              <button onClick={() => handleCalcNumber(4)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg">4</button>
              <button onClick={() => handleCalcNumber(5)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg">5</button>
              <button onClick={() => handleCalcNumber(6)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg">6</button>
              <button onClick={() => handleCalcOperation('-')} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">−</button>

              <button onClick={() => handleCalcNumber(1)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg">1</button>
              <button onClick={() => handleCalcNumber(2)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg">2</button>
              <button onClick={() => handleCalcNumber(3)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg">3</button>
              <button onClick={() => handleCalcOperation('+')} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">+</button>

              <button onClick={() => handleCalcNumber(0)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg col-span-2">0</button>
              <button onClick={() => setCalcDisplay(calcDisplay + '00')} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg">00</button>
              <button onClick={handleCalcEquals} className="p-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium">=</button>
            </div>

            <button
              onClick={handleUseCalcResult}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
            >
              Gunakan: {calcDisplay ? formatInputNumber(calcDisplay) : 'Rp 0'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NumericInput;

import React, { useState, useEffect } from 'react';
import { Lock, Delete, Shield, KeyRound } from 'lucide-react';
import { LandlordProfile } from '../types/index.ts';

interface SecurityPinModalProps {
  isOpen: boolean;
  profile: LandlordProfile;
  onUnlock: () => void;
}

export const SecurityPinModal: React.FC<SecurityPinModalProps> = ({
  isOpen,
  profile,
  onUnlock,
}) => {
  if (!isOpen) return null;

  const targetPin = profile.pinCode || '1234';
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [errorAnimation, setErrorAnimation] = useState<boolean>(false);

  useEffect(() => {
    setEnteredPin('');
    setErrorAnimation(false);
  }, [isOpen]);

  const handleKeyPress = (digit: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === targetPin) {
          setTimeout(() => {
            onUnlock();
          }, 150);
        } else {
          setErrorAnimation(true);
          setTimeout(() => {
            setEnteredPin('');
            setErrorAnimation(false);
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-14 h-14 rounded-2xl bg-[#14281D] text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          Enter Security PIN
        </h2>
        <p className="text-xs text-stone-500 mt-1 mb-6">
          Commercial rent records and WhatsApp credentials are protected.
        </p>

        {/* 4 Digit Indicators */}
        <div
          className={`flex justify-center gap-3.5 mb-8 ${
            errorAnimation ? 'animate-shake text-rose-500' : ''
          }`}
        >
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = enteredPin.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-emerald-700 scale-110 shadow-2xs'
                    : 'bg-stone-200 border border-stone-300'
                }`}
              />
            );
          })}
        </div>

        {errorAnimation && (
          <div className="text-xs font-semibold text-rose-600 mb-4 animate-in fade-in">
            Incorrect PIN. Try again.
          </div>
        )}

        {/* Number Pad for Mobile and Desktop Touch */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-12 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 text-lg font-bold transition-colors flex items-center justify-center cursor-pointer select-none"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setEnteredPin('')}
            className="h-12 rounded-xl text-stone-400 hover:text-stone-700 text-xs font-semibold flex items-center justify-center cursor-pointer"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 text-lg font-bold transition-colors flex items-center justify-center cursor-pointer select-none"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete last digit"
            className="h-12 rounded-xl text-stone-500 hover:text-stone-800 flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] text-stone-400 mt-6 flex items-center justify-center gap-1">
          <Shield className="w-3.5 h-3.5 text-stone-400" />
          <span>Device Encryption Active</span>
        </div>
      </div>
    </div>
  );
};

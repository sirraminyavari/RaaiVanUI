import React, { useContext, useState } from 'react';
import './final.step.css';
import Loading from './loading.animation.gif';
import { StepperContext } from './context/stepper.context';

const FinalStep = () => {
  const { dispatch } = useContext(StepperContext);
  const [loading, setLoading] = useState(false);

  const letsGo = () => {
    setLoading(true);
    dispatch({ type: 'NEXT_STEP' });
  };
  return (
    <div className="final-step">
      {!loading && (
        <div>
          <h1>خدا قوت!</h1>
          <h1>آماده‌ای بریم توی محیط کلیک‌مایند؟</h1>
          <div className="final-action">
            <button className="ActionButton" onClick={() => letsGo()}>
              {'آرررره! بزن بریم!'}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div>
          <div className="loading">
            <img src={Loading} />

            <h1 className="loading-title">{'یه کم صبر کنی تیمت آمادست!'}</h1>
          </div>
        </div>
      )}
    </div>
  );
};
export default FinalStep;

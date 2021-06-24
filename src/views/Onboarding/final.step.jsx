import React, { useContext, useState } from 'react';
import './final.step.css';
import Loading from './loading.animation.gif';
import { StepperContext } from './context/stepper.context';
import APIHandler from 'apiHelper/APIHandler';
import { encode } from 'js-base64';
import { finish_on_start } from './message';

const FinalStep = () => {
  const { info, dispatch } = useContext(StepperContext);
  // const [loading, setLoading] = useState(false);

  const letsGo = () => {
    new APIHandler('RVAPI', 'Log').fetch(
      { data: encode(finish_on_start) },
      (res) => {
        dispatch({ type: 'NEXT_STEP' });
        dispatch({ type: 'TOGGLE_LOADING' });
      }
    );
  };
  return (
    <div className="final-step">
      {!info.loading && (
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

      {info.loading && (
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

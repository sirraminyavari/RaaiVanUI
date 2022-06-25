import React, { useContext, useEffect } from 'react';
import './final.step.css';
import Loading from 'assets/images/loading_cliqmind.gif';
import { StepperContext } from './context/stepper.context';
import API from 'apiHelper';
import { encode } from 'js-base64';
import { finish_on_start } from './message';
import { useHistory } from 'react-router-dom';
import APIHandler from 'apiHelper/APIHandler';
import { useDispatch } from 'react-redux';
import { useOnboardingSlice } from 'store/slice/onboarding';

const activateTemplate = async (x, appId) => {
  const res = await API.CN.getTemplateJSON({ NodeTypeID: x.id });
  return await API.CN.activateTemplate({ Template: res.Template });
};

const FinalStep = () => {
  const { info, dispatch } = useContext(StepperContext);
  const history = useHistory();

  const reduxDispatch = useDispatch();

  const { actions: onboardingActions } = useOnboardingSlice();

  useEffect(() => {
    let delay = undefined;
    if (info.templates.length !== 0) {
      dispatch({ type: 'TOGGLE_LOADING' });
      info.templates.forEach(async (x, index) => {
        try {
          await activateTemplate(x, info.applicationId);
          dispatch({ type: 'ACTIVATE_TEMPLATE', template: x });
          if (index === info.templates.length - 1) {
            delay = setTimeout(() => {
              dispatch({ type: 'TOGGLE_LOADING' });
              dispatch({ type: 'NEXT_STEP' });
            }, 4000);
          }
        } catch (e) {
          console.log('an error happend');
        }
      });
    } else {
    }

    return () => {
      if (delay) clearTimeout(delay);
    };
  }, []);

  const letsGo = () => {
    const { RVAPI } = window;
    new APIHandler('RVAPI', 'Log').fetch(
      { data: encode(finish_on_start) },
      (res) => {
        // redirect to clickmind workspace
        reduxDispatch(onboardingActions.toggleActivation());
        history.push(RVAPI?.ClassesPageURL());
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

import React, { useContext, useEffect, useState } from 'react';
import './final.step.css';
import Loading from '../../assets/images/loading_cliqmind.gif';
import { StepperContext } from './context/stepper.context';
import APIHandler from 'apiHelper/APIHandler';
import { encode } from 'js-base64';
import { finish_on_start } from './message';
import { useHistory } from 'react-router';

const activateTemplate = (x, appId) => {
  const handler = new APIHandler('CNAPI', 'GetTemplateJSON');
  const activator = new APIHandler('CNAPI', 'ActivateTemplate');

  return new Promise((resolve, reject) => {
    handler.fetch(
      {
        NodeTypeID: x.id,
      },
      (content) => {
        activator.fetch(
          {
            Template: JSON.stringify(content.Template),
          },
          (res) => {
            if (!!res.Succeed) {
              resolve(res);
            } else {
              reject(res);
            }
          }
        );
      }
    );
  });
};

const FinalStep = () => {
  const { info, dispatch } = useContext(StepperContext);
  const history = useHistory();

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
    new APIHandler('RVAPI', 'Log').fetch(
      { data: encode(finish_on_start) },
      (res) => {
        // redirect to clickmind workspace
        // dispatch({ type: 'TOGGLE_TOUR' });
        history.push('/classes');
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

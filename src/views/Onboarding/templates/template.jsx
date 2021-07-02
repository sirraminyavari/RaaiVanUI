import APIHandler from 'apiHelper/APIHandler';
import React, { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';
import SelectedTemplates from './selected.templates';
import './template.css';
import TemplateSlider from './template.slider';
import { useBeforeunload, useOnLoad } from '../hook/hooks';
import {
  template_selection_on_start,
  template_selection_on_exit,
  template_selection_on_skip,
} from '../message';
import { encode } from 'js-base64';

const activateTemplate = (x) => {
  const handler = new APIHandler('CNAPI', 'GetTemplateJSON');
  const activator = new APIHandler('CNAPI', 'ActivateTemplate');

  return new Promise((resolve, reject) => {
    handler.fetch(
      {
        NodeTypeID: x.id,
      },
      (content) => {
        console.log(content);
        activator.fetch(
          {
            Template: content,
          },
          (res) => {
            if (!!res.Succedd) {
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

const Template = () => {
  const { info, dispatch } = useContext(StepperContext);

  useOnLoad(template_selection_on_start);
  useBeforeunload(template_selection_on_exit);

  const activate = () => {
    // info.templates.forEach(async (x) => {
    //   try {
    //     await activateTemplate(x);
    //     dispatch({ type: 'ACTIVATE_TEMPLATE', template: x });
    //   } catch (e) {
    //     console.log('an error happend');
    //   }
    // });
    dispatch({ type: 'NEXT_STEP' });
  };

  const skip = () => {
    dispatch({ type: 'CLEAR_TEMPLATES' });
    new APIHandler('RVAPI', 'Log').fetch(
      { data: encode(template_selection_on_skip) },
      (res) => {
        dispatch({ type: 'NEXT_STEP' });
      }
    );
  };

  return (
    <div className="template-part">
      <div className="template-title">
        <h3>
          {' '}
          {`واسه دغدغه‌هات تو زمینه ${info.field.value} قالب‌های زیر رو طراحی کردیم؛ هر کدوم 
                رو که نیاز داری، واسه تیمت فعال کن`}
        </h3>
      </div>

      <div className="template-selection-block">
        <div>
          <TemplateSlider />
          {info.templates.length !== 0 && (
            <div className="select-templates-number">
              <span>{info.templates.length}</span>
              <span>قالب انتخاب شده</span>
            </div>
          )}
        </div>

        <div>
          <SelectedTemplates />

          <div className="templates-action">
            {info.templates.length === 0 && (
              <div>
                <button className="disabled-button-inverted">
                  فعال کن و برو مرحله بعد
                </button>

                <button
                  className="action-button-inverted"
                  onClick={() => skip()}>
                  از این مرحله رد شو
                </button>
              </div>
            )}

            {info.templates.length !== 0 && (
              <div>
                <button className="ActionButton" onClick={() => activate()}>
                  فعال کن و برو مرحله بعد
                </button>

                <button
                  className="action-button-inverted"
                  onClick={() => skip()}>
                  از این مرحله رد شو
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Template;

import React, { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';
import SelectedTemplates from './selected.templates';
import './template.css';
import TemplateSlider from './template.slider';

const Template = () => {
  const { info, dispatch } = useContext(StepperContext);

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
        <TemplateSlider />

        <SelectedTemplates />
      </div>

      <div className="templates-action">
        <button
          className="ActionButton"
          onClick={() => dispatch({ type: 'NEXT_STEP' })}>
          فعال کن و برو مرحله بعد
        </button>
      </div>
    </div>
  );
};
export default Template;

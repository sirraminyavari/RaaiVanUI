import classNames from 'classnames';
import { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';

const SelectedTemplates = () => {
  const { info } = useContext(StepperContext);

  return (
    <div
      style={{ width: '600px', height: '330px' }}
      className="selected-template-container">
      selected
    </div>
  );
};
export default SelectedTemplates;

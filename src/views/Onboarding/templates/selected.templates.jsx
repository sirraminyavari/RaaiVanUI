import { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';

const SelectedTemplates = () => {
  const { info } = useContext(StepperContext);

  return <div style={{ width: '600px' }}>selected</div>;
};
export default SelectedTemplates;

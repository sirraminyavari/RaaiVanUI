import classNames from 'classnames';
import { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';
import './selected.templates.css';
import SelectedTemplatesBox from './selected.templates.box';
import { v4 as uuidv4 } from 'uuid';

const SelectedTemplates = () => {
  const { info } = useContext(StepperContext);

  const layers = info.templates.map((x, index) => {
    if (index === 0) return;
    const offset = `${index * -8}px`;
    const zIndex = 100 - index;
    return (
      <SelectedTemplatesBox
        key={uuidv4()}
        zIndex={zIndex}
        show={false}
        translateX={offset}
        translateY={offset}
      />
    );
  });
  return (
    <div
      style={{ width: '600px', height: '330px' }}
      className="selected-template-container">
      {info.templates.length === 0 && (
        <div className="no-template-selected">{'قالبی فعال نکردید'}</div>
      )}
      {info.templates.length !== 0 && (
        <div>
          <SelectedTemplatesBox
            zIndex="100"
            show={true}
            translateX="0"
            translateY="0"
          />
          {layers}
        </div>
      )}
    </div>
  );
};
export default SelectedTemplates;

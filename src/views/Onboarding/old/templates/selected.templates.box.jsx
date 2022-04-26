import { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';

const SelectedTemplatesBox = ({ zIndex, translateX, translateY, show }) => {
  const { info } = useContext(StepperContext);
  return (
    <div
      className="selected-box"
      style={{ zIndex, transform: `translate(${translateX}, ${translateY})` }}
    >
      {show && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {info.templatePreview && <div>{info.templatePreview.name}</div>}
        </div>
      )}
    </div>
  );
};
export default SelectedTemplatesBox;

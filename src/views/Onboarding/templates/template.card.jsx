import React, { useContext, useEffect, useState } from 'react';
import { StepperContext } from '../context/stepper.context';
import CheckIcon from '../arrows/check.icon';

const TemplateCard = ({ item }) => {
  const { info, dispatch } = useContext(StepperContext);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const exist = info.templates.find((x) => x.id === item.id);
    setSelected(exist);
  }, [info]);

  return (
    <div className="template-card-container">
      <div
        className="template-card"
        onClick={() => dispatch({ type: 'TOGGLE_TEMPLATE', template: item })}>
        {selected && (
          <div className="badge">
            <CheckIcon />
          </div>
        )}
        {!selected && <div className="badge-empty"></div>}
        {/*{ selected && <img className="badge-icon" src={BadgeIcon} height="16px" width="16px" /> }*/}
      </div>
    </div>
  );
};
export default TemplateCard;

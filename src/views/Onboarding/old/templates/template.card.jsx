import React, { useContext, useEffect, useState } from 'react';
import { StepperContext } from '../context/stepper.context';
import CheckIcon from '../arrows/check.icon';
import APIHandler from 'apiHelper/APIHandler';

const TemplateCard = ({ item }) => {
  const { info, dispatch } = useContext(StepperContext);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const exist = info.templates.find((x) => x.id === item.id);
    setSelected(exist);
  }, [info]);

  const toggle = () => {
    dispatch({ type: 'TOGGLE_TEMPLATE', template: item });
    // if (!selected) {
    //   new APIHandler("CNAPI","GetTemplateJSON").fetch({
    //     NodeTypeID: item.id
    //   }, content => {
    //     console.log(content)

    //   })
    // }
  };

  return (
    <div className="template-card-container">
      <div className="template-card" onClick={() => toggle()}>
        <div className="card-content noselect">
          <img src={item.IconURL} alt="" />

          <div className="card-title-block">
            <div className="card-title">{item.name}</div>
            <div className="card-subtitle">{'مدیریت دانش'}</div>
          </div>

          <div>
            <p className="card-discription">
              {
                'با اقدامات و گام های منحصر به فرد و اصوای در تدوین پروژه منتظر خروجی قابل قبول باشید'
              }
            </p>
          </div>
        </div>
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

import React, { useContext, useState, useEffect, useRef } from 'react';
import './template.slider.css';
import ArrowUp from '../arrows/up.png';
import ArrowDown from '../arrows/down.png';
import TemplateCard from './template.card';
import APIHandler from 'apiHelper/APIHandler';
import { StepperContext } from '../context/stepper.context';
import { decode } from 'js-base64';
import { v4 as uuidv4 } from 'uuid';

const TemplateSlider = () => {
  const { info, dispatch } = useContext(StepperContext);
  const [showPrevBtn, setShowPrevBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [index, setIndex] = useState(0);
  const templateTrack = useRef();

  useEffect(() => {
    new APIHandler('CNAPI', 'GetTemplates').fetch(
      {
        TagID: info.field.id,
      },
      (res) => {
        if (!!res.Templates) {
          const _templates = res.Templates.map((x) => ({
            ...x,
            id: x.NodeTypeID,
            name: decode(x.TypeName),
          }));
          dispatch({ type: 'TEMPLATE_PREVIEW', template: _templates[0] });
          setTemplates(_templates);
        }
      }
    );
  }, []);

  const btnDisplay = () => {
    if (index < templates.length) {
      setShowNextBtn(true);
    } else {
      setShowNextBtn(false);
    }

    if (index > 1) {
      setShowPrevBtn(true);
    } else {
      setShowPrevBtn(false);
    }
  };

  const next = () => {
    if (index < templates.length) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const move = (e) => {
    if (e.deltaY > 0) {
      // scroll up
      next();
    } else if (e.deltaY < 0) {
      // scroll down
      prev();
    }
  };

  useEffect(() => {
    dispatch({ type: 'TEMPLATE_PREVIEW', template: templates[index - 1] });
    btnDisplay();
    templateTrack.current.style.transform = `translateY(-${
      (index - 1) * 150
    }px)`;
  }, [index]);

  useEffect(() => {
    btnDisplay();
  }, [templates]);

  return (
    <div className="template-slider">
      <div className="template-prev-btn template-prev-align">
        {showPrevBtn && <img src={ArrowUp} alt="" onClick={() => prev()} />}
      </div>
      <div className="template-carousel-container">
        <div
          className="template-track"
          ref={templateTrack}
          onWheel={(e) => move(e)}>
          {templates.length !== 0 &&
            templates.map((x) => <TemplateCard key={uuidv4()} item={x} />)}
        </div>
      </div>
      <div className="template-next-btn template-next-align">
        {showNextBtn && <img src={ArrowDown} alt="" onClick={() => next()} />}
      </div>
    </div>
  );
};
export default TemplateSlider;

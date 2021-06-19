import React, { useContext, useState, useEffect, useRef } from 'react';
import './template.slider.css';
import ArrowUp from '../arrows/up.png';
import ArrowDown from '../arrows/down.png';
import TemplateCard from './template.card';
import APIHandler from 'apiHelper/APIHandler';

const TemplateSlider = () => {
  const templates = [1, 2, 3, 4, 5];

  // useEffect(() => {
  //   APIHandler("", "").fetch()
  // })

  const [index, setIndex] = useState(0);
  const templateTrack = useRef();

  const next = () => {
    if (index < templateTrack.current.offsetWidth / 300 + 1) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const selectTeam = (team) => {};

  useEffect(() => {
    templateTrack.current.style.transform = `translateY(-${index * 300}px)`;
  }, [index]);

  return (
    <div className="template-slider">
      <div className="template-prev-btn template-prev-align">
        <img src={ArrowUp} alt="" onClick={() => prev()} />
      </div>
      <div className="template-carousel-container">
        <div className="template-track" ref={templateTrack}>
          {templates.map((x) => (
            <TemplateCard key={x} item={x} />
          ))}
        </div>
      </div>
      <div className="template-next-btn template-next-align">
        <img src={ArrowDown} alt="" onClick={() => next()} />
      </div>
    </div>
  );
};
export default TemplateSlider;

import React, { useContext, useState, useEffect, useRef } from 'react';
import './template.slider.css';
import ArrowUp from '../arrows/up.png';
import ArrowDown from '../arrows/down.png';
import TemplateCard from './template.card';
import APIHandler from 'apiHelper/APIHandler';
import { getUUID } from 'helpers/helpers';

const TemplateSlider = () => {
  const templates = [
    {
      id: 1,
      title: '',
      icon: 'Time',
      url: 'http://time.is',
    },
    {
      id: 2,
      title: '',
      icon: 'React',
      url: 'https://reactjs.org/',
    },
    {
      id: 3,
      title: '',
      icon: '',
      url: 'http://time.is',
    },
    {
      id: 4,
      title: '',
      icon: '',
      url: 'https://reactjs.org/',
    },
  ];

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
            <TemplateCard key={x.id} item={x} />
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

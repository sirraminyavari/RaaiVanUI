import React, { useEffect, useRef, useState } from 'react';
import './teams.slider.css';

import ArrowRight from '../arrows/right.png';
import ArrowLeft from '../arrows/left.png';
import TeamCard from './team.card';

const TeamsSlider = () => {
  const teamsInvitedTo = [
    { id: 1, name: 'تیم شاهین', avatar: '' },
    { id: 2, name: 'تیم بارسلونا', avatar: '' },
    { id: 3, name: 'تیم واچرز', avatar: '' },
  ];

  const [index, setIndex] = useState(0);
  const track = useRef();

  const next = () => {
    if (index < track.current.offsetWidth / 200 + 1) {
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
    track.current.style.transform = `translateX(${index * 200}px)`;
  }, [index]);

  const teams = teamsInvitedTo.map((x) => (
    <TeamCard key={x.id} team={x} selectTeam={selectTeam} />
  ));

  return (
    <div className="slider">
      <div className="prev-btn prev-align">
        <img src={ArrowRight} alt="" onClick={() => prev()} />
      </div>
      <div className="carousel-container">
        <div className="track" ref={track}>
          {teams}
        </div>
      </div>
      <div className="next-btn next-align">
        <img src={ArrowLeft} alt="" onClick={() => next()} />
      </div>
    </div>
  );
};
export default TeamsSlider;

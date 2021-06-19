import React, { useEffect, useRef, useState } from 'react';
import './teams.slider.css';
import { decode } from 'js-base64';

import ArrowRight from '../arrows/right.png';
import ArrowLeft from '../arrows/left.png';
import TeamCard from './team.card';
import APIHandler from 'apiHelper/APIHandler';

const TeamsSlider = () => {
  const teamsInvitedTo = [
    { id: 1, name: 'تیم شاهین', avatar: '' },
    { id: 2, name: 'تیم بارسلونا', avatar: '' },
    // { id: 3, name: 'تیم واچرز', avatar: '' },
    // { id: 4, name: 'تیم واچرز', avatar: '' },
    // { id: 5, name: 'تیم واچرز', avatar: '' },
  ];

  const [index, setIndex] = useState(0);
  const [showPrevBtn, setShowPrevBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const track = useRef();

  useEffect(() => {
    new APIHandler('UsersAPI', 'GetCurrentInvitations').fetch({}, (res) => {
      if (!res.NoApplicationFound) {
      }
    });
  }, []);

  const btnDisplay = () => {
    if (index <= track.current.offsetWidth / 200) {
      setShowNextBtn(true);
    } else {
      setShowNextBtn(false);
    }

    if (index > 0) {
      setShowPrevBtn(true);
    } else {
      setShowPrevBtn(false);
    }
  };

  const next = () => {
    if (index <= track.current.offsetWidth / 200) {
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
    btnDisplay();
    track.current.style.transform = `translateX(${index * 200}px)`;
  }, [index]);

  const teams = teamsInvitedTo.map((x) => (
    <TeamCard key={x.id} team={x} selectTeam={selectTeam} />
  ));

  return (
    <div className="slider">
      <div className="prev-btn prev-align">
        {showPrevBtn && <img src={ArrowRight} onClick={() => prev()} />}
      </div>
      <div className="carousel-container">
        <div className="track" ref={track}>
          {teams}
        </div>
      </div>
      <div className="next-btn next-align">
        {showNextBtn && <img src={ArrowLeft} onClick={() => next()} />}
      </div>
    </div>
  );
};
export default TeamsSlider;

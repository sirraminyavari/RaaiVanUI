import React, { useEffect, useRef, useState } from 'react';
import './teams.slider.css';
import ArrowRight from '../arrows/right.png';
import ArrowLeft from '../arrows/left.png';
import TeamCard from './team.card';

const TeamsSlider = ({ teamsInvitedTo }) => {
  const [index, setIndex] = useState(1);
  const [showPrevBtn, setShowPrevBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const track = useRef();

  const btnDisplay = () => {
    console.log(track);
    if (track.current.scrollWidth > index * track.current.offsetWidth) {
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
    if (track.current.scrollWidth > index * track.current.offsetWidth) {
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
    track.current.style.transform = `translateX(${(index - 1) * 200}px)`;
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

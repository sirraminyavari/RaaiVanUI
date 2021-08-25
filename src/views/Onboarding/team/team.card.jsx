import React from 'react';
import teamLogo from './icon01.jpg';

const TeamCard = ({ team, selectTeam }) => {
  return (
    <div className="card-container" onClick={() => selectTeam(team)}>
      <img src={teamLogo} alt={teamLogo} />
      <p>{team.name}</p>
    </div>
  );
};
export default TeamCard;

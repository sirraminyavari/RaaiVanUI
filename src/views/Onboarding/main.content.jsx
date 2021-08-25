import React, { useContext, useEffect } from 'react';
import { StepperContext } from './context/stepper.context';
import Intro from './intro/intro';
import StepperProgress from './stepper.progress';
import './styles.css';
import Team from './team/team';
import TeamInfo from './teams-info/team.info';
import Template from './templates/template';
import FinalStep from './final.step';
import Header from './header/header';

const MainContent = (props) => {
  const { info, dispatch } = useContext(StepperContext);

  const steps = (step) => {
    switch (step) {
      case 0:
        return <Intro />;
      case 1:
        return <Team />;
      case 2:
        return <TeamInfo />;
      case 3:
        return <Template />;
      case 4:
        return <FinalStep />;
      default:
        return <FinalStep />;
    }
  };

  return (
    <div className="main">
      <Header />
      <div className="content">
        {steps(info.step)}

        {info.step !== 0 && info.step < 5 && <StepperProgress />}
      </div>
    </div>
  );
};
export default MainContent;

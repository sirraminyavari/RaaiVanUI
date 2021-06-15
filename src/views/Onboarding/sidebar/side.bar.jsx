import React from 'react';
import { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';
import './sidebar.css';
import SidebarLogo from './sidebar.logo.png';

const SideBar = (props) => {
  const { info } = useContext(StepperContext);

  return (
    <div className="sidebar rv-bg-color-verywarm">
      <img src={SidebarLogo} alt="" width={200} />

      <div className="onboarding-sidbar-steps">
        {info.teamName !== '' && <div>{info.teamName}</div>}
      </div>
    </div>
  );
};
export default SideBar;

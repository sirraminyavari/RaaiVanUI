import React from 'react';
import { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';
import './sidebar.css';
import SidebarLogo from './sidebar.logo.png';
import SidebarSkeleton from './sidebar.skeleton';

const SideBar = (props) => {
  const { info } = useContext(StepperContext);

  return (
    <div className="sidebar rv-bg-color-verywarm">
      <img src={SidebarLogo} alt="" width={200} />

      {!info.loading && (
        <div className="onboarding-sidbar-steps">
          {info.teamName !== '' && <div>{info.teamName}</div>}
        </div>
      )}

      {info.loading && (
        <div className="onboarding-sidbar-steps">
          <SidebarSkeleton width="200px" />

          <SidebarSkeleton width="150px" />

          <SidebarSkeleton width="150px" />
        </div>
      )}
    </div>
  );
};
export default SideBar;

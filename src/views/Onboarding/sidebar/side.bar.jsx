import React from 'react';
import { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';
import './sidebar.css';
import SidebarLogo from './sidebar.logo.png';
import SidebarSkeleton from './sidebar.skeleton';
import { v4 as uuidv4 } from 'uuid';
import Loader from './loader.gif';

const SideBar = (props) => {
  const { info } = useContext(StepperContext);

  //const activatedTemplates = info.activatedTemplates.map(x => <div key={ uuidv4() }>{x.title}</div>)
  return (
    <div className="sidebar rv-bg-color-verywarm">
      <img src={SidebarLogo} alt="" width={200} />

      {!info.loading && (
        <div className="onboarding-sidbar-steps">
          {info.teamName !== '' && <div>{info.teamName}</div>}

          {info.field !== '' && (
            <div>
              <div>{info.field.value}</div>
              <div>
                {info.activatedTemplates.map((x) => (
                  <div key={uuidv4()} className="sidebar-selected-templates">
                    <img src={Loader}></img>
                    <div>{x.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

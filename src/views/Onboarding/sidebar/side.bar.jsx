import React from 'react';
import { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';
import './sidebar.css';
import SidebarLogo from './sidebar.logo.png';
import SidebarLoader from './sidebar.loader';
import { v4 as uuidv4 } from 'uuid';

const SideBar = (props) => {
  const { info } = useContext(StepperContext);

  //const activatedTemplates = info.activatedTemplates.map(x => <div key={ uuidv4() }>{x.title}</div>)
  return (
    <div className="sidebar rv-bg-color-verywarm">
      <div className="logo-container" data-tut="reactour__second">
        <img src={SidebarLogo} className="logo" />
      </div>
      <div className="onboarding-sidbar-steps" data-tut="reactour__third">
        {info.teamName !== '' && (
          <div style={{ fontWeight: '300' }}>{info.teamName}</div>
        )}

        <div style={{ marginTop: '10px' }}>
          {info.activatedTemplates.length !== 0 && <div>مدیریت محصول</div>}
          {info.activatedTemplates.map((x) => (
            <div key={uuidv4()} className="sidebar-selected-templates">
              <SidebarLoader key={uuidv4()} />
              <img src={x.IconURL} />
              <div className="title">{x.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* {info.loading && (
        <div className="onboarding-sidbar-steps">
          <SidebarSkeleton width="200px" />

          <SidebarSkeleton width="150px" />

          <SidebarSkeleton width="150px" />
        </div>
      )} */}
    </div>
  );
};
export default SideBar;

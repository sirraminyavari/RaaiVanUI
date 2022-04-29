import React from 'react';
import { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';
import './sidebar.css';
import SidebarLogo from 'assets/images/cliqmind_logo_white.svg';
import SidebarLoader from './sidebar.loader';
import { v4 as uuidv4 } from 'uuid';
import UnderMenuList from 'layouts/Sidebar/items/underMenu/UnderMenuList';
import FilledBookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import ListItem from 'layouts/Sidebar/items/underMenu/ListItem';
import DiamondIcon from 'components/Icons/DiamondIcon/Diamond';

const SideBar = (props) => {
  const { info } = useContext(StepperContext);

  //const activatedTemplates = info.activatedTemplates.map(x => <div key={ uuidv4() }>{x.title}</div>)
  return (
    <div className="sidebar rv-bg-color-verywarm">
      <div className="logo-container">
        <img src={SidebarLogo} className="logo" />
      </div>
      <div className="onboarding-sidbar-steps">
        {info.teamName !== '' && <div className="item">{info.teamName}</div>}

        <div style={{ marginTop: '15px', width: '100%' }}>
          {info.activatedTemplates.length !== 0 && (
            <div className="item">
              <div className="polygone"></div>
              <span className="small">مدیریت محصول</span>
            </div>
          )}

          <div style={{ marginTop: '15px' }}>
            {info.activatedTemplates.map((x, index) => (
              <div key={index} className="sidebar-selected-templates">
                <SidebarLoader key={index} />
                <img src={x.IconURL} />
                <div className="title">{x.name}</div>
              </div>
            ))}
          </div>
        </div>

        {info.step > 3 && (
          <div style={{ width: '100%' }}>
            <div className="seperator">
              <hr />
            </div>

            <ListItem title="موضوعات نشان شده" icon={FilledBookmarkIcon} />
            <ListItem title="گالری قالب ها" icon={DiamondIcon} />
          </div>
        )}
      </div>
    </div>
  );
};
export default SideBar;

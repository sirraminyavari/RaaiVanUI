import React, { useContext } from 'react';
import './header.css';
import HeaderThumbnail from './header.thumbnail';
import HeaderSkeleton from './header-skeleton';
import { StepperContext } from '../context/stepper.context';

const Header = () => {
  const { info } = useContext(StepperContext);
  return (
    <div className="onboarding-header rv-bg-color-lightwarm">
      <HeaderThumbnail />

      <div style={{ flexGrow: 1 }}></div>

      {info.loading && <HeaderSkeleton />}

      {info.loading && <HeaderSkeleton />}
    </div>
  );
};
export default Header;

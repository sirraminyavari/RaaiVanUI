import React from 'react';
import UrgentCreateDesktop from './UrgentCreateDesktop';
import UrgentCreateMobile from './UrgentCreateMobile';

/**
 * Here,just decides to return MobileView or DesktopView
 */
const UrgentCreate = ({ ...props }) => {
  return (
    <>
      {DiensionHelper().isTabletOrMobile ? (
        <UrgentCreateMobile {...props} />
      ) : (
        <UrgentCreateDesktop {...props} />
      )}
    </>
  );
};

export default UrgentCreate;

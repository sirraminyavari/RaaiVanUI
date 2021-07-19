import React from 'react';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import UrgentCreateDesktop from './UrgentCreateDesktop';
import UrgentCreateMobile from './UrgentCreateMobile';

/**
 * Here, decides to return MobileView or DesktopView
 */
const UrgentCreate = ({ ...props }) => {
  return (
    <>
      {DimensionHelper()?.isTabletOrMobile ? (
        <UrgentCreateMobile {...props} />
      ) : (
        <UrgentCreateDesktop {...props} />
      )}
    </>
  );
};

export default UrgentCreate;

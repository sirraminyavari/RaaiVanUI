/**
 * A component for viewing the subject's item.
 */
import React from 'react';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import SubjectItemDesktop from './SubjectItemDesktop';
import SubjectItemMobileView from './SubjectItemMobileView';

/**
 * According to screen dimension returns the suitable component.
 * @param {any} -  the all component props
 * @returns
 */
const SubjectItem = ({ ...props }) => {
  return (
    <>
      {/* If True, will render MobileView component */}
      {DimensionHelper().isTabletOrMobile ? (
        <SubjectItemMobileView {...props} />
      ) : (
        <SubjectItemDesktop {...props} />
      )}
    </>
  );
};

export default SubjectItem;

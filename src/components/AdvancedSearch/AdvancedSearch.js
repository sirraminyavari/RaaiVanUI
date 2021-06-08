/**
 * A component for viewing the subject's item.
 */
import React from 'react';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import AdvanceSearchDesktop from './AdvancedSearchDesktop';
import AdvanceSearchMobile from './AdvanceSearchMobile';

/**
 * According to screen dimension returns the suitable component.
 * @param {any} -  the all component props.
 */
const AdvanceSearch = ({ ...props }) => {
  return (
    <>
      {/* If True, will render MobileView component */}
      {DimensionHelper().isTabletOrMobile ? (
        <AdvanceSearchDesktop {...props} />
      ) : (
        <AdvanceSearchDesktop {...props} />
      )}
    </>
  );
};

export default AdvanceSearch;
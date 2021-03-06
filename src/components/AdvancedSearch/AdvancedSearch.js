/**
 * A component for viewing the subject's item.
 */
import React from 'react';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import AdvanceSearchDesktop from './AdvancedSearchDesktop';

/**
 * According to screen dimension returns the suitable component.
 * @param {any} -  the all component props.
 */
const AdvanceSearch = ({ ...props }) => {
  return (
    <div style={{ width: '100%' }}>
      {/* If True, will render MobileView component */}

      {DimensionHelper()?.isTabletOrMobile ? (
        <AdvanceSearchDesktop {...props} />
      ) : (
        <AdvanceSearchDesktop {...props} />
      )}
    </div>
  );
};

export default AdvanceSearch;

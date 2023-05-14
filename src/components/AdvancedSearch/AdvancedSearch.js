/**
 * A component for viewing the subject's item.
 */
import AdvanceSearchDesktop from './AdvancedSearchDesktop';

/**
 * According to screen dimension returns the suitable component.
 * @param {any} -  the all component props.
 */
const AdvanceSearch = ({ ...props }) => {
  return (
    <div style={{ width: '100%' }}>
      {/* If True, will render MobileView component */}

      <AdvanceSearchDesktop {...props} itemSelectionMode />
    </div>
  );
};

export default AdvanceSearch;

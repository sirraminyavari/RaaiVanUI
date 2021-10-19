import { AdvancedFilterContainer } from '../SearchStyle';
import { Transition } from 'react-transition-group';
import { useContext } from 'react';
import { SearchContext } from '../SearchProvider';

const AdvancedFilter = () => {
  const { advancedFilterOpen } = useContext(SearchContext);
  return (
    <Transition
      in={advancedFilterOpen}
      timeout={250}
      mountOnEnter
      unmountOnExit>
      {(state) => (
        <AdvancedFilterContainer state={state}>...</AdvancedFilterContainer>
      )}
    </Transition>
  );
};
export default AdvancedFilter;

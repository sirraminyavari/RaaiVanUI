/**
 *  A View Component to represent the search result
 */

import { SearchViewContainer } from './SearchStyle';
import DimensionHelper from '../../utils/DimensionHelper/DimensionHelper';
import SearchViewDesktop from './SearchViewDesktop';
import SearchViewMobile from './SearchViewMobile';
import SearchProvider from './SearchProvider';

/**
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Search = ({ ...props }) => {
  return (
    <SearchViewContainer>
      <SearchProvider>
        {
          /**
           * determine whether the view is mobile or not
           */
          DimensionHelper()?.isTabletOrMobile ? (
            <SearchViewMobile />
          ) : (
            <SearchViewDesktop />
          )
        }
      </SearchProvider>
    </SearchViewContainer>
  );
};
export default Search;

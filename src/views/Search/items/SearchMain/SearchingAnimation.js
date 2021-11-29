import LottieMaker from 'components/LottieMaker/LottieMaker';
import SearchSkeleton from 'assets/lotties/skeleton-loader-search-view.json';
import * as Styled from 'views/Search/SearchView.styles';

const SearchingAnimation = () => {
  return (
    <Styled.SearchAnimationContainer>
      {[...Array(5).keys()].map((index) => (
        <LottieMaker
          key={index}
          animationJSON={SearchSkeleton}
          height="3.8rem"
          width="100%"
          style={{ borderRadius: '0.3rem' }}
        />
      ))}
    </Styled.SearchAnimationContainer>
  );
};

export default SearchingAnimation;

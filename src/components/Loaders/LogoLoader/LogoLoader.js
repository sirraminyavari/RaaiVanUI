// import cliqmindLoader from 'assets/images/loading-new.gif';
import inprogressLoader from 'assets/images/loading_progress_bar.gif';
import * as Styled from './LogoLoader.styles';
import LogoLottieMaker from 'components/LottieMaker/LottieMaker';
import animationData from 'assets/lotties/loading.json';

const LogoLoader = ({ style, lottieWidth = '5rem' }) => {
  const isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;

  return (
    <Styled.LogoContainer style={style}>
      {isSaas ? (
        <LogoLottieMaker
          animationJSON={animationData}
          loop
          autoplay
          width={lottieWidth}
        />
      ) : (
        <Styled.Image src={inprogressLoader} alt="cliqmind-logo" />
      )}
    </Styled.LogoContainer>
  );
};

export default LogoLoader;

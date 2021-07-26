import cliqmindLoader from 'assets/images/loading-new.gif';
import inprogressLoader from 'assets/images/loading_progress_bar.gif';
import * as Styled from './LogoLoader.styles';

const LogoLoader = ({ style }) => {
  const isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;
  const loader = isSaas ? cliqmindLoader : inprogressLoader;

  return (
    <Styled.LogoContainer style={style}>
      <Styled.Image src={loader} alt="cliqmind-logo" />
    </Styled.LogoContainer>
  );
};

export default LogoLoader;

import cliqmindLoader from 'assets/images/cliqmind_mini.png';
import inprogressLoader from 'assets/images/loading_progress_bar.gif';
import * as Styled from './LogoLoader.styles';

const LogoLoader = ({ size }) => {
  const isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;
  const loader = isSaas ? cliqmindLoader : inprogressLoader;

  return (
    <Styled.LogoContainer>
      <Styled.Image src={loader} alt="raaivan-logo" size={size} />
    </Styled.LogoContainer>
  );
};

export default LogoLoader;

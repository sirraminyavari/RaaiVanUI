import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import PanelButton from 'components/Buttons/PanelButton';
import Button from 'components/Buttons/Button';

const OnboardingTemplateSelectionNode = ({ children }) => {
  const { RVDic } = useWindow();
  const history = useHistory();

  return (
    <>
      <Styles.OnboardingTemplateSelectionNodeContainer>
        {children}
      </Styles.OnboardingTemplateSelectionNodeContainer>
    </>
  );
};

OnboardingTemplateSelectionNode.displayName = 'OnboardingTemplateSelectionNode';

export default OnboardingTemplateSelectionNode;

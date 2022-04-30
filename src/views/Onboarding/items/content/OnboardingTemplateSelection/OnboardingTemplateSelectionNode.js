import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import PanelButton from 'components/Buttons/PanelButton';
import Button from 'components/Buttons/Button';

const OnboardingTemplateSelectionNode = ({ children }) => {
  return (
    <div>
      <Styles.OnboardingTemplateSelectionNodeContainer>
        {children}
      </Styles.OnboardingTemplateSelectionNodeContainer>
    </div>
  );
};

OnboardingTemplateSelectionNode.displayName = 'OnboardingTemplateSelectionNode';

export default OnboardingTemplateSelectionNode;

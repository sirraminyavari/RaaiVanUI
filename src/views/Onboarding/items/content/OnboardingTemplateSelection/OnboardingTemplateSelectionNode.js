import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import PanelButton from 'components/Buttons/PanelButton';
import Button from 'components/Buttons/Button';

const OnboardingTemplateSelectionNode = () => {
  const { RVDic } = useWindow();
  const history = useHistory();

  return (
    <>
      <div
        style={{
          width: '100%',
          border: '1px solid gray',
          height: '100%',
          alignSelf: 'stretch',
        }}
      ></div>
    </>
  );
};

OnboardingTemplateSelectionNode.displayName = 'OnboardingTemplateSelectionNode';

export default OnboardingTemplateSelectionNode;

import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import Button from 'components/Buttons/Button';
import { decodeBase64 } from 'helpers/helpers';
import {
  useOnboardingTeamContent,
  OnboardingTeamStepContextActions,
} from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTemplateSelectionCurrentTemplate = ({ activeTemplate }) => {
  const { RVDic } = useWindow();
  const { dispatch, selectedTemplates } = useOnboardingTeamContent();

  const selectTemplateHandler = (template) => {
    dispatch({
      type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_SET_TEMPLATE,
      stateKey: template.NodeTypeID,
      stateValue: template,
    });
  };

  const deselectTemplateHandler = (template) => {
    dispatch({
      type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_REMOVE_TEMPLATE,
      stateKey: template.NodeTypeID,
    });
  };

  const isTemplateSelected = (selectedTemplates, activeTemplate) => {
    const nodeID = activeTemplate?.NodeTypeID || 'null';
    if (
      nodeID !== 'null' &&
      Object.keys(selectedTemplates).length &&
      Object.keys(selectedTemplates).includes(nodeID)
    )
      return true;
    else return false;
  };

  //! RVDic i18n localization
  const RVDicOnboardingSelectTemplate = RVDic.SelectN.replace(
    '[n]',
    RVDic.Template
  );
  const RVDicOnboardingDeselectTemplate = RVDic.Unselect;

  return (
    <>
      <Styles.OnboardingTemplateSelectionCurrentTemplateContainer>
        {activeTemplate && (
          <>
            <Styles.OnboardingTemplateSelectionImage
              src={activeTemplate?.IconURL}
            />
            <Styles.OnboardingTemplateSelectionCurrentTemplateTitle>
              {decodeBase64(activeTemplate?.TypeName)}
            </Styles.OnboardingTemplateSelectionCurrentTemplateTitle>
            <Styles.OnboardingTemplateSelectionCurrentTemplateParagraph>
              {decodeBase64(activeTemplate?.Description)}
            </Styles.OnboardingTemplateSelectionCurrentTemplateParagraph>
            <Styles.OnboardingTemplateSelectionButtonWrapper
              style={{ marginBlockStart: '4rem' }}
            >
              {!isTemplateSelected(selectedTemplates, activeTemplate) ? (
                <Button
                  style={{
                    paddingInline: '3rem',
                    height: '3rem',
                    fontSize: '1rem',
                  }}
                  type="primary-o"
                  onClick={() => selectTemplateHandler(activeTemplate)}
                >
                  {RVDicOnboardingSelectTemplate}
                </Button>
              ) : (
                <Button
                  style={{
                    paddingInline: '3rem',
                    height: '3rem',
                    fontSize: '1rem',
                  }}
                  type="negative-o"
                  onClick={() => deselectTemplateHandler(activeTemplate)}
                >
                  {RVDicOnboardingDeselectTemplate}
                </Button>
              )}
            </Styles.OnboardingTemplateSelectionButtonWrapper>
          </>
        )}
      </Styles.OnboardingTemplateSelectionCurrentTemplateContainer>
    </>
  );
};

OnboardingTemplateSelectionCurrentTemplate.displayName =
  'OnboardingTemplateSelectionCurrentTemplate';

export default OnboardingTemplateSelectionCurrentTemplate;

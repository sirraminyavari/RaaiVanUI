import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import Button from 'components/Buttons/Button';
import { decodeBase64 } from 'helpers/helpers';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import { useDispatch, useSelector } from 'react-redux';
import { selectOnboarding } from 'store/slice/onboarding/selectors';
import { useOnboardingSlice } from 'store/slice/onboarding';

const OnboardingTemplateSelectionCurrentTemplate = ({ activeTemplate }) => {
  const { RVDic } = useWindow();
  const { isTabletOrMobile } = DimensionHelper();

  const dispatch = useDispatch();

  const { selectedTemplates } = useSelector(selectOnboarding);
  const { actions: onboardingActions } = useOnboardingSlice();

  const selectTemplateHandler = (template) => {
    dispatch(
      onboardingActions.setTeamTemplate({
        id: template.NodeTypeID,
        value: template,
      })
    );
  };

  const deselectTemplateHandler = (template) => {
    dispatch(onboardingActions.teamRemoveTemplate({ id: template.NodeTypeID }));
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
      <Styles.OnboardingTemplateSelectionCurrentTemplateContainer
        mobile={isTabletOrMobile}
      >
        {activeTemplate && (
          <>
            <Styles.OnboardingTemplateSelectionImage
              src={activeTemplate?.IconURL}
            />
            <Styles.OnboardingTemplateSelectionCurrentTemplateTitle>
              {decodeBase64(activeTemplate?.TypeName)}
            </Styles.OnboardingTemplateSelectionCurrentTemplateTitle>
            <Styles.OnboardingTemplateSelectionCurrentTemplateParagraph
              mobile={isTabletOrMobile}
            >
              {decodeBase64(activeTemplate?.Description)}
            </Styles.OnboardingTemplateSelectionCurrentTemplateParagraph>
            <Styles.OnboardingTemplateSelectionButtonWrapper
              style={{ marginBlockStart: '0rem' }}
            >
              {!isTemplateSelected(selectedTemplates, activeTemplate) ? (
                <Button
                  style={{
                    paddingInline: '3rem',
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

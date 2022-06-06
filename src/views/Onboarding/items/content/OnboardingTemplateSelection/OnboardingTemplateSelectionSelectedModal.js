import Modal from 'components/Modal/Modal';
import useWindow from 'hooks/useWindowContext';
import * as Styled from './OnboardingTemplateSelection.styles';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import { useDispatch, useSelector } from 'react-redux';
import { selectOnboarding } from 'store/slice/onboarding/selectors';
import { useOnboardingSlice } from 'store/slice/onboarding';

const OnboardingTemplateSelectionSelectedModal = ({
  appTitle,
  isModalShown,
  setIsModalShown,
  templates,
}) => {
  const { RVDic } = useWindow();

  const dispatch = useDispatch();

  const { selectedTemplates } = useSelector(selectOnboarding);
  const { actions: onboardingActions } = useOnboardingSlice();

  //! RVDic i18n localization
  const RVDicOnboardingDeselectTemplate = RVDic.Unselect;

  const deselectTemplateHandler = (template) => {
    dispatch(onboardingActions.teamRemoveTemplate({ id: template.NodeTypeID }));

    if (Object.keys(selectedTemplates).length === 1) setIsModalShown(false);
  };

  return (
    <Modal
      show={isModalShown}
      onClose={() => setIsModalShown(false)}
      contentWidth="clamp(300px,90%,30rem)"
      title={appTitle}
    >
      <Styled.OnboardingTemplateSelectionSelectedModalContainer>
        {(templates || []).map((template, idx) => {
          const { IconURL, TypeName, NodeTypeID } = template;
          if (Object.keys(selectedTemplates).includes(NodeTypeID))
            return (
              <Styled.OnboardingTemplateSelectionSelectedModalTemplateWrapper>
                <Styled.OnboardingTemplateSelectionSelectedModalTemplateTitleWrapper>
                  <img src={IconURL} alt="" />
                  {decodeBase64(TypeName)}
                </Styled.OnboardingTemplateSelectionSelectedModalTemplateTitleWrapper>
                <Styled.OnboardingTemplateSelectionSelectedModalTemplateTitleWrapper>
                  <Button
                    style={{}}
                    type="negative-o"
                    onClick={() => deselectTemplateHandler(template)}
                  >
                    {RVDicOnboardingDeselectTemplate}
                  </Button>
                </Styled.OnboardingTemplateSelectionSelectedModalTemplateTitleWrapper>
              </Styled.OnboardingTemplateSelectionSelectedModalTemplateWrapper>
            );
          return undefined;
        })}
      </Styled.OnboardingTemplateSelectionSelectedModalContainer>
    </Modal>
  );
};

OnboardingTemplateSelectionSelectedModal.displayName =
  'OnboardingTemplateSelectionSelectedModal';

export default OnboardingTemplateSelectionSelectedModal;

import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import OnboardingTemplateSelectionGallery from './OnboardingTemplateSelectionGallery';
import OnboardingTemplateSelectionCurrentTemplate from './OnboardingTemplateSelectionCurrentTemplate';
import OnboardingTemplateSelectionNode from './OnboardingTemplateSelectionNode';
import OnboardingTemplateSelectionCarousel from './OnboardingTemplateSelectionCarousel';
import OnboardingTemplateSelectionSelectedModal from './OnboardingTemplateSelectionSelectedModal';
import Button from 'components/Buttons/Button';
import API from 'apiHelper';
import { parseTemplates } from 'components/TemplatesGallery/templateUtils.js';
import { useEffect, useMemo, useState } from 'react';
import { ONBOARDING_TEMPLATE_SETUP_PATH } from 'views/Onboarding/items/others/constants';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import { useDispatch, useSelector } from 'react-redux';
import { useOnboardingSlice } from 'store/slice/onboarding';
import { useThemeSlice } from 'store/slice/theme';
import { selectOnboarding } from 'store/slice/onboarding/selectors';

const OnboardingTemplateSelectionContent = () => {
  const [templates, setTemplates] = useState([]);
  const [activateTemplate, setActivateTemplate] = useState();
  const [activeTag, setActiveTag] = useState();
  const [isSelectedModalShown, setIsSelectedModalShown] = useState(false);
  const { RVDic } = useWindow();
  const history = useHistory();
  const { isTabletOrMobile } = DimensionHelper();

  const dispatch = useDispatch();

  const {
    disableContinue,
    selectedTemplates,
    teamState: { workField },
  } = useSelector(selectOnboarding);

  const { actions: onboardingActions } = useOnboardingSlice();
  const { actions: themeActions } = useThemeSlice();

  useEffect(() => {
    dispatch(themeActions.toggleSidebar(false));
    const templateTagID =
      workField.fieldID !== 'OTHERS' ? workField?.fieldID : undefined;
    (async () => {
      await API.CN.getTemplates({ TagID: undefined }).then((res) => {
        const parsedTemplates = parseTemplates(res);
        setTemplates(parsedTemplates);
        if (parsedTemplates?.AllTemplates.length) {
          setActivateTemplate(parsedTemplates.AllTemplates[0]);
        }
      });

      if (templateTagID)
        API.CN.getTemplates({ TagID: templateTagID }).then((res) => {
          const parsedSuggestionTemplates = parseTemplates(res);
          setTemplates((templates) => ({
            ...templates,
            suggestions: parsedSuggestionTemplates,
          }));
        });
      else
        setTemplates((templates) => ({
          ...templates,
          suggestions: templates,
        }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gotoTemplateSetup = () => {
    dispatch(onboardingActions.setOnboardingTemplates(selectedTemplateArray));
    history.push(ONBOARDING_TEMPLATE_SETUP_PATH);
  };

  const setDefaultTemplates = async () => {
    const defaultTemplates = templates.AllTemplates.filter(
      (template) => template.IsDefaultTemplate
    );
    let defaultTemplatesObject = {};

    defaultTemplates.forEach(({ NodeTypeID, ...restTemplateProps }) => {
      defaultTemplatesObject[NodeTypeID] = {
        NodeTypeID,
        ...restTemplateProps,
      };
    });

    dispatch(onboardingActions.setTeamDefaultTemplate(defaultTemplatesObject));

    const defaultSelectedTemplateArray = Object.values(
      defaultTemplatesObject
    ).map(({ NodeTypeID, IconURL, TypeName }) => ({
      NodeTypeID,
      IconURL,
      TypeName,
    }));

    dispatch(
      onboardingActions.setOnboardingTemplates(defaultSelectedTemplateArray)
    );

    history.push(ONBOARDING_TEMPLATE_SETUP_PATH);
  };

  const selectedTemplateCount = useMemo(() => {
    const selectedTemplateKeys = Object.keys(selectedTemplates);
    return selectedTemplateKeys.length;
  }, [selectedTemplates]);

  const selectedTemplateArray = useMemo(() => {
    const selectedTemplateValues = Object.values(selectedTemplates).map(
      ({ NodeTypeID, IconURL, TypeName }) => ({
        NodeTypeID,
        IconURL,
        TypeName,
      })
    );
    return selectedTemplateValues;
  }, [selectedTemplates]);

  //! RVDic i18n localization
  const RVDicSaveAndNext = RVDic.SaveAndNext;
  const RVDicSelectedTemplates = RVDic.SelectedN.replace('[n]', RVDic.Template);
  const RVDicUseDefaultTemplates = RVDic.UseDefaultTemplates;
  return (
    <Styles.OnboardingTemplateSelectionWrapper mobile={isTabletOrMobile}>
      <OnboardingTemplateSelectionGallery
        templates={templates}
        setActiveTag={setActiveTag}
        activateTemplate={setActivateTemplate}
        mobile={isTabletOrMobile}
      />
      <div>
        <Styles.OnboardingTemplateSelectionTemplatePanel
          mobile={isTabletOrMobile}
        >
          <OnboardingTemplateSelectionCurrentTemplate
            activeTemplate={activateTemplate}
          />
          <OnboardingTemplateSelectionNode activeTemplate={activateTemplate} />
        </Styles.OnboardingTemplateSelectionTemplatePanel>
        <OnboardingTemplateSelectionCarousel
          templates={
            activeTag
              ? activeTag.Templates
              : templates?.suggestions?.AllTemplates
          }
          activateTemplate={setActivateTemplate}
          activeTemplate={activateTemplate}
        />
        <Styles.OnboardingTemplateSelectionButtonWrapper>
          <Button
            style={{ paddingInline: '3rem' }}
            disable={disableContinue}
            onClick={gotoTemplateSetup}
          >
            {RVDicSaveAndNext}
          </Button>
          {selectedTemplateCount ? (
            <>
              <Styles.OnboardingTemplateSelectionTemplateCount
                onClick={() => setIsSelectedModalShown(true)}
              >
                {selectedTemplateCount} {RVDicSelectedTemplates}
              </Styles.OnboardingTemplateSelectionTemplateCount>
            </>
          ) : (
            <Button
              style={{ paddingInline: '1rem' }}
              type="primary-o"
              onClick={setDefaultTemplates}
            >
              {RVDicUseDefaultTemplates}
            </Button>
          )}
          <OnboardingTemplateSelectionSelectedModal
            appTitle={`${selectedTemplateCount} ${RVDicSelectedTemplates}`}
            isModalShown={isSelectedModalShown}
            setIsModalShown={setIsSelectedModalShown}
            templates={templates?.AllTemplates}
          />
        </Styles.OnboardingTemplateSelectionButtonWrapper>
      </div>
    </Styles.OnboardingTemplateSelectionWrapper>
  );
};

OnboardingTemplateSelectionContent.displayName =
  'OnboardingTemplateSelectionContent';

export default OnboardingTemplateSelectionContent;

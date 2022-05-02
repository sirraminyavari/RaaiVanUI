import { useEffect, useState } from 'react';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import workFieldAssets from 'assets/images/onboarding/workFieldAssets/workFieldAssets';
import PanelButton from 'components/Buttons/PanelButton';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import {
  useOnboardingTeamContent,
  OnboardingTeamStepContextActions,
} from 'views/Onboarding/items/others/OnboardingTeam.context';
import { getAllFieldsOfActivity } from 'apiHelper/ApiHandlers/CNApi';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';

const OnboardingTeamCreationSetWorkFieldContent = () => {
  const [workFields, setWorkFields] = useState([]);

  const { RVDic } = useWindow();
  const {
    dispatch: dispatchTeamPage,
    teamState: { workField },
  } = useOnboardingTeamContent();

  //! RVDic i18n localization
  const RVDicِTeamWorkFieldHeadCount = RVDic.FieldOfActivity;
  const RVDicOthersField = RVDic.Other;
  const RVDicOthersInputField = RVDic.Checks.EnterYourFieldOfActivity;

  const setOnboardingTeamWorkField = (workField) => () => {
    dispatchTeamPage({
      type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_SET_STATE,
      stateKey: 'workField',
      stateValue: workField,
    });
  };

  useEffect(() => {
    async function fetchAllFieldsOfActivity() {
      const { Items } = await getAllFieldsOfActivity();
      setWorkFields(Items);
    }
    fetchAllFieldsOfActivity();
  }, []);

  return (
    <>
      <Styles.OnboardingTeamTitleWrapper>
        {RVDicِTeamWorkFieldHeadCount}
      </Styles.OnboardingTeamTitleWrapper>
      <Styles.OnboardingTeamButtonInputWrapper wrap>
        {workFields.map(({ NodeID, Name, AvatarName }) => (
          <>
            <PanelButton
              secondary
              active={workField.fieldID === NodeID}
              onClick={setOnboardingTeamWorkField({
                fieldID: NodeID,
                fieldName: decodeBase64(AvatarName),
              })}
            >
              <img
                src={workFieldAssets[decodeBase64(AvatarName)]}
                size={'1em'}
                alt=""
              />
              {decodeBase64(Name)}
            </PanelButton>
          </>
        ))}

        <PanelButton
          secondary
          active={workField.fieldID === 'OTHERS'}
          onClick={setOnboardingTeamWorkField({
            fieldID: 'OTHERS',
            fieldName: '',
          })}
        >
          <img src={workFieldAssets.cardbox} size={'1em'} alt="" />
          {RVDicOthersField}
        </PanelButton>
        {workField.fieldID === 'OTHERS' && (
          <Styles.OnboardingTeamSetWorkFieldInputWrapper>
            <AnimatedInput
              placeholder={RVDicOthersInputField}
              value={decodeBase64(workField.fieldName)}
              onChange={(input) =>
                setOnboardingTeamWorkField({
                  fieldID: 'OTHERS',
                  fieldName: encodeBase64(input),
                })()
              }
            />
          </Styles.OnboardingTeamSetWorkFieldInputWrapper>
        )}
      </Styles.OnboardingTeamButtonInputWrapper>
    </>
  );
};

OnboardingTeamCreationSetWorkFieldContent.displayName =
  'OnboardingTeamCreationSetWorkFieldContent';

export default OnboardingTeamCreationSetWorkFieldContent;

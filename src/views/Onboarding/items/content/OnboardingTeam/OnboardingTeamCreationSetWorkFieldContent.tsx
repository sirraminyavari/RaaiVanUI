import { useEffect, useRef, useState } from 'react';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import workFieldAssets from 'assets/images/onboarding/workFieldAssets/workFieldAssets';
import PanelButton from 'components/Buttons/PanelButton';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import {
  getAllFieldsOfActivity,
  IGetAllFieldsOfActivity,
} from 'apiHelper/ApiHandlers/CNAPI';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { selectOnboarding } from 'store/slice/onboarding/selectors';
import { useOnboardingSlice } from 'store/slice/onboarding';

const OnboardingTeamCreationSetWorkFieldContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [workFields, setWorkFields] = useState<
    IGetAllFieldsOfActivity['Items']
  >([]);
  const workFieldInputRef = useRef<HTMLInputElement>();

  const { RVDic } = useWindow();

  const dispatch = useDispatch();

  const {
    teamState: { teamName, workField },
  } = useSelector(selectOnboarding);

  const { actions: onboardingActions } = useOnboardingSlice();

  //! RVDic i18n localization
  const RVDicِTeamWorkFieldHeadCount = RVDic.FieldOfActivity;
  const RVDicِTeamWorkFieldHeadCountDescription =
    RVDic.WhatIsTheFieldOfActivityOfTeamNInYourOrganization.replace(
      '[n]',
      teamName
    );
  const RVDicOthersField = RVDic.Other;
  const RVDicOthersInputField = RVDic.Checks.EnterYourFieldOfActivity;

  const setOnboardingTeamWorkField =
    (workField: { fieldID: string; fieldName: string }) => () => {
      dispatch(
        onboardingActions.teamSetState({ key: 'workField', value: workField })
      );
    };

  useEffect(() => {
    async function fetchAllFieldsOfActivity() {
      const { Items } = await getAllFieldsOfActivity();
      setWorkFields(Items);
      setIsLoading(false);
    }
    fetchAllFieldsOfActivity();
  }, []);

  useEffect(() => {
    if (workField.fieldID === 'OTHERS' && workFieldInputRef.current)
      workFieldInputRef.current.scrollIntoView({
        behavior: 'smooth',
      });
  }, [workField.fieldID]);

  return (
    <>
      <Styles.OnboardingTeamTitleWrapper>
        {RVDicِTeamWorkFieldHeadCount}
      </Styles.OnboardingTeamTitleWrapper>
      <Styles.OnboardingTeamTitleDescription>
        {RVDicِTeamWorkFieldHeadCountDescription}
      </Styles.OnboardingTeamTitleDescription>
      {isLoading ? (
        ''
      ) : (
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
                <img src={workFieldAssets[decodeBase64(AvatarName)]} alt="" />
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
            <img src={workFieldAssets.cardbox} alt="" />
            {RVDicOthersField}
          </PanelButton>
          {workField.fieldID === 'OTHERS' && (
            <Styles.OnboardingTeamSetWorkFieldInputWrapper
              hide={workField.fieldID !== 'OTHERS'}
            >
              <AnimatedInput
                ref={workFieldInputRef}
                //@ts-ignore
                id="workFieldInput"
                disabled={workField.fieldID !== 'OTHERS'}
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
      )}
    </>
  );
};

OnboardingTeamCreationSetWorkFieldContent.displayName =
  'OnboardingTeamCreationSetWorkFieldContent';

export default OnboardingTeamCreationSetWorkFieldContent;

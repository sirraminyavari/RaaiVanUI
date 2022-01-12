import APIHandler from 'apiHelper/APIHandler';
import Button from 'components/Buttons/Button';
import AlertIcon from 'components/Icons/AlertIcon/AlertIcon';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import OTPCountDownTimer from 'components/OTP/CountDownTimer';
import OTPVerificationInput from 'components/OTP/VerificationInput';
import {
  decodeBase64,
  destroyCaptchaToken,
  getCaptchaToken,
  initializeCaptchaToken,
} from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import setCaptchaTokenAction from 'store/actions/auth/setCaptchaToken';
import * as Styled from 'views/Teams/Teams.styles';

const RemoveWorkspaceTicketAPI = new APIHandler(
  'RVAPI',
  'RemoveWorkspaceTicket'
);
const RemoveWorkspaceAPI = new APIHandler('RVAPI', 'RemoveWorkspace');
const WorkspaceDeleteContent = () => {
  const [OTPInput, setOTPInput] = useState([]);
  const dispatch = useDispatch();
  const [timerFinished, setTimerFinished] = useState(false);
  const [OTPProperties, setOTPProperties] = useState(undefined);
  const { RVDic, RVGlobal } = useWindow();
  const history = useHistory();
  let { id: WorkspaceID } = useParams();

  const RVDicRemoveWorkspacePermanently = RVDic.RemoveNPermanently.replace(
    '[n]',
    RVDic.Workspace
  );
  const RVDicRemoveWorkspaceDescription = RVDic._HelpRemoveWorkspace;
  const RVDicRemoveWorkspaceDescriptionInThisCase = RVDic.InThisCase;
  const RVDicRemoveWorkspaceConsequence1 = RVDic.FilesWillBeDeletedForever;
  const RVDicRemoveWorkspaceConsequence2 = RVDic.WorkspaceCreditIsNonRefundable;
  const RVDicRemoveWorkspaceConsequence3 =
    RVDic.MSG.ItIsNotPossibleToRetrieveInformationAndDocuments;
  const RVDicRemoveWorkspaceOTPVerification =
    RVDic.MSG.DeleteWorkspaceVerficiationCode;
  const RVDicReturn = RVDic.Return;
  const RVDicResend = RVDic.Resend;
  const RVDicConfirmDelete = 'تایید و حذف';

  const handleLoaded = async () => {
    const recaptcha = await getCaptchaToken();

    RemoveWorkspaceTicketAPI.fetch(
      {
        WorkspaceID: WorkspaceID,
        Captcha: recaptcha,
      },
      ({ VerificationCode }) => {
        setOTPProperties({
          Length: VerificationCode.Length,
          Timeout: VerificationCode.Timeout,
          EmailAddress: decodeBase64(VerificationCode.EmailAddress),
          Token: VerificationCode.Token,
        });

        setTimerFinished(false);
      }
    );
  };

  const handleReturnButton = () => history.push('/teams');
  const handleRemoveWorkspaceButton = () => {
    RemoveWorkspaceAPI.fetch(
      {
        VerificationToken: OTPProperties.Token, //got from RVAPI.RemoveWorkspaceTicket previously
        Code: OTPInput.join(''), //a 5-digit number
      },
      (response) => {
        console.log(`success:`, { response });
        history.push('/teams');
      }
    );
  };
  useEffect(() => {
    (async () => {
      await initializeCaptchaToken();
      setTimerFinished(false);
      await handleLoaded();
    })();

    // removes reCapctha when component willunmount
    return () => destroyCaptchaToken();
  }, []);

  return (
    <Styled.WorkspaceDeleteContainer>
      <Styled.WorkspaceDeleteString type="alert">
        <AlertIcon size={'2.4rem'} />
      </Styled.WorkspaceDeleteString>
      <Styled.WorkspaceDeleteString
        type="alert"
        fontWeight="bold"
        size={'1.5rem'}>
        {RVDicRemoveWorkspacePermanently}!
      </Styled.WorkspaceDeleteString>
      <Styled.WorkspaceDeleteString>
        {RVDicRemoveWorkspaceDescription}
      </Styled.WorkspaceDeleteString>
      <Styled.WorkspaceDeleteString>
        {RVDicRemoveWorkspaceDescriptionInThisCase}:
      </Styled.WorkspaceDeleteString>
      <Styled.WorkspaceDeleteConsequencesList>
        <Styled.WorkspaceDeleteConsequencesListItem>
          {RVDicRemoveWorkspaceConsequence1}.
        </Styled.WorkspaceDeleteConsequencesListItem>
        <Styled.WorkspaceDeleteConsequencesListItem>
          {RVDicRemoveWorkspaceConsequence2}.
        </Styled.WorkspaceDeleteConsequencesListItem>
        <Styled.WorkspaceDeleteConsequencesListItem>
          {RVDicRemoveWorkspaceConsequence3}.
        </Styled.WorkspaceDeleteConsequencesListItem>
      </Styled.WorkspaceDeleteConsequencesList>
      {OTPProperties?.Timeout && (
        <>
          <Styled.WorkspaceDeleteString marginTop="2rem">
            {RVDicRemoveWorkspaceOTPVerification}:
          </Styled.WorkspaceDeleteString>
          <Styled.WorkspaceDeleteString type="email" fontWeight="bold">
            {OTPProperties?.EmailAddress}
          </Styled.WorkspaceDeleteString>
          <Styled.WorkspaceDeleteActionsContainer>
            <OTPVerificationInput
              onValueChange={setOTPInput}
              length={OTPProperties?.Length}
            />
            {!timerFinished ? (
              <OTPCountDownTimer
                onFinished={() => setTimerFinished(true)}
                NoCircularProgress
                resendCodeTimeout={OTPProperties?.Timeout}
              />
            ) : (
              <div>
                <Button
                  onClick={handleLoaded}
                  type="primary-o"
                  style={{ marginInline: '0.5rem' }}>
                  {RVDicResend}
                </Button>
              </div>
            )}
          </Styled.WorkspaceDeleteActionsContainer>
        </>
      )}
      <Styled.WorkspaceDeleteActionsContainer>
        <Button
          loading={!OTPProperties}
          onClick={handleRemoveWorkspaceButton}
          type="negative-o"
          style={{ marginInline: '0.5rem' }}>
          {RVDicConfirmDelete}
        </Button>
        <Button
          onClick={handleReturnButton}
          type="primary-o"
          style={{ marginInline: '0.5rem' }}>
          {RVDicReturn}
        </Button>
      </Styled.WorkspaceDeleteActionsContainer>
    </Styled.WorkspaceDeleteContainer>
  );
};

export default WorkspaceDeleteContent;

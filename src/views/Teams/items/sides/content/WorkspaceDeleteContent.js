import APIHandler from 'apiHelper/APIHandler';
import Button from 'components/Buttons/Button';
import AlertIcon from 'components/Icons/AlertIcon/AlertIcon';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import OTPCountDownTimer from 'components/OTP/CountDownTimer';
import OTPVerificationInput from 'components/OTP/VerificationInput';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import {
  decodeBase64,
  hideCaptchaToken,
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
  const [pendingPromise, setPendingPromise] = useState(false);
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
  const RVDicConfirmDelete = `${RVDic.Confirm} ${RVDic.And} ${RVDic.Remove}`;

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

  const ReturnToWorkspaces = () => history.push('/teams');
  const handleRemoveWorkspaceButton = () => {
    setPendingPromise(true);
    RemoveWorkspaceAPI.fetch(
      {
        VerificationToken: OTPProperties.Token, //got from RVAPI.RemoveWorkspaceTicket previously
        Code: OTPInput.join(''), //a 5-digit number
      },
      ({ ErrorText, Succeed }) => {
        if (!ErrorText) {
          InfoToast({
            type: 'success',
            message: RVDic.MSG[Succeed] || Succeed,
          });
          ReturnToWorkspaces();
        } else
          InfoToast({
            type: 'error',
            message: RVDic.MSG[ErrorText] || ErrorText,
          });
        setPendingPromise(false);
      }
    );
  };
  useEffect(() => {
    (async () => {
      await initializeCaptchaToken();
      setTimerFinished(false);
      await handleLoaded();
    })();

    // hides reCapctha when component willunmount
    return () => hideCaptchaToken();
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
      {OTPProperties?.Timeout ? (
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
      ) : (
        <LogoLoader />
      )}
      <Styled.WorkspaceDeleteActionsContainer>
        <Button
          loading={pendingPromise}
          disable={!OTPProperties?.Timeout}
          onClick={handleRemoveWorkspaceButton}
          type="negative-o"
          style={{ marginInline: '0.5rem' }}>
          {RVDicConfirmDelete}
        </Button>
        <Button
          onClick={ReturnToWorkspaces}
          type="primary-o"
          style={{ marginInline: '0.5rem' }}>
          {RVDicReturn}
        </Button>
      </Styled.WorkspaceDeleteActionsContainer>
    </Styled.WorkspaceDeleteContainer>
  );
};

export default WorkspaceDeleteContent;

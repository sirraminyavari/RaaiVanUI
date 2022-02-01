import APIHandler from 'apiHelper/APIHandler';
import Button from 'components/Buttons/Button';
import AlertIcon from 'components/Icons/AlertIcon/AlertIcon';
import { randomNumber } from 'helpers/helpers';
import VerificationInputWithTimer from 'components/OTP/VerificationInputWithTimer';
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
import * as Styled from 'views/Teams/Teams.styles';
import { WORKSPACES_PATH } from '../../others/constants';

const RemoveWorkspaceTicketAPI = new APIHandler(
  'RVAPI',
  'RemoveWorkspaceTicket'
);
const RemoveWorkspaceAPI = new APIHandler('RVAPI', 'RemoveWorkspace');
const WorkspaceDeleteContent = () => {
  const [pendingPromise, setPendingPromise] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(0);
  const [OTPProperties, setOTPProperties] = useState(undefined);
  const { RVDic } = useWindow();
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
        setResetCountdown(randomNumber(1));
      }
    );
  };

  const ReturnToWorkspaces = () => history.push(WORKSPACES_PATH);
  const handleRemoveWorkspaceButton = (otp, error) => {
    setPendingPromise(true);
    RemoveWorkspaceAPI.fetch(
      {
        VerificationToken: OTPProperties.Token, //got from RVAPI.RemoveWorkspaceTicket previously
        Code: otp, //a 5-digit number
      },
      ({ ErrorText, Succeed }) => {
        if (!ErrorText) {
          InfoToast({
            type: 'success',
            message: RVDic.MSG[Succeed] || Succeed,
          });
          ReturnToWorkspaces();
        } else error(RVDic.MSG[ErrorText] || ErrorText);
        setPendingPromise(false);
      }
    );
  };
  useEffect(() => {
    (async () => {
      await initializeCaptchaToken();
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
      <Styled.WorkspaceDeleteString marginTop="2rem">
        {RVDicRemoveWorkspaceOTPVerification}:
      </Styled.WorkspaceDeleteString>
      <Styled.WorkspaceDeleteActionsContainer>
        <VerificationInputWithTimer
          noIcon
          email={OTPProperties?.EmailAddress}
          length={OTPProperties?.Length}
          timeout={OTPProperties?.Timeout}
          onConfirm={handleRemoveWorkspaceButton}
          resendCodeRequest={handleLoaded}
          reset={resetCountdown}
        />
      </Styled.WorkspaceDeleteActionsContainer>
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

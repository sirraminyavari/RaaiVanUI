import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
import * as Styled from 'views/Teams/Teams.styles';
import { WORKSPACES_PATH } from '../../others/constants';
import {
  removeWorkspaceTicket,
  removeWorkspace,
} from 'apiHelper/ApiHandlers/RVApi';
const WorkspaceDeleteContent = () => {
  const [pendingPromise, setPendingPromise] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(0);
  const [OTPProperties, setOTPProperties] = useState(undefined);
  const [OTPInput, setOTPInput] = useState([]);
  const [OTPError, setOTPError] = useState('');
  const [OTPShake, setOTPShake] = useState(0);
  const [OTPLoading, setOTPLoading] = useState(false);

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
    setOTPLoading(true);
    const recaptcha = await getCaptchaToken();
    const { VerificationCode } = await removeWorkspaceTicket({
      WorkspaceID,
      Captcha: recaptcha,
    });

    setOTPProperties({
      Length: VerificationCode.Length,
      Timeout: VerificationCode.Timeout,
      EmailAddress: decodeBase64(VerificationCode.EmailAddress),
      Token: VerificationCode.Token,
    });
    setOTPError('');
    setOTPLoading(false);
    setResetCountdown(randomNumber(1));
  };

  const ReturnToWorkspaces = () => history.push(WORKSPACES_PATH);
  const handleRemoveWorkspaceButton = async () => {
    setPendingPromise(true);
    const { ErrorText, Succeed } = await removeWorkspace({
      VerificationToken: OTPProperties.Token, //got from RVAPI.RemoveWorkspaceTicket previously
      Code: OTPInput.join(''), //a 5-digit number
    });

    if (!ErrorText) {
      InfoToast({
        type: 'success',
        message: RVDic.MSG[Succeed] || Succeed,
      });
      ReturnToWorkspaces();
    } else {
      setOTPError(RVDic.MSG[ErrorText] || ErrorText);

      setOTPShake(randomNumber(1, 50));
    }
    setPendingPromise(false);
  };
  useEffect(() => {
    (async () => {
      await initializeCaptchaToken();
      await handleLoaded();
    })();

    // hides reCapctha when component willunmount
    return () => hideCaptchaToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.WorkspaceDeleteContainer>
      <Styled.WorkspaceDeleteString type="alert">
        <AlertIcon size={'2.4rem'} />
      </Styled.WorkspaceDeleteString>
      <Styled.WorkspaceDeleteString
        type="alert"
        fontWeight="bold"
        size={'1.5rem'}
      >
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
          error={OTPError}
          shake={OTPShake}
          loading={OTPLoading}
          email={OTPProperties?.EmailAddress}
          length={OTPProperties?.Length}
          timeout={OTPProperties?.Timeout}
          onValueChange={(val) => {
            setOTPInput(val);
            setOTPError('');
          }}
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
          style={{ marginInline: '0.5rem' }}
        >
          {RVDicConfirmDelete}
        </Button>
        <Button
          onClick={ReturnToWorkspaces}
          type="primary-o"
          style={{ marginInline: '0.5rem' }}
        >
          {RVDicReturn}
        </Button>
      </Styled.WorkspaceDeleteActionsContainer>
    </Styled.WorkspaceDeleteContainer>
  );
};

export default WorkspaceDeleteContent;

import * as Styled from './InvitaionStyle';
import InfoCircleIcon from 'components/Icons/InfoCircleIcon/InfoIcon';
import UserInvitationForm from './UserInvitationForm';
import styled from 'styled-components';
import Button from 'components/Buttons/Button';
import { useEffect, useMemo, useState } from 'react';
import produce from 'immer';
import { decodeBase64 } from 'helpers/helpers';
import { inviteUsersBatch } from 'apiHelper/ApiHandlers/usersApi';
import InfoToast from 'components/toasts/info-toast/InfoToast';

const SendInvitation = ({ ApplicationID }) => {
  const { RVDic, RVGlobal, RV_RTL } = window;
  const [formIsValid, setFormIsValid] = useState(false);
  const [form, setForm] = useState([
    {
      id: 1,
      valid: false,
      data: null,
    },
    {
      id: 2,
      valid: false,
      data: null,
    },
    {
      id: 3,
      valid: false,
      data: null,
    },
  ]);

  const updateForm = (data, id) => {
    setForm(
      produce((_form) => {
        const _item = _form.find((x) => x.id === id);
        if (_item !== null) {
          // update data
          _item.data = data;

          // check if the block is valid
          _item.valid = _item?.data?.email !== '' && _item?.data?.name !== '';
        }
      })
    );
  };

  useEffect(() => {
    // check if at least one block is valid which it means we need to enable the send button
    const oneBlockIsValid = form.some((x) => x.valid);
    if (oneBlockIsValid) setFormIsValid(true);

    // check if all blocks are valid which it means we need another forms block
    const allBlocksValid = form.every((x) => x.valid);
    if (allBlocksValid)
      setForm([...form, { id: form.length + 1, valid: false, data: null }]);
  }, [form]);

  const blocks = useMemo(
    () =>
      [...form].map((x) => {
        const { id, data } = x;
        return (
          <UserInvitationForm
            key={id}
            data={data}
            onChange={(d) => updateForm(d, id)}
          />
        );
      }),
    [form?.length]
  );

  const submitForm = async () => {
    const Users = [...form]
      .filter((x) => x.valid)
      .map((x) => x.data)
      .map((x) => ({
        Email: x?.email,
        FullName: x?.name,
      }));
    const { ErrorText, Succeed } = await inviteUsersBatch({
      ApplicationID,
      Users,
    });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic.MSG[ErrorText] || ErrorText,
        position: RV_RTL ? 'bottom-left' : 'bottom-right',
      });
    } else if (Succeed) {
      InfoToast({
        type: 'success',
        autoClose: true,
        message: RVDic.MSG[Succeed] || Succeed,
        position: RV_RTL ? 'bottom-left' : 'bottom-right',
      });
    }
  };

  return (
    <>
      <Styled.Title>
        {RVDic?.InviteYourTeamMatesToRaaiVan.replace(
          '[RaaiVan]',
          decodeBase64(RVGlobal?.SystemName)
        )}
      </Styled.Title>
      <Styled.SubtitleContainer>
        <InfoCircleIcon size={16} />
        <Styled.SubTitle>
          {RVDic?.ToSendTheInvitationToANewTeamMateEnterTheirEmail}
        </Styled.SubTitle>
      </Styled.SubtitleContainer>

      <form>{blocks}</form>

      <ActionBar>
        <Button
          onClick={submitForm}
          style={{
            height: '3rem',
            width: '8.25rem',
          }}
          disable={!formIsValid}
        >
          {RVDic?.Send}
        </Button>
      </ActionBar>
    </>
  );
};

const ActionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
`;
export default SendInvitation;

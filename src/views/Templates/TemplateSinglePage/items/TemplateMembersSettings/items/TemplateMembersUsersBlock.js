import UserGroupSelect from 'components/UserManagement/UserGroupSelect/UserGroupSelect';
import { useCallback, useEffect, useState } from 'react';
import * as Styled from '../TemplateMembersSettingStyles';
import api from 'apiHelper';
import { useTemplateContext } from 'views/Templates/TemplateSinglePage/TemplateProvider';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import MembersPreview from 'components/MembersPreview/MembersPreview';
import useWindow from 'hooks/useWindowContext';
import { decodeBase64 } from 'helpers/helpers';

const TemplateMembersUsersBlock = ({ users: _users, groups }) => {
  const { RVDic } = useWindow();
  const { ServiceAdmins, FreeUsers, NodeTypeID } = useTemplateContext();

  const [serviceAdmins, setServiceAdmins] = useState([]);
  const [freeUsers, setFreeUsers] = useState([]);

  useEffect(() => {
    setServiceAdmins(
      ServiceAdmins.map((u) => ({
        id: u?.UserID,
        title: decodeBase64(u?.FullName),
        src: u?.ImageURL,
      }))
    );

    setFreeUsers(
      FreeUsers?.map((u) => ({
        id: u?.UserID,
        title: decodeBase64(u?.FullName),
        src: u?.ImageURL,
      }))
    );
  }, []);

  const showErrorToast = (err) => {
    InfoToast({
      type: 'error',
      message: RVDic?.MSG[err] || err,
    });
  };

  const handleAdminUserStateChange = useCallback(async ({ user, state }) => {
    if (state) {
      const { ErrorText } = await api?.CN?.addServiceAdmin({
        UserID: user?.id,
        NodeTypeID,
      });
      ErrorText && showErrorToast(ErrorText);
      if (!ErrorText) {
        const userExist = serviceAdmins?.find((u) => u?.id === user?.id);
        if (!userExist) {
          setServiceAdmins((prev) => [...prev, user]);
        }
      }
    } else {
      const { ErrorText } = await api?.CN?.removeServiceAdmin({
        UserID: user?.id,
        NodeTypeID,
      });
      ErrorText && showErrorToast(ErrorText);
      if (!ErrorText) {
        setServiceAdmins((prev) => prev?.filter((x) => x?.id !== user?.id));
      }
    }
  }, []);

  const handleFreeUserStateChange = useCallback(async ({ user, state }) => {
    if (state) {
      const { ErrorText } = await api?.CN?.addFreeUser({
        UserID: user?.id,
        NodeTypeID,
      });
      ErrorText && showErrorToast(ErrorText);
      if (!ErrorText) {
        const userExit = freeUsers?.find((u) => u?.id === user?.id);
        if (!userExit) {
          setFreeUsers((prev) => [...prev, user]);
        }
      }
    } else {
      const { ErrorText } = await api?.CN?.removeFreeUser({
        UserID: user?.id,
        NodeTypeID,
      });
      ErrorText && showErrorToast(ErrorText);
      if (!ErrorText) {
        setFreeUsers((prev) => prev?.filter((u) => u?.id !== user?.id));
      }
    }
  }, []);

  useEffect(() => console.log(serviceAdmins));

  return (
    <Styled.MembersSettingBlockContainer>
      <Styled.MembersSettingBlock>
        <Styled.MembersSettingMicroBlock>
          <Styled.MembersSettingMicroBlockTitle>
            {'کاربران ویژه'}
          </Styled.MembersSettingMicroBlockTitle>
          <UserGroupSelect
            selectGroupEnabled={false}
            selectedUsers={ServiceAdmins?.map((x) => x?.UserID)}
            onUserStateChange={handleAdminUserStateChange}
          />
        </Styled.MembersSettingMicroBlock>

        <Styled.MembersSettingMicroBlock>
          <div></div>
          <MembersPreview
            members={serviceAdmins}
            size={2.5}
            showMore={true}
            maxItems={4}
          />
        </Styled.MembersSettingMicroBlock>
      </Styled.MembersSettingBlock>

      <Styled.Spacer />

      <Styled.MembersSettingBlock>
        <Styled.MembersSettingMicroBlock>
          <Styled.MembersSettingMicroBlockTitle>
            {'کاربران ویژه'}
          </Styled.MembersSettingMicroBlockTitle>
          <UserGroupSelect
            selectGroupEnabled={false}
            selectedUsers={FreeUsers?.map((x) => x?.UserID)}
            onUserStateChange={handleFreeUserStateChange}
          />
        </Styled.MembersSettingMicroBlock>

        <Styled.MembersSettingMicroBlock>
          <div></div>
          <MembersPreview
            members={freeUsers}
            size={2.5}
            showMore={true}
            maxItems={4}
          />
        </Styled.MembersSettingMicroBlock>
      </Styled.MembersSettingBlock>
    </Styled.MembersSettingBlockContainer>
  );
};
export default TemplateMembersUsersBlock;

import UserGroupSelect from 'components/UserManagement/UserGroupSelect/UserGroupSelect';
import { useState } from 'react';
import * as Styled from '../TemplateMembersSettingStyles';
import api from 'apiHelper';
import { useTemplateContext } from 'views/Templates/TemplateSinglePage/TemplateProvider';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { RVDic } from 'utils/TestUtils/fa';
import MembersPreview from 'components/MembersPreview/MembersPreview';

const TemplateMembersUsersBlock = ({ users: _users, groups }) => {
  const { ServiceAdmins, FreeUsers, NodeTypeID } = useTemplateContext();
  const [serviceAdmins, setServiceAdmins] = useState(
    ServiceAdmins.map((u) => ({
      id: u?.UserID,
      title: u?.FullName,
      src: u?.ImageURL,
    }))
  );
  const [freeUsers, setFreeUsers] = useState(
    FreeUsers.map((u) => ({
      id: u?.UserID,
      title: u?.FullName,
      src: u?.ImageURL,
    }))
  );

  const handleAdminUserDropdwonClose = (data) => {
    console.log(data);
  };

  const showErrorToast = (err) => {
    InfoToast({
      type: 'error',
      message: RVDic?.MSG[err] || err,
    });
  };

  const handleAdminUserStateChange = async ({ user, state }) => {
    console.log(user);
    if (state) {
      const { ErrorText } = await api?.CN?.addServiceAdmin({
        UserID: user?.id,
        NodeTypeID,
      });
      ErrorText && showErrorToast(ErrorText);
      if (!ErrorText) {
        setServiceAdmins([...serviceAdmins, user]);
      }
    } else {
      const { ErrorText } = await api?.CN?.removeServiceAdmin({
        UserID: user?.id,
        NodeTypeID,
      });
      ErrorText && showErrorToast(ErrorText);
      if (!ErrorText) {
        const _filtered = serviceAdmins?.filter((x) => x?.id !== user?.id);
        setServiceAdmins(_filtered);
      }
    }
  };

  const handleFreeUserStateChange = async ({ user, state }) => {
    if (state) {
      const { ErrorText } = await api?.CN?.addFreeUser({
        UserID: user?.id,
        NodeTypeID,
      });
      ErrorText && showErrorToast(ErrorText);
      if (!ErrorText) {
        setFreeUsers([...serviceAdmins, user]);
      }
    } else {
      const { ErrorText } = await api?.CN?.removeFreeUser({
        UserID: user?.id,
        NodeTypeID,
      });
      ErrorText && showErrorToast(ErrorText);
      if (!ErrorText) {
        const _filtered = freeUsers?.filter((x) => x?.id !== user?.id);
        setFreeUsers(_filtered);
      }
    }
  };

  return (
    <Styled.MembersSettingBlockContainer>
      <Styled.MembersSettingBlock>
        <Styled.MembersSettingMicroBlock>
          <Styled.MembersSettingMicroBlockTitle>
            {'کاربران ویژه'}
          </Styled.MembersSettingMicroBlockTitle>
          <UserGroupSelect
            onClose={handleAdminUserDropdwonClose}
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

      <Styled.MembersSettingBlock>
        <Styled.MembersSettingMicroBlock>
          <Styled.MembersSettingMicroBlockTitle>
            {'کاربران ویژه'}
          </Styled.MembersSettingMicroBlockTitle>
          <UserGroupSelect
            selectGroupEnabled={false}
            selectedUsers={freeUsers?.map((x) => x?.UserID)}
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

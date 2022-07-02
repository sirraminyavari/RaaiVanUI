import { useTemplateContext } from 'views/Templates/TemplateSinglePage/TemplateProvider';
import * as Styled from '../TemplateMembersSettingStyles';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import api from 'apiHelper';
import { useState } from 'react';
import ToggleButton from 'components/Buttons/Toggle/Toggle';

const TemplateMembersOtherSettingBlock = () => {
  const { RVDic } = window;
  const {
    EditableForAdmin,
    EditableForCreator,
    EditableForOwner,
    EditableForMembers,
    EditableForExperts,
    UniqueMembership,
    UniqueAdminMember,
    NodeTypeID,
  } = useTemplateContext();

  const [uniqueMembership, setUniqueMembership] = useState(!UniqueMembership);
  const [uniqueAdminMember, setUniqueAdminMember] = useState(
    !UniqueAdminMember
  );
  const [editableForAdmin, setEditableForAdmin] = useState(EditableForAdmin);
  const [editableForCreator, setEditableForCreator] =
    useState(EditableForCreator);
  const [editableForExperts, setEditableForExperts] =
    useState(EditableForExperts);
  const [editableForOwner, setEditableForOwner] = useState(EditableForOwner);
  const [editableForMembers, setEditableForMembers] =
    useState(EditableForMembers);

  const showErrorToast = (err) => {
    InfoToast({
      type: 'error',
      message: RVDic?.MSG[err] || err,
    });
  };

  const handleUniqueMemberShipState = async (state) => {
    setUniqueMembership(state);
    const { ErrorText } = await api?.CN?.hasUniqueMembership({ Value: state });
    if (ErrorText) {
      setUniqueMembership(!state);
      showErrorToast(ErrorText);
    }
  };

  const handleUniqueAdminsState = async (state) => {
    setUniqueAdminMember(state);
    const { ErrorText } = await api?.CN?.hasUniqueAdminMember({ Value: state });
    if (ErrorText) {
      setUniqueAdminMember(!state);
      showErrorToast(ErrorText);
    }
  };

  const handleEditableForAdminState = async (state) => {
    setEditableForAdmin(state);
    const { ErrorText } = await api?.CN?.editableForAdmin({
      NodeTypeID,
      Value: state,
    });
    if (ErrorText) {
      setEditableForAdmin(!state);
      showErrorToast(ErrorText);
    }
  };

  const handleEditableForCreator = async (state) => {
    setEditableForCreator(state);
    const { ErrorText } = await api?.CN?.editableForCreator({
      NodeTypeID,
      Value: state,
    });
    if (ErrorText) {
      setEditableForCreator(!state);
      showErrorToast(ErrorText);
    }
  };

  const handleEditableForOwner = async (state) => {
    setEditableForOwner(state);
    const { ErrorText } = await api?.CN?.editableForOwners({
      NodeTypeID,
      Value: state,
    });
    if (ErrorText) {
      setEditableForOwner(!state);
      showErrorToast(ErrorText);
    }
  };

  const handleEditableForMembersState = async (state) => {
    setEditableForMembers(state);
    const { ErrorText } = await api?.CN?.editableForMembers({
      NodeTypeID,
      Value: state,
    });
    if (ErrorText) {
      setEditableForMembers(!state);
      showErrorToast(ErrorText);
    }
  };

  const handleEditableForExpersState = async (state) => {
    setEditableForExperts(state);
    const { ErrorText } = await api?.CN?.editableForExperts({
      NodeTypeID,
      Value: state,
    });
    if (ErrorText) {
      setEditableForExperts(!state);
      showErrorToast(ErrorText);
    }
  };

  return (
    <Styled.MembersSettingBlockContainer>
      <Styled.MembersSettingBlockWrapper>
        <Styled.MembersSettingBlockTitle>
          {'تنظیمات چندگانه'}
        </Styled.MembersSettingBlockTitle>
        <Styled.MembersSettingBlock>
          <Styled.MembersSettingMicroBlock>
            <Styled.MembersSettingMicroBlockTitle>
              {'عضویت یک کاربر در بیش از یک گروه'}
            </Styled.MembersSettingMicroBlockTitle>
            <Styled.ToggleButtonWrapper>
              <ToggleButton
                value={uniqueMembership}
                onToggle={handleUniqueMemberShipState}
              />
            </Styled.ToggleButtonWrapper>
          </Styled.MembersSettingMicroBlock>

          <Styled.MembersSettingMicroBlock>
            <Styled.MembersSettingMicroBlockTitle>
              {'تعیین بیش از یک مدیر برای هر گروه'}
            </Styled.MembersSettingMicroBlockTitle>
            <ToggleButton
              value={uniqueAdminMember}
              onToggle={handleUniqueAdminsState}
            />
          </Styled.MembersSettingMicroBlock>
        </Styled.MembersSettingBlock>
      </Styled.MembersSettingBlockWrapper>

      <Styled.Spacer />

      <Styled.MembersSettingBlockWrapper>
        <Styled.MembersSettingBlockTitle>
          {'دسترسی ویرایش'}
        </Styled.MembersSettingBlockTitle>
        <Styled.MembersSettingBlock>
          <Styled.MembersSettingMicroBlock>
            <Styled.MembersSettingMicroBlockTitle>
              {'ویرایش توسط مسئول'}
            </Styled.MembersSettingMicroBlockTitle>
            <ToggleButton
              value={editableForAdmin}
              onToggle={handleEditableForAdminState}
            />
          </Styled.MembersSettingMicroBlock>

          <Styled.MembersSettingMicroBlock>
            <Styled.MembersSettingMicroBlockTitle>
              {'ویرایش توسط مشارکت‌کنندگان'}
            </Styled.MembersSettingMicroBlockTitle>
            <ToggleButton
              value={editableForOwner}
              onToggle={handleEditableForOwner}
            />
          </Styled.MembersSettingMicroBlock>
        </Styled.MembersSettingBlock>

        <Styled.MembersSettingBlock>
          <Styled.MembersSettingMicroBlock>
            <Styled.MembersSettingMicroBlockTitle>
              {'ویرایش توسط ثبت‌کننده'}
            </Styled.MembersSettingMicroBlockTitle>
            <ToggleButton
              value={editableForCreator}
              onToggle={handleEditableForCreator}
            />
          </Styled.MembersSettingMicroBlock>

          <Styled.MembersSettingMicroBlock>
            <Styled.MembersSettingMicroBlockTitle>
              {'ویرایش توسط خبرگان'}
            </Styled.MembersSettingMicroBlockTitle>
            <ToggleButton
              vlaue={editableForExperts}
              onToggle={handleEditableForExpersState}
            />
          </Styled.MembersSettingMicroBlock>
        </Styled.MembersSettingBlock>

        <Styled.MembersSettingBlock>
          <Styled.MembersSettingMicroBlock>
            <Styled.MembersSettingMicroBlockTitle>
              {'ویرایش توسط اعضا'}
            </Styled.MembersSettingMicroBlockTitle>
            <ToggleButton
              vlaue={editableForMembers}
              onToggle={handleEditableForMembersState}
            />
          </Styled.MembersSettingMicroBlock>
        </Styled.MembersSettingBlock>
      </Styled.MembersSettingBlockWrapper>
    </Styled.MembersSettingBlockContainer>
  );
};
export default TemplateMembersOtherSettingBlock;

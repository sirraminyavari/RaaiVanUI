import styled from 'styled-components';

import SettingOutlineIcon from 'components/Icons/SettingOutlineIcon/SettingOutlineIcon';
import Modal from 'components/Modal/Modal';
import { useState } from 'react';
import Button from 'components/Buttons/Button';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import UserGroupCheckbox from './UserGroupCheckbox';
import useWindowContext from 'hooks/useWindowContext';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

const UserGroupEdit = ({ Name, IsAdmin, ...props }) => {
  const { RV_RTL } = useWindowContext();

  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: 'گروه های کاربر',
    middle: true,
    contentWidth: '34rem',
    titleClass: 'rv-default',
    titleContainerClass: IsAdmin ? 'hidden-title-bar' : 'modal-title-bar',
  });

  const [showGroups, setShowGroup] = useState(!IsAdmin);

  const onModalConfirm = () => {
    setModalInfo({ ...modalInfo, show: false });
  };

  const onModalCancel = () => {
    setModalInfo({ ...modalInfo, show: false });
  };
  return (
    <>
      <ButtonContainer
        onClick={() => setModalInfo({ ...modalInfo, show: true })}>
        <Icon />
      </ButtonContainer>

      <Modal
        {...modalInfo}
        onClose={() => setModalInfo({ ...modalInfo, show: false })}>
        {IsAdmin && (
          <ModalCustomTitleBar rtl={RV_RTL}>
            <ModalTab
              selected={!showGroups}
              onClick={() => setShowGroup(false)}>
              {'دسترسی‌ها'}
            </ModalTab>
            <ModalTab selected={showGroups} onClick={() => setShowGroup(true)}>
              {'گروه‌های کاربر'}
            </ModalTab>

            <CustomTitleBarCloseButton
              rtl={RV_RTL}
              onClick={() => onModalCancel()}>
              <CloseIcon size={16} />
            </CustomTitleBarCloseButton>
          </ModalCustomTitleBar>
        )}

        {showGroups && (
          <ContentContainer>
            <ModalMessage rtl={RV_RTL}>
              {` دسترسی‌های موردنظر برای ${Name} را انتخاب نمایید: `}
            </ModalMessage>
            <OptionLayout>
              <UserGroupCheckbox
                checked={true}
                label={'گروه کاربری شماره یازده'}
              />
              <UserGroupCheckbox label={'گروه کاربری شماره دوازده'} />
              <UserGroupCheckbox label={'گروه کاربری شماره سیزده'} />
              <UserGroupCheckbox label={'گروه کاربری شماره چهل و نه'} />
              <UserGroupCheckbox label={'گروه کاربری شماره صد و پنجاه و هشت'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
              <UserGroupCheckbox label={'گروه کاربری شماره بیست و شش'} />
            </OptionLayout>
          </ContentContainer>
        )}

        {!showGroups && (
          <ContentContainer>
            <ModalMessage rtl={RV_RTL}>
              {`دسترسی‌های موردنظر برای ${Name} را انتخاب نمایید:`}
            </ModalMessage>
            <OptionLayout>
              <UserAccessOption>
                <UserAccessTitle>{'فرم ها'}</UserAccessTitle>
                <UserAccessToggle value={true} />
              </UserAccessOption>

              <UserAccessOption>
                <UserAccessTitle>{'مدیریت مستندات'}</UserAccessTitle>
                <UserAccessToggle value={true} />
              </UserAccessOption>

              <UserAccessOption>
                <UserAccessTitle>{'مدیریت سطوح محرمانگی'}</UserAccessTitle>
                <UserAccessToggle value={true} />
              </UserAccessOption>

              <UserAccessOption>
                <UserAccessTitle>{'ورود اطلاعات از طریق XML'}</UserAccessTitle>
                <UserAccessToggle value={true} />
              </UserAccessOption>

              <UserAccessOption>
                <UserAccessTitle>{'جریان‌های کاری'}</UserAccessTitle>
                <UserAccessToggle value={false} />
              </UserAccessOption>

              <UserAccessOption>
                <UserAccessTitle>{'جریان‌های کاری'}</UserAccessTitle>
                <UserAccessToggle value={false} />
              </UserAccessOption>

              <UserAccessOption>
                <UserAccessTitle>
                  {'پیام کوتاه و پست الکترونیکی'}
                </UserAccessTitle>
                <UserAccessToggle value={true} />
              </UserAccessOption>

              <UserAccessOption>
                <UserAccessTitle>{'نظرسنجی‌ها'}</UserAccessTitle>
                <UserAccessToggle value={true} />
              </UserAccessOption>

              <UserAccessOption>
                <UserAccessTitle>{'مدیریت سیستم'}</UserAccessTitle>
                <UserAccessToggle value={true} />
              </UserAccessOption>

              <UserAccessOption>
                <UserAccessTitle>{'سرورهای راه دور'}</UserAccessTitle>
                <UserAccessToggle value={true} />
              </UserAccessOption>

              <UserAccessOption>
                <UserAccessTitle>{'فرآیندهای ارزیابی دانش'}</UserAccessTitle>
                <UserAccessToggle value={true} />
              </UserAccessOption>

              <UserAccessOption>
                <UserAccessTitle>{'مدیریت کاربران'}</UserAccessTitle>
                <UserAccessToggle value={true} />
              </UserAccessOption>
            </OptionLayout>
          </ContentContainer>
        )}

        <ModelActionBar>
          <Button
            type="primary"
            style={buttonStyles}
            onClick={() => onModalConfirm()}>
            {'ذخیره'}
          </Button>

          <Button
            type="negative-o"
            style={buttonStyles}
            onClick={() => onModalCancel()}>
            {'بازگشت'}
          </Button>
        </ModelActionBar>
      </Modal>
    </>
  );
};
const ButtonContainer = styled.div.attrs({
  className: 'rv-bg-color-white',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.5rem;
  width: 2.5rem;
  cursor: pointer;
  border-radius: 100%;
`;
const Icon = styled(SettingOutlineIcon)`
  color: var(--rv-color-distant);
  font-size: 1.4rem;
  transition: color 0.3s ease-out;

  ${ButtonContainer}:hover & {
    color: var(--rv-color);
  }
`;

const OptionLayout = styled.div`
  background-color: ${CV_GRAY_LIGHT};
  border-radius: 0.45rem;
  margin: 1rem 0;
  padding: 0.75rem;
  max-height: 26rem;
  overflow-y: auto;
`;

const ContentContainer = styled.div`
  margin: 1.5rem 0;
`;

const ModalMessage = styled.p`
  height: 1.8rem;
  line-height: 1.8rem;
  font-size: 0.875rem;
  color: ${CV_GRAY};
  direction: ${({ rtl }) => (rtl ? 'rtl' : 'ltr')};
  text-align: ${({ rtl }) => (rtl ? 'right' : 'left')};
  margin-bottom: 0;
`;

const ModalCustomTitleBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  background-color: ${CV_GRAY_LIGHT};
  height: 4.5rem;
  width: calc(100% + 2rem);
  margin: ${({ rtl }) => (rtl ? '-1rem -1rem 0 0' : '-1rem 0 0 -1rem')};
  padding: 0 1rem;
  border-radius: 1rem 1rem 0 0;
  position: relative;
`;

const ModalTab = styled.div`
  cursor: pointer;
  font-size: 1.1rem;
  padding: 1rem;
  height: 4rem;
  line-height: 2rem;
  font-weight: 400;
  color: ${({ selected }) => (selected ? TCV_DEFAULT : CV_DISTANT)};
  ${({ selected }) => selected && `border-bottom: 3px solid ${TCV_DEFAULT}`};
`;

const UserAccessOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  line-height: 3rem;
`;

const UserAccessTitle = styled.div`
  font-size: 1rem;
  color: ${CV_GRAY};
  width: 100%;
`;

const UserAccessToggle = styled(ToggleButton)`
  width: 2rem !important;
`;

const ModelActionBar = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  margin-top: 2.2rem;
`;

const CustomTitleBarCloseButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.4rem;
  width: 1.4rem;
  position: absolute;
  ${({ rtl }) => (rtl ? 'left: 1rem' : 'right:1rem')};
  border-radius: 100%;
  color: ${CV_RED};
  cursor: pointer;
  top: 1.5rem;

  &:hover {
    background-color: ${CV_RED};
    color: ${CV_WHITE};
  }
`;

const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};

export default UserGroupEdit;

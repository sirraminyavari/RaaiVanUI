import * as Styled from './UsersStyle';
import * as UserCreateStyle from './UserCreateStyles';
import UsersGroupIcon from 'components/Icons/UsersGroupIcon/UsersGroup';
import useWindowContext from 'hooks/useWindowContext';
import InfoCircleIcon from 'components/Icons/InfoCircleIcon/InfoIcon';
import InputLoader from './items/rows/InputLoader';
import { useState } from 'react';
import Button from 'components/Buttons/Button';
import { checkUserName, createUser } from 'apiHelper/ApiHandlers/usersApi';

const UsersCreate = ({ onClose }) => {
  const { RV_RTL, RVDic, RVGlobal } = useWindowContext();

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: RVDic?.UserManagement,
      linkTo: '',
    },
    {
      id: 3,
      title: RVDic?.CreateNewN?.replace(`[n]`, RVDic.User),
      linkTo: '',
    },
  ];

  const [loader, setLoader] = useState(false);
  const [shake, setShake] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [form, setForm] = useState({
    Username: '',
    FirstName: '',
    LastName: '',
  });
  const [usernameIsValid, setUsernameIsValid] = useState(false);

  const formIsValid = () => {
    const { Username, FirstName, LastName } = form;
    return Username && FirstName && LastName && usernameIsValid;
  };

  const handleUsernameValidity = async (Username) => {
    setForm({ ...form, Username: Username });
    if (Username !== '') {
      setLoader(true);
      const res = await checkUserName({ UserName: Username });
      if (res) {
        setShake(true);
        setTimeout(() => setShake(false), 1500);
      }
      setHighlight(res);
      setUsernameIsValid(!res);
      setLoader(false);
    }
  };

  const submit = async () => {
    const res = await createUser(form);
  };

  return (
    <>
      <Styled.BreadCrumbWrapper items={breadCrumbItems} rtl={RV_RTL} />
      <Styled.HeadingWrapper>
        {RVDic?.CreateNewN?.replace(`[n]`, RVDic.User)}
      </Styled.HeadingWrapper>
      <Styled.ReturnButtonWrapper rtl={RV_RTL}>
        <Styled.ReturnButton onClick={onClose}>
          {RVDic?.Return}
        </Styled.ReturnButton>
      </Styled.ReturnButtonWrapper>

      <UserCreateStyle.IconContainer>
        <UsersGroupIcon size={64} />
      </UserCreateStyle.IconContainer>

      <UserCreateStyle.FormContainer>
        <UserCreateStyle.Title>
          {'کاربر جدید را اضافه کنید!'}
        </UserCreateStyle.Title>
        <UserCreateStyle.SubtitleContainer>
          <InfoCircleIcon size={16} />
          <UserCreateStyle.SubTitle>
            {'برای افزودن کاربر جدید، مشخصات او را وارد کنید'}
          </UserCreateStyle.SubTitle>
        </UserCreateStyle.SubtitleContainer>

        <>
          <UserCreateStyle.UsernameInput
            className={shake && 'rv-shake'}
            error={highlight}>
            <UserCreateStyle.UsernameInputField
              defaultValue={form.Username}
              onChange={(Username) => handleUsernameValidity(Username)}
              type="text"
              delayTime={1000}
              placeholder={RVDic?.UserName}
              pattern={RVGlobal?.UserNamePattern}
            />
            {loader && <InputLoader />}
          </UserCreateStyle.UsernameInput>
          <UserCreateStyle.NormalInput
            value={form.FirstName}
            onChange={(e) => setForm({ ...form, FirstName: e?.target?.value })}
            type="text"
            placeholder={RVDic?.FirstName}
          />
          <UserCreateStyle.NormalInput
            value={form.LastName}
            onChange={(e) => setForm({ ...form, LastName: e?.target?.value })}
            type="text"
            placeholder={RVDic?.LastName}
          />
        </>
        <UserCreateStyle.ActionBar>
          <Button
            onClick={submit}
            style={{
              height: '3rem',
              width: '8.25rem',
            }}
            disable={!formIsValid()}>
            {RVDic?.Send}
          </Button>
        </UserCreateStyle.ActionBar>
      </UserCreateStyle.FormContainer>
    </>
  );
};
export default UsersCreate;

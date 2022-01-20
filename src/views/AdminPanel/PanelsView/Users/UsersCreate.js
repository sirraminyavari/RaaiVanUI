import * as Styled from './UsersStyle';
import UsersGroupIcon from 'components/Icons/UsersGroupIcon/UsersGroup';
import useWindowContext from 'hooks/useWindowContext';
import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY_DARK,
  CV_RED,
  CV_WHITE,
} from 'constant/CssVariables';
import InfoCircleIcon from 'components/Icons/InfoCircleIcon/InfoIcon';
import SearchInput from 'components/Inputs/SearchInput';
import InputLoader from './items/rows/InputLoader';
import { useState } from 'react';
import Button from 'components/Buttons/Button';
import { checkUserName, createUser } from 'apiHelper/ApiHandlers/usersApi';

const UsersCreate = ({ onClose, ...props }) => {
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

  const handleUsernameValidity = (Username) => {
    setForm({ ...form, Username: Username });
    if (Username !== '') {
      setLoader(true);
      checkUserName(Username).then((res) => {
        if (res) {
          setShake(true);
          setTimeout(() => setShake(false), 1500);
        }
        setHighlight(res);
        setUsernameIsValid(!res);
        setLoader(false);
      });
    }
  };

  const submit = () => {
    createUser(form)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
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

      <IconContainer>
        <UsersGroupIcon size={64} />
      </IconContainer>

      <FormContainer>
        <Title>{'کاربر جدید را اضافه کنید!'}</Title>
        <SubtitleContainer>
          <InfoCircleIcon size={16} />
          <SubTitle>
            {'برای افزودن کاربر جدید، مشخصات او را وارد کنید'}
          </SubTitle>
        </SubtitleContainer>

        <>
          <UsernameInput className={shake && 'rv-shake'} error={highlight}>
            <UsernameInputField
              defaultValue={form.Username}
              onChange={(Username) => handleUsernameValidity(Username)}
              type="text"
              delayTime={1000}
              placeholder={RVDic?.UserName}
              pattern={RVGlobal?.UserNamePattern}
            />
            {loader && <InputLoader />}
          </UsernameInput>
          <NormalInput
            value={form.FirstName}
            onChange={(e) => setForm({ ...form, FirstName: e?.target?.value })}
            type="text"
            placeholder={RVDic?.FirstName}
          />
          <NormalInput
            value={form.LastName}
            onChange={(e) => setForm({ ...form, LastName: e?.target?.value })}
            type="text"
            placeholder={RVDic?.LastName}
          />
        </>
        <ActionBar>
          <Button
            onClick={submit}
            style={{
              height: '3rem',
              width: '8.25rem',
            }}
            disable={!formIsValid()}>
            {RVDic?.Send}
          </Button>
        </ActionBar>
      </FormContainer>
    </>
  );
};

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8rem;
  height: 8rem;
  background-color: ${CV_WHITE};
  color: ${CV_DISTANT};
  border-radius: 100%;
  margin: 2rem auto;
`;

const FormContainer = styled.div`
  background-color: ${CV_WHITE};
  border-radius: 0.8rem;
  border: 1px solid ${CV_DISTANT};
  padding: 2.4rem;
  width: 100%;
  margin: 1.5rem auto 6rem auto;
  max-width: 30rem;
`;
export const Title = styled.div`
  color: ${CV_GRAY_DARK};
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.625rem;
`;
export const SubtitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1.9rem;
  gap: 0.35rem;
  color: ${CV_DISTANT};
`;
export const SubTitle = styled.div`
  font-size: 0.81rem;
  font-weight: 400;
`;
const NormalInput = styled.input`
  height: 3rem;
  border-radius: 0.3rem;
  padding: 0.3rem;
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid ${CV_DISTANT};
  outline: none;
`;

const UsernameInput = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${({ error }) =>
    error ? `1px solid ${CV_RED}` : `1px solid ${CV_DISTANT}`};
  border-radius: 0.3rem;
  padding: 0.3rem;
  margin-bottom: 1rem;
`;
const UsernameInputField = styled(SearchInput)`
  width: 100%;
  border: none;
  outline: none;
`;
const ActionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
`;
export default UsersCreate;

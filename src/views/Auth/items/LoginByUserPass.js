/**
 * A component for entering the username and password.
 */
import LoadingButton from 'components/Buttons/LoadingButton';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import login from 'store/actions/auth/loginAction';
import { encode } from 'js-base64';

const LoginByUserPass = () => {
  const { RVDic } = window;
  const dispatch = useDispatch();
  const { isFetching } = useSelector((state) => state.auth);

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState(false);
  const [userErr, setUserErr] = useState(false);

  useEffect(() => {
    pass.length > 0 && setPassErr(false);
    user.length > 0 && setUserErr(false);
  }, [user, pass]);

  const isButtonDisabled =
    user.length === 0 || pass.length === 0 ? true : false;

  /**
   * By clicking the login button, this function will be called
   * and will check the username and password length
   */
  const onLoginPressed = () => {
    if (user.length === 0) {
      setUserErr(true);
      pass.length === 0 && setPassErr(true);
    } else if (pass.length === 0) {
      setPassErr(true);
    } else {
      dispatch(login({ UserName: encode('admin'), Password: encode('admin') }));
    }
  };
  return (
    <Maintainer>
      <AnimatedInput
        type={'text'}
        placeholder={RVDic.UserName}
        onChange={setUser}
        error={userErr}
      />
      <AnimatedInput
        type={'password'}
        placeholder={RVDic.Password}
        onChange={setPass}
        error={passErr}
      />
      <LoadingButton
        label={'ورود'}
        disable={isButtonDisabled}
        onClick={() => onLoginPressed()}
        isFetching={isFetching}
      />
    </Maintainer>
  );
};
export default LoginByUserPass;

const Maintainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  align-self: center;
`;

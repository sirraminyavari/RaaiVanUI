import Button from 'components/Buttons/Button';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/slice/auth/selectors';
import styled from 'styled-components';
import { Box } from '../AuthView.style';

const ResetPasswordAddress = () => {
  const {
    resetPasswordAddress: { email, phone },
  } = useSelector(selectAuth);

  const hideString = (value, index, replacement) => {
    return (
      value?.substr(0, index) +
      replacement +
      value?.substr(index + replacement?.length)
    );
  };

  return (
    <Box>
      <div>{'choose address for pass reset'}</div>
      {/* <Form>
        <input type="radio" id="phone" name="phone" value={phone} />
        <label for="phone">{hideString(phone, 3, '****')}</label>
        <input type="radio" id="email" name="email" value={email} />
        <label for="email">{hideString(email, 3, '********')}</label>
      </Form> */}
      <Tbody>
        <td>
          <input
            type="radio"
            name="site_name"
            value={phone}
            checked={true}
            onChange={() => {
              console.log('phone');
            }}
          />
          {hideString(phone, 3, '****')}
        </td>
        <td>
          <input
            type="radio"
            name="address"
            value={email}
            checked={false}
            onChange={() => {
              console.log('email');
            }}
          />
          {hideString(email, 3, '********')}
        </td>
      </Tbody>
      <Button></Button>
    </Box>
  );
};
export default ResetPasswordAddress;

const Tbody = styled.div`
  display: flex;
  flex-direction: column;
`;

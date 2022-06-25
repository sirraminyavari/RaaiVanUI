/**
 * A component for showing the organization domains in a DropDown list
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthSlice } from 'store/slice/auth';
import { selectAuth } from 'store/slice/auth/selectors';
import styled from 'styled-components';
import { ShakeAnimate } from './Animate.style';

const { RV_Float } = window;

const OrgDomains = () => {
  const dispatch = useDispatch();

  const { actions: authActions } = useAuthSlice();

  const { orgDomains, orgDomainsError } = useSelector(selectAuth);

  /**
   * By clicking the 'option' will fire.
   * @param { React.FormEvent<HTMLInputElement>} event - index of selected orgDomain
   */
  const onSelectItem = (event) => {
    dispatch(authActions.setSelectedOrgDomain(orgDomains[event.target.value]));
  };

  return (
    <ShakeAnimate isVisible={orgDomainsError}>
      <Border error={orgDomainsError}>
        <Select onChange={onSelectItem}>
          {orgDomains.map((x, index) => (
            <option key={index} value={index}>
              {x?.Title}
            </option>
          ))}
        </Select>
      </Border>
    </ShakeAnimate>
  );
};
export default OrgDomains;

const Select = styled.select`
  border: none;
  direction: ${RV_Float === 'right' ? 'rtl' : 'ltr'};
  outline: none;
  textarea:focus,
  input:focus {
    outline: none;
  }
`;
const Border = styled.div`
  border-radius: 7px;

  padding: 0.3rem 0.3rem 0.3rem 0.6rem;
  border: ${({ error }) => (error ? '0.5px solid red' : '0.5px solid #bac9dc')};
  width: 100%;
`;

/**
 * A component for showing the organization domains in a DropDown list
 */
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setSelectedOrgDomainAction from 'store/actions/auth/setSelectedOrgDomainAction';
import styled from 'styled-components';
import { ShakeAnimate } from './Animate.style';

const { RV_Float } = window;

const OrgDomains = () => {
  const dispatch = useDispatch();

  // We use ref to pass component dimension to 'UpToDownAnimate'
  const ref = useRef();

  const { orgDomains, orgDomainsError } = useSelector((state) => ({
    orgDomains: state.auth.orgDomains,
    orgDomainsError: state.auth.orgDomainsError,
  }));

  /**
   * By clicking the 'option' will fire.
   * @param { React.FormEvent<HTMLInputElement>} event - index of selected orgDomain
   */
  const onSelectItem = (event) => {
    dispatch(setSelectedOrgDomainAction(orgDomains[event.target.value]));
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

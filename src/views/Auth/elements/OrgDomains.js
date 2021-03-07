/**
 * A component for showing the organization domains in a DropDown list
 */
import AnimatedDropDownList from 'components/DropDownList/AnimatedDropDownList';
import { SIGN_IN, SIGN_IN_COLLAPSED } from 'const/LoginRoutes';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setSelectedOrgDomainAction from 'store/actions/auth/setSelectedOrgDomainAction';
import { ShakeAnimate, UpToDownAnimate } from './Animate.style';
import styled from 'styled-components';

const { RVDic, RV_Float } = window;

const OrgDomains = () => {
  const dispatch = useDispatch();

  // We use ref to pass component dimension to 'UpToDownAnimate'
  const ref = useRef();

  const {
    orgDomains,
    currentRoute,
    selectedDomain,
    orgDomainsError,
  } = useSelector((state) => ({
    orgDomains: state.auth.orgDomains,
    currentRoute: state.auth.currentRoute,
    selectedDomain: state.auth.selectedDomain,
    orgDomainsError: state.auth.orgDomainsError,
  }));

  // const orgDomains = ['one', 'two', 'three', 'four'];
  /**
   * According to 'currentRoute'
   * this function decides to return true or false.
   */
  const isVisible = () => {
    switch (currentRoute) {
      case SIGN_IN:
      case SIGN_IN_COLLAPSED:
        return orgDomains?.length > 0;
      default:
        return false;
    }
  };
  /**
   * By clicking the 'option' will fire.
   * @param { React.FormEvent<HTMLInputElement>} event - index of selected orgDomain
   */
  const onSelectItem = (event) => {
    dispatch(setSelectedOrgDomainAction(orgDomains[event.target.value]));
  };

  return (
    <UpToDownAnimate
      ref={ref}
      dimension={ref?.current?.getBoundingClientRect()}
      isVisible={isVisible()}
      style={{ zIndex: 10 }}>
      {/* <AnimatedDropDownList
        error={orgDomainsError}
        label={selectedDomain ? selectedDomain?.Title : RVDic.DomainSelect}
        onSelectItem={onSelectItem}
        list={orgDomains.map((x, index) => x?.Title)}
      /> */}
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
    </UpToDownAnimate>
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

  margin-top: 1.5rem;
  padding: 0.3rem 0.3rem 0.3rem 0.6rem;
  border: ${({ error }) => (error ? '0.5px solid red' : '0.5px solid #bac9dc')};
  width: 100%;
`;

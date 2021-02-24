/**
 * A component for showing the organization domains in a DropDown list
 */
import AnimatedDropDownList from 'components/DropDownList/AnimatedDropDownList';
import { SIGN_IN, SIGN_IN_COLLAPSED } from 'const/LoginRoutes';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setSelectedOrgDomainAction from 'store/actions/auth/setSelectedOrgDomainAction';
import { UpToDownAnimate } from './Animate.style';

const { RVDic } = window;

const OrgDomains = () => {
  const dispatch = useDispatch();
  const {
    orgDomains,
    currentRoute,
    selectedDomain,
    orgDomainsError,
  } = useSelector((state) => ({
    orgDomains: state.login.orgDomains,
    currentRoute: state.login.currentRoute,
    selectedDomain: state.login.selectedDomain,
    orgDomainsError: state.login.orgDomainsError,
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
   * By clicking the list item will fire.
   * @param {number} index - index of selected orgDomain
   * @param {String} title - title of selected orgDomain
   */
  const onSelectItem = (title, index) => {
    console.log(orgDomains[index], index, 'on select');
    dispatch(setSelectedOrgDomainAction(orgDomains[index]));
  };

  return (
    <UpToDownAnimate isVisible={isVisible()} style={{ zIndex: 10 }}>
      <AnimatedDropDownList
        error={orgDomainsError}
        label={selectedDomain ? selectedDomain?.Title : RVDic.DomainSelect}
        onSelectItem={onSelectItem}
        list={orgDomains.map((x, index) => x?.Title)}
      />
    </UpToDownAnimate>
  );
};
export default OrgDomains;

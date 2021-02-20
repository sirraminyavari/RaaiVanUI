/**
 * A component for showing the organization domains in a DropDown list
 */
import AnimatedDropDownList from 'components/DropDownList/AnimatedDropDownList';
import { SIGN_IN, SIGN_IN_COLLAPSED } from 'const/LoginRoutes';
import React from 'react';
import { useSelector } from 'react-redux';
import { UpToDownAnimate } from './Animate.style';

const { RVDic } = window;

const OrgDomains = () => {
  const { orgDomains, currentRoute } = useSelector((state) => ({
    orgDomains: state.login.orgDomains,
    currentRoute: state.login.currentRoute,
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
   * @param {object} value - object of selected orgDomain
   */
  const onSelectItem = (value) => {
    console.log(value, 'on select');
  };

  return (
    <UpToDownAnimate isVisible={isVisible()} style={{ zIndex: 10 }}>
      <AnimatedDropDownList
        label={RVDic.DomainSelect}
        onSelectItem={onSelectItem}
        list={orgDomains}
      />
    </UpToDownAnimate>
  );
};
export default OrgDomains;

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import { BO_RADIUS_UNIT } from 'constant/constants';
import { BG_GRAY_LIGHT } from 'constant/Colors';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

/**
 *
 *@component - Welcome Layout
 *
 * Useful for creating a split screen views like landing pages
 *
 * example:
 *
 * ```html
 * <WelcomeLayout>
 *  <SomeComponent/>
 *  <SomeOtherComponent/>
 * </WelcomeLayout>
 * ```
 *
 * @param {object} props - WelcomeLayout component props
 * @param {JSX.Element[]} [props.children=[]] - JSX Children passed to the component
 * @param {JSX.Element} [props.Wrapper="div"] - JSX or HTML Element to wrap the layout to fit styling need
 *
 * @return {JSX.Element} JSX Layout component
 */
function WelcomeLayout({ children, Wrapper = WelcomeLayoutContainer }) {
  const isMobileScreen = DimensionHelper().isMobile;

  return (
    <Wrapper
      className={classNames(BG_GRAY_LIGHT, BO_RADIUS_UNIT)}
      isMobile={isMobileScreen}>
      {Children.toArray(children).map((child, idx) => (
        <LayoutColumn
          isMobile={isMobileScreen}
          key={`WelcomeLayout-col-${idx}`}>
          {child}
        </LayoutColumn>
      ))}
    </Wrapper>
  );
}

WelcomeLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  Wrapper: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.element,
  ]),
};

WelcomeLayout.defaultDrops = {
  children: [],
};

export default WelcomeLayout;

const WelcomeLayoutContainer = styled.div`
  min-height: 100vh;
  box-shadow: 1px 5px 15px #0000001f;
  margin: 1rem;
  padding: 0 2rem 1rem 2rem;
  ${({ isMobile = false }) =>
    !isMobile &&
    `
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    `}
`;

const LayoutColumn = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  ${({ isMobile = false }) =>
    !isMobile &&
    `
  position: sticky;
  top: 0;
    `}
`;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { BO_RADIUS_UNIT, MOBILE_BOUNDRY } from 'constant/constants';
import { BG_GRAY_LIGHT } from 'constant/Colors';

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
 *
 * @return {JSX.Element} JSX Layout component
 */
function WelcomeLayout({ children }) {
  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });

  return (
    <WelcomeLayoutContainer
      className={classNames(BG_GRAY_LIGHT, BO_RADIUS_UNIT)}
      isMobile={isMobileScreen}>
      {children.map((child, idx) => (
        <LayoutColumn
          isMobile={isMobileScreen}
          key={`WelcomeLayout-col-${idx}`}>
          {child}
        </LayoutColumn>
      ))}
    </WelcomeLayoutContainer>
  );
}

WelcomeLayout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
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

  .archived-teams {
    max-height: calc(100vh - 4.5rem);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
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

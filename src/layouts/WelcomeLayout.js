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
 * @param {boolean} [props.noOutline=false] - remove outline shadow surrounding the layout
 * @param {boolean} [props.noPadding=false] - remove padding surrounding each column in the layout
 * @param {boolean} [props.singleColumn=false] - Force the layout to be a single column
 * (use case: set responsive view based on DimensionHelper() function)
 *
 * @return {JSX.Element} JSX Layout component
 */
function WelcomeLayout({
  children,
  noOutline,
  noPadding,
  singleColumn,
  Wrapper = WelcomeLayoutContainer,
  className,
  ...restProps
}) {
  const isMobileScreen = DimensionHelper().isMobile;

  return (
    <Wrapper
      {...restProps}
      Outline={!noOutline}
      Padding={!noPadding}
      className={classNames(BG_GRAY_LIGHT, BO_RADIUS_UNIT, className)}
      isMobile={singleColumn || isMobileScreen}>
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
  noOutline: PropTypes.bool,
  noPadding: PropTypes.bool,
  singleColumn: PropTypes.bool,
};

WelcomeLayout.defaultDrops = {
  children: [],
  noOutline: false,
};

export default WelcomeLayout;

const WelcomeLayoutContainer = styled.div`
  ${({ Outline = true }) => Outline && `box-shadow: 1px 5px 15px #0000001f;`}
  ${({ Padding = true }) => Padding && `padding: 0 2rem 1rem 2rem;`}
  min-height: 100vh;
  margin: 1rem;
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

import React from 'react';
import styled from 'styled-components';
import { IHeadingType } from './types';

/**
 * @typedef props input properties
 */

/**
 * @description standard heading component based on design system
 * @typedef { object } props
 * @property { string } type determines the type of the heading and can be one of these values:
 * [h1, h2, h3, h4, h5, h6]
 * @property { bool } darkBackground determines if the heading is rendered on a dark background or not
 */

const Heading = ({
  type = 'H1',
  darkBackground,
  className,
  style,
  children,
  ...props
}: {
  type: IHeadingType;
  darkBackground;
  className;
  style;
  children;
}) => {
  const { GlobalUtilities } = window;
  const values = resolveValues({ type, darkBackground, GlobalUtilities });

  return (
    <StyledElement
      className={values.class + ' ' + (className || ' ')}
      style={GlobalUtilities.extend(style || {}, {
        fontSize: values.size,
        fontWeight: values.weight || 'normal',
      })}
      {...props}
    >
      {children}
    </StyledElement>
  );
};

export default Heading;

const resolveValues = ({
  type,
  darkBackground,
  GlobalUtilities,
}: {
  type: IHeadingType;
  darkBackground?: boolean;
  GlobalUtilities: any;
}) => {
  if (GlobalUtilities.get_type(type) === 'string')
    type = type.toLowerCase() as unknown as IHeadingType;

  const dic = {
    h1: { class: 'rv-warm', size: '1.4rem', weight: 'bold' },
    h2: { class: 'rv-dark-gray', size: '1.1rem', weight: '500' },
    h3: { class: 'rv-dark-gray', size: '1.1rem', weight: '300' },
    h4: { class: 'rv-warm', size: '1rem' },
    h5: { class: 'rv-distant', size: '1rem', weight: '200' },
    h6: { class: 'rv-gray', size: '0.8rem', weight: '200' },
  };

  return GlobalUtilities.extend(
    dic[type] || resolveValues({ type: 'h2', GlobalUtilities }),
    darkBackground ? { class: 'rv-white' } : {}
  );
};

const StyledElement = styled.div`
  ::first-letter {
    text-transform: capitalize;
  }
`;

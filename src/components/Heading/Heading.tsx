import type { HTMLProps, PropsWithChildren } from 'react';
import React from 'react';
import classnames from 'classnames';

export type IHeading = HTMLProps<HTMLDivElement> &
  PropsWithChildren<{
    type: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';
    darkBackground?: boolean;
  }>;

/**
 * @component
 * @description standard heading component based on design system
 * @param { string } props.type determines the type of the heading and can be one of these values:
 * [H1, H2, H3, H4, H5, H6]
 * @param { boolean } [props.darkBackground] determines if the heading is rendered on a dark background or not
 */

// TODO working with classes ?!?

function Heading({
  type = 'H1',
  darkBackground,
  className,
  style,
  ...props
}: IHeading): JSX.Element {
  const values = resolveValues({
    type: type.toUpperCase() as IHeading['type'],
    darkBackground,
  });

  return (
    <div
      className={classnames(values.class, className)}
      style={{
        ...style,
        fontSize: values.size,
        fontWeight: values.weight || 'normal',
      }}
      {...props}
    >
      {props.children}
    </div>
  );
}

export default Heading;

const resolveValues = ({
  type,
  darkBackground,
}: Pick<IHeading, 'type' | 'darkBackground'>) => {
  const dic = {
    H1: {
      class: classnames('rv-warm', darkBackground && 'rv-white'),
      size: '1.4rem',
      weight: 'bold',
    },
    H2: {
      class: classnames('rv-dark-gray', darkBackground && 'rv-white'),
      size: '1.1rem',
      weight: '500',
    },
    H3: {
      class: classnames('rv-dark-gray', darkBackground && 'rv-white'),
      size: '1.1rem',
      weight: '300',
    },
    H4: {
      class: classnames('rv-warm', darkBackground && 'rv-white'),
      size: '1rem',
      weight: 'normal',
    },
    H5: {
      class: classnames('rv-distant', darkBackground && 'rv-white'),
      size: '1rem',
      weight: '200',
    },
    H6: {
      class: classnames('rv-gray', darkBackground && 'rv-white'),
      size: '0.8rem',
      weight: '200',
    },
  };

  return dic[type];
};

import classNames from 'classnames';
import { forwardRef, MouseEventHandler, ReactNode } from 'react';
import {
  Button as ButtonComponent,
  RVButton,
  RVColorProp,
  RVSizeProp,
  RVVariantProp,
} from '@cliqmind/rv-components';
import LoadingIconFlat from '../Icons/LoadingIcons/LoadingIconFlat';

export type IButton = Omit<RVButton, 'type' | 'ref'> & {
  children?: ReactNode;
  type?:
    | 'disabled'
    | 'primary'
    | 'primary-o'
    | 'secondary-o'
    | 'negative'
    | 'negative-o'
    | 'negative-secondary-o';
  className?: string;
  classes?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  disable?: boolean;
  $circleEdges?: boolean;
  isCustomButton?: boolean;
};

/**
 * @description standard button component that is created based on design system
 * @component
 * @property { string } [props.type] the type of the button that can be one of these values: [primary, primary-o, secondary-o, negative, negative-o]
 * @property { bool } [props.loading] determines if the button is in the state of processing or loading and thus cannot be clicked
 * @property { bool } [props.disable] determines if the button is disabled and so, cannot be clicked
 * @property { bool } [props.$circleEdges] if equals true, the border-radius will be circle shaped
 * @property { bool } [props.isCustomButton] if true, ignores default styles of button types
 * @property { function } [props.onClick] @fires onClick when the button is clicked and is not disabled or in loading state
 */
const Button = forwardRef<HTMLButtonElement, IButton>(
  (
    {
      type = 'primary',
      loading,
      disable = false,
      $circleEdges = false,
      isCustomButton = false,
      size = RVSizeProp.medium,
      onClick,
      className,
      classes,
      children,
      style = {},
      ...props
    },
    ref
  ) => {
    return (
      <ButtonComponent
        ref={ref}
        size={size}
        rounded={
          $circleEdges !== undefined
            ? $circleEdges
              ? 'full'
              : 'half'
            : undefined
        }
        className={classNames(classes || className)}
        style={{ boxSizing: 'content-box', ...style }}
        disabled={disable}
        onClick={disable || loading ? undefined : onClick}
        {...(!isCustomButton && resolveClass({ type }))}
        {...props}
      >
        {!loading ? (
          children
        ) : (
          <>
            <span style={{ color: 'transparent' }}>1</span>
            <LoadingIconFlat />
            <span style={{ color: 'transparent' }}>1</span>
          </>
        )}
      </ButtonComponent>
    );
  }
);

export default Button;

const resolveClass = ({
  type = 'primary',
}: {
  type: Exclude<IButton['type'], undefined>;
}) => {
  const dic = {
    disabled: {
      disabled: true,
    },
    primary: {
      variant: RVVariantProp.primary,
    },
    'primary-o': {
      variant: RVVariantProp.outline,
    },
    'secondary-o': {
      variant: RVVariantProp.outline,
      color: RVColorProp.distant,
    },
    negative: {
      variant: RVVariantProp.primary,
      color: RVColorProp.crayola,
    },
    'negative-o': {
      variant: RVVariantProp.outline,
      color: RVColorProp.crayola,
    },
    'negative-secondary-o': {
      variant: RVVariantProp.outline,
      color: RVColorProp.crayola,
    },
  };

  return dic[type];
};

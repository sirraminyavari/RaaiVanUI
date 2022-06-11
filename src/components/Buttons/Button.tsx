import {
  forwardRef,
  HTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
  ReactNode,
} from 'react';
import LoadingIconFlat from '../Icons/LoadingIcons/LoadingIconFlat';

export type IButtonType = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'ref'
> & {
  children?: ReactNode;
  type?:
    | 'disabled'
    | 'primary'
    | 'secondary'
    | 'primary-o'
    | 'secondary-o'
    | 'negative'
    | 'negative-o'
    | 'negative-secondary-o';
  className?: string;
  classes?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
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
const Button = forwardRef<HTMLDivElement, IButtonType>(
  (
    {
      type = 'primary',
      loading,
      disable = false,
      $circleEdges = false,
      isCustomButton = false,
      onClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={
          ($circleEdges ? 'rv-circle' : 'rv-border-radius-half') +
          (isCustomButton ? '' : resolveClass({ type, disable })) +
          ' ' +
          (props.classes || className || ' ')
        }
        style={props.style}
        onClick={disable || loading ? undefined : onClick}
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
      </div>
    );
  }
);

export default Button;

const resolveClass = ({
  type,
  disable,
}: {
  type: Exclude<IButtonType['type'], undefined>;
  disable?: boolean;
}) => {
  if (disable) type = 'disabled';

  const dic = {
    disabled: 'rv-action-button-disabled',
    primary: 'rv-action-button',
    'primary-o': 'rv-action-button-o',
    'secondary-o': 'rv-action-button-secondary-o',
    negative: 'rv-action-button-negative',
    'negative-o': 'rv-action-button-negative-o',
    'negative-secondary-o': 'rv-action-button-negative-so',
  };

  return (
    ' rv-action-button-base ' + (dic[type] || resolveClass({ type: 'primary' }))
  );
};
import type {
  DetailedHTMLProps,
  DetailsHTMLAttributes,
  PropsWithoutRef,
} from 'react';
import { useState, useEffect } from 'react';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './Accordion.styles';

export interface IAccordion
  extends PropsWithoutRef<
    DetailedHTMLProps<
      DetailsHTMLAttributes<HTMLDetailsElement>,
      HTMLDetailsElement
    >
  > {
  label?: string;
  labelClassName?: string;
  caretClassName?: string;
}

const Accordion = ({
  label,
  onClick,
  open,
  labelClassName,
  caretClassName,
  children,
  ...restProps
}: IAccordion) => {
  const [isOpen, setIsOpen] = useState(false);
  const { RV_RTL } = useWindow();

  useEffect(() => {
    setIsOpen(Boolean(open));
  }, [open]);

  return (
    <Styles.AccordionDetails open={isOpen} active={open} {...restProps}>
      <Styles.AccordionSummary
        isOpen={isOpen}
        className={labelClassName}
        onClick={(event) => {
          event.preventDefault();
          setIsOpen(!isOpen);
          //@ts-expect-error
          onClick && onClick(event);
        }}
      >
        <CaretIcon className={caretClassName} dir={RV_RTL ? 'left' : 'right'} />
        {label}
      </Styles.AccordionSummary>

      {children}
    </Styles.AccordionDetails>
  );
};
Accordion.displayName = 'Accordion';
export default Accordion;

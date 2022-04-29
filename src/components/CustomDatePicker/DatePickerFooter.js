import { useMemo } from 'react';
import Button from 'components/Buttons/Button';
import * as Styled from './CustomDatePicker.styles';
import RefreshIcon from 'components/Icons/UndoIcon/Undo';
import useWindow from 'hooks/useWindowContext';

const buttonsCommonStyles = {
  padding: '0.3rem 0',
  fontSize: '1.2em',
  fontWeight: 'bold',
  minHeight: '2.5em',
  width: '24%',
};

/**
 * @typedef PropType
 * @type {Object}
 * @property {String} activeFooter - Active footer span.
 * @property {Function} onFooterClick
 * @property {Function} onClear
 * @property {('small' | 'medium' | 'large')} size - The date picker size.
 * @property {String} headerTitle - The header title.
 */

/**
 * @description Renders footer for date picker.
 * @component
 * @param {PropType} props -Props that pass to footer component.
 */
const DatePickerFooter = (props) => {
  const { RVDic } = useWindow();

  const { size, headerTitle, activeFooter, onFooterClick, onClear } = props;

  const footerButtonList = useMemo(
    () => [
      { id: '1', title: RVDic.Today, dateSpan: '1' },
      { id: '2', title: RVDic.Yesterday, dateSpan: '-1' },
      { id: '3', title: RVDic.NDaysAgo.replace('[n]', 7), dateSpan: '7' },
      { id: '4', title: RVDic.NDaysAgo.replace('[n]', 30), dateSpan: '30' },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <Styled.CalendarHeaderContainer size={size}>
        <Styled.HeaderWrapper>
          <Styled.CalendarTitle>{headerTitle}</Styled.CalendarTitle>
          <Styled.RefreshIconWrapper onClick={onClear}>
            <RefreshIcon size={12} />
          </Styled.RefreshIconWrapper>
        </Styled.HeaderWrapper>
      </Styled.CalendarHeaderContainer>
      <Styled.FooterButtonsContainer>
        {footerButtonList?.map((footer) => {
          const isFooterActive = activeFooter === footer.dateSpan;
          return (
            <Button
              key={footer.id}
              data-span={footer.dateSpan}
              onClick={onFooterClick}
              type={isFooterActive ? 'primary' : 'primary-o'}
              style={{
                ...buttonsCommonStyles,
                backgroundColor: !isFooterActive && 'transparent',
              }}
            >
              {footer.title}
            </Button>
          );
        })}
      </Styled.FooterButtonsContainer>
    </>
  );
};

export default DatePickerFooter;

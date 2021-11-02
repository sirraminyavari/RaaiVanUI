import styled from 'styled-components';
import { C_GRAY_DARK, TC_DEFAULT } from 'constant/Colors';
import { CV_DISTANT, CV_GRAY, CV_WHITE, TCV_WARM } from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';
import { FLEX_CCC } from 'constant/StyledCommonCss';

const { RV_Float } = window;

export const MultiLevelContainer = styled.div`
  ${FLEX_CCC}
  gap: 0.2rem;
  width: 100%;
`;

export const SelectWrapper = styled.div`
  width: 100%;
`;

export const SelectLabel = styled.label.attrs({
  className: `${TC_DEFAULT}`,
})`
  width: auto;
  display: inline-block;
  margin: 0.5rem 0;
  font-size: 1rem;
`;

export const EmptyCellView = styled.div`
  color: ${CV_DISTANT};
  width: 100%;
  text-align: start;
  padding-${RV_Float}: 0.7rem;
`;

export const CellView = styled(Heading).attrs({
  className: `${C_GRAY_DARK}`,
})`
  text-align: justify;
  text-justify: inter-word;
`;

export const customStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: CV_WHITE,
    backgroundColor: CV_WHITE,
    minWidth: '10rem',
  }),
  option: (styles, { isSelected }) => ({
    ...styles,
    color: isSelected ? TCV_WARM : CV_GRAY,
    backgroundColor: CV_WHITE,
    fontWeight: isSelected ? '500' : '',
    cursor: 'pointer',
    minWidth: '10rem',
    height: '100%',
    textAlign: RV_Float,
  }),
  singleValue: (styles) => {
    return {
      ...styles,
      padding: '0.3rem',
      minWidth: '10rem',
      textAlign: RV_Float,
    };
  },
  menu: (provided) => ({
    ...provided,
    borderColor: CV_DISTANT,
    minWidth: '10rem',
  }),
};

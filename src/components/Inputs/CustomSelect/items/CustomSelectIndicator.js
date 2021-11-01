import styled from 'styled-components';
import { components } from 'react-select';
import ArrowHead from '../../../Icons/ArrowIcons/ArrowHead';

const IndicatorIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5rem;
  width: 1.5rem;
  background-color: var(--rv-gray-color-light);
  color: var(--rv-color);
  line-height: 1.5rem;
  border-radius: 100%;
`;

const CustomSelectIndicator = (props) => {
  const { isFocused } = props;
  return (
    <components.DropdownIndicator {...props}>
      <IndicatorIcon>
        <ArrowHead dir={isFocused ? 'up' : 'down'} />
      </IndicatorIcon>
    </components.DropdownIndicator>
  );
};
export default CustomSelectIndicator;

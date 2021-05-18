import PropTypes from 'prop-types';
import * as Styled from './Select.styles';

const Select = (props) => {
  const {
    options,
    defaulyOption,
    name,
    selectedOption,
    selectStyles,
    optionStyles,
  } = props;

  return (
    <Styled.Select name={name} style={selectStyles}>
      <Styled.Option value="" style={optionStyles}>
        {defaulyOption}
      </Styled.Option>
      {options.map((option, index) => {
        return (
          <Styled.Option
            style={optionStyles}
            key={index}
            selected={index === selectedOption ? true : false}
            value={option.value}>
            {option.title}
          </Styled.Option>
        );
      })}
    </Styled.Select>
  );
};

Select.propTypes = {
  options: PropTypes.array.isRequired,
  defaulyOption: PropTypes.string,
  name: PropTypes.string,
  selectedOption: PropTypes.number,
  selectStyles: PropTypes.object,
  optionStyles: PropTypes.object,
};

Select.defaultProps = {
  name: 'select',
};

Select.displayName = 'SelectComponent';

export default Select;

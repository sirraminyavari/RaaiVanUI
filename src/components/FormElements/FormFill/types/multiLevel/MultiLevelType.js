/**
 * Renders multi-level fill form.
 */
import { memo } from 'react';
import Button from 'components/Buttons/Button';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import * as Styled from './MultiLevelType.styles';

const MultiLevelType = (props) => {
  const { onConfirm, levels, onChange } = props;

  //! If true, Enables the confirm button.
  const isCompleted = levels.every((item) => item?.selected !== null);

  //! Calls on input change.
  const handleChange = (option, index) => {
    onChange && onChange({ selectedOption: option, levelIndex: index });
  };

  const handleOnConfirm = () => {
    if (isCompleted) {
      onConfirm(levels);
    }
  };

  return (
    <div>
      {levels?.map((level, index) => {
        const options = level?.options;

        const isShown = !!options.length;

        const defaultValue = !!level?.selected ? level?.selected : null;

        return (
          <Styled.SelectWrapper key={index} isShown={isShown}>
            <CustomSelect
              defaultValue={defaultValue}
              placeholder="انتخاب کنید"
              selectOptions={options}
              onChange={(opt) => handleChange(opt, index)}
            />
          </Styled.SelectWrapper>
        );
      })}
      <Button onClick={handleOnConfirm} disable={!isCompleted}>
        تایید
      </Button>
    </div>
  );
};

export default memo(MultiLevelType);

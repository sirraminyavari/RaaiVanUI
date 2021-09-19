/**
 * Renders multi-level fill form.
 */
import { memo } from 'react';
import Button from 'components/Buttons/Button';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import * as Styled from './MultiLevelType.styles';

/**
 * @typedef optionType
 * @type {Object}
 * @property {string} label -The label for option.
 * @property {string} value -The value for option.
 */

/**
 * @typedef LevelType
 * @type {Object}
 * @property {number} id -The id of the level.
 * @property {string} name -The name of the level.
 * @property {(string | null)} nextLevelName - The name of the next level.
 * @property {(string | null)} prevLevelName - The name of the previous level.
 * @property {optionType[]} options - The options for current level.
 * @property {(optionType | null)} selected - The options for current level.
 */

/**
 * @typedef PropType
 * @type {Object}
 * @property {function} onConfirm - Calls on confirm button click.
 * @property {function} onChange - Calls on level value chnage.
 * @property {LevelType[]} levels - The color of Avatar.
 */

/**
 *  @description Renders a fill multi level.
 * @component
 * @param {PropType} props -Props that pass to component.
 */
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

/**
 * Renders multi-level fill form.
 */
import { memo } from 'react';
import Button from 'components/Buttons/Button';
import * as Styled from './MultiLevelType.styles';
import useWindow from 'hooks/useWindowContext';
import SelectInputField from '../Select/SelectInputField';

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
 * @property {function} onChange - Calls on level value change.
 * @property {LevelType[]} levels - The color of Avatar.
 */

/**
 *  @description Renders a fill multi level.
 * @component
 * @param {PropType} props -Props that pass to component.
 */
const MultiLevelType = ({ onConfirm, levels, onChange }) => {
  const { RVDic } = useWindow();

  //! RVDic i18n variables
  const RVDicConfirm = RVDic.Confirm;

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
            <SelectInputField
              options={options}
              isEditable
              isFocused
              selectedValue={defaultValue}
              onChange={(opt) => handleChange(opt, index)}
            />
          </Styled.SelectWrapper>
        );
      })}
      <Button onClick={handleOnConfirm} disable={!isCompleted}>
        {RVDicConfirm}
      </Button>
    </div>
  );
};
MultiLevelType.displayName = 'MultiLevelType';

export default memo(MultiLevelType);

import Select from '../../../Inputs/select/Select';

/**
 * @typedef PropType
 * @type {Object}
 * @property {array} options - An array of options for select.
 * @property {string} name - Name of the select group.
 * @property {number} selectedOption - Index of option that is selected by default.
 * @property {function} onSelect - A callback function that fires on item select.
 */

/**
 *  @description Renders an 'OrAnd' select component.
 * @component
 * @param {PropType} props -Props that pass to select.
 */
const OrAndSelect = (props) => {
  const { options, name, selectedOption, onSelect } = props;

  const handleOnSelect = (selectedValue) => {
    onSelect && onSelect(selectedValue);
  };

  return (
    <div onChange={handleOnSelect} style={{ width: '100%' }}>
      <Select options={options} name={name} selectedOption={selectedOption} />
    </div>
  );
};

export default OrAndSelect;

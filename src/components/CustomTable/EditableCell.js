import { useEffect, useState } from 'react';
import Input from 'components/Inputs/Input';

//! Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateCellData, //! This is a custom function that we supplied to our table instance
  editable,
}) => {
  //! We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  //! We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateCellData(index, id, value);
  };

  //! If the initialValue is changed externall, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!editable) {
    return `${initialValue}`;
  }

  return (
    <div>
      <Input
        style={{
          textAlign: 'center',
          width: '100%',
          backgroundColor: 'inherit',
        }}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default EditableCell;

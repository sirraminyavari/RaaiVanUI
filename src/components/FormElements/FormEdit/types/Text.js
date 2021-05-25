import Input from '../../../Inputs/Input';

const TextType = (props) => {
  const handleOnChange = (e) => {
    props.onChange(e.target.value);
  };

  return (
    <div>
      <Input onChange={handleOnChange} />
    </div>
  );
};

export default TextType;

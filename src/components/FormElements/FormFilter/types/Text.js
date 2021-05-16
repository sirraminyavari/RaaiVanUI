import Input from '../../../Inputs/Input';

const TextType = (props) => {
  const { onChange, data } = props;
  console.log(data);

  const handleOnChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <Input onChange={handleOnChange} />
    </div>
  );
};

export default TextType;

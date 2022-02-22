import { Container } from './SelectObjectStyle';
import SelectObjectDropDown from './SelectObjectDropDown';

const SelectObject = ({ type }) => {
  return (
    <Container>
      <SelectObjectDropDown {...{ type }} />
    </Container>
  );
};
export default SelectObject;

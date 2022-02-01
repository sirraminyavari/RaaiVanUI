import { components } from 'react-select';

//this component only adds 'rv-input' to the class list
const DefaultSelectControl = (props) => {
  return <components.Control className="rv-input" {...props} />;
};
export default DefaultSelectControl;

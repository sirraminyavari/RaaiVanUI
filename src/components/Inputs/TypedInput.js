import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const TypedInput = ({ params, option }) => {
  const node = useRef();

  const { GlobalUtilities } = window;

  useEffect(() => {
    GlobalUtilities._append_typed_input(node.current, params, option);
  }, []);

  return <div ref={node}></div>;
};

TypedInput.propTypes = {
  option: PropTypes.exact({
    Number: PropTypes.bool,
    AlphaNumeric: PropTypes.bool,
  }),
  params: PropTypes.exact({
    Float: PropTypes.bool,
    Style: PropTypes.string,
    InnerTitle: PropTypes.string,
    MaxLength: PropTypes.number,
    OnEscape: PropTypes.func,
  }),
};

export default TypedInput;

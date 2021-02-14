import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const EditableTitle = ({ params }) => {
  const node = useRef();

  const { GlobalUtilities } = window;

  useEffect(() => {
    GlobalUtilities.append_editable_title(node.current, params);
  }, []);

  return <div ref={node}></div>;
};

EditableTitle.propTypes = {
  params: PropTypes.exact({
    Editable: PropTypes.bool,
    Title: PropTypes.string,
    Input: PropTypes.exact({
      Style: PropTypes.string,
      Placeholder: PropTypes.string,
    }),
    Container: PropTypes.exact({
      Class: PropTypes.string,
      Style: PropTypes.string,
    }),
    Save: PropTypes.func,
  }),
};

export default EditableTitle;

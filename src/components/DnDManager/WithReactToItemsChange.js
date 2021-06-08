import React from 'react';
import hash from 'object-hash';

const withReactToItemsChange = (Component) => (props) => (
  <Component key={hash(props.items)} {...props} />
);

export default withReactToItemsChange;

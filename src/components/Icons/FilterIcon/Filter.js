import { memo } from 'react';
import { FaFilter } from 'react-icons/fa';

const FilterIcon = (props) => {
  return <FaFilter {...props} />;
};

export default memo(FilterIcon);

import { Fragment } from 'react';
import ArrowIcon from 'components/Icons/ArrowIcons/DoubleArrow';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { decodeBase64 } from 'helpers/helpers';

const MultiLevel = (props) => {
  const { items, levels, onItemRemove } = props;

  const handleRemoveItem = (item) => {
    onItemRemove && onItemRemove(item);
  };

  return (
    <div>
      {items.map((item, key) => {
        return (
          <div
            key={key}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <CloseIcon
              color="red"
              style={{ cursor: 'pointer' }}
              onClick={() => handleRemoveItem(item)}
            />
            {levels.map((level, key) => {
              return (
                <Fragment key={key}>
                  <div style={{ margin: '10px' }}>
                    {level} : {decodeBase64(item[level].value.Name)}
                  </div>
                  {levels.length > key + 1 && <ArrowIcon dir="left" />}
                </Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MultiLevel;

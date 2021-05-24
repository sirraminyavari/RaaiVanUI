import ArrowIcon from 'components/Icons/ArrowIcons/DoubleArrow';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

const MultiLevel = (props) => {
  const { items, levels } = props;

  const onCloseClick = (index) => {
    console.log(index);
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
              onClick={() => onCloseClick(key)}
            />
            {levels.map((level, key) => {
              return (
                <>
                  <div key={key} style={{ margin: '10px' }}>
                    {level} : {item[level]}
                  </div>
                  {levels.length > key + 1 && <ArrowIcon dir="left" />}
                </>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MultiLevel;

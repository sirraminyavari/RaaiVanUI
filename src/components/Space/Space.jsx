const Space = ({ children, space = '.5rem', style }) => {
  const count = children.length;
  return (
    <div style={style}>
      {children.map((element, i) => {
        return (
          <span
            style={{
              display: 'inline',
              marginInlineEnd: count - 1 !== i ? space : '0',
            }}
          >
            {element}
          </span>
        );
      })}
    </div>
  );
};

export default Space;

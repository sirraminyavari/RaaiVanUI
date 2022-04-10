import useScript from 'hooks/useScript';

const ErrorView = (props) => {
  useScript('pageLoadScripts/LoadError/LoadError.js', 'LoadError.js', () => {
    window.loadError(props.route);
  });
  return (
    <div
      className="small-12 medium-12 large-12"
      style={{ width: '100vw', height: '100vh' }}
    >
      <div style={{ display: 'table', width: '100%', height: '100%' }}>
        <div
          id="errorArea"
          style={{
            display: 'table-cell',
            verticalAlign: 'middle',
            textAlign: 'center',
          }}
        ></div>
      </div>
    </div>
  );
};

export default ErrorView;

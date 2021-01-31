import { Link } from 'react-router-dom';

const miniSide = [
  'home',
  'bell',
  'edit',
  'trash',
  'bitcoin',
  'dollar',
  'refresh',
  'snowflake-o',
  'space-shuttle',
  'pie-chart',
  'paper-plane',
];

const CloseContent = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        height: '70vh',
        marginRight: '-2px',
      }}>
      <i
        class="fa fa-angle-up"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          fontSize: '40px',
        }}
      />
      <div
        style={{
          height: '90%',
          overflow: 'hidden',
          position: 'relative',
          left: '-3px',
        }}>
        <div
          style={{
            height: '100%',
            overflowY: 'scroll',
            position: 'absolute',
            padding: '0 5px',
            top: 0,
            left: -20,
            boxSizing: 'content-box',
            textAlign: 'center',
          }}>
          {miniSide.map((icon, key) => {
            return (
              <Link to="#">
                <i
                  key={key}
                  class={`fa fa-${icon}`}
                  aria-hidden="true"
                  style={{
                    margin: '30px 0',
                    display: 'block',
                    fontSize: '18px',
                    color: '#fff',
                  }}
                />
              </Link>
            );
          })}
        </div>
      </div>
      <i
        class="fa fa-angle-down"
        aria-hidden="true"
        style={{ position: 'absolute', bottom: 0, fontSize: '40px' }}
      />
    </div>
  );
};

export default CloseContent;

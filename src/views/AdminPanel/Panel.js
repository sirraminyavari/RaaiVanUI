import { Link } from 'react-router-dom';

const Panel = ({ panel }) => {
  const { Name, URL, Icon } = panel;
  return (
    <div className="small-12 medium-4 large-3" style={{ padding: '0.1rem' }}>
      <Link to={`/configuration/${URL}`}>
        <div
          className="small-12 medium-12 large-12 rv-border-radius-half rv-air-button"
          style={{ padding: '0.5rem', height: '100%' }}>
          <div
            className="small-12 medium-12 large-12"
            style={{
              display: 'flex',
              flexFlow: 'column',
              placeItems: 'center',
              textAlign: 'center',
            }}>
            <div id="image" className="small-12 medium-12 large-12">
              <img
                style={{ width: '6rem', height: '6rem' }}
                src={`${process.env.PUBLIC_URL}/images/icons/${Icon}`}
                alt="panel-icon"
              />
            </div>
            <div
              className="small-12 medium-12 large-12"
              style={{
                fontSize: '1.2rem',
                marginTop: '1rem',
                textTransform: 'capitalize',
              }}>
              <span>
                {window.RVDic.PRVC[Name] || window.RVDic[Name] || Name}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Panel;

import useScript from 'hooks/useScript';

const Dashboard = () => {
  useScript(
    'pageLoadScripts/LoadDashboard/LoadDashboard.js',
    'LoadDashboard.js',
    () => {
      window.loadDashboard();
    }
  );
  return (
    <div
      id="contentArea"
      className="small-12 medium-12 large-12 row"
      style={{ margin: '0rem 0rem 5rem 0rem', padding: '0vw 8vw', paddingTop: '1rem' }}
    ></div>
  );
};

export default Dashboard;

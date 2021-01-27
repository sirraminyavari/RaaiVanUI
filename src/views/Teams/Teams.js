import useScript from 'hooks/useScript';

const Teams = () => {
  useScript(
    'pageLoadScripts/LoadApplications/LoadApplications.js',
    'LoadApplications.js',
    () => {
      window.loadApplications();
    }
  );

  return (
    <>
      <div
        id="appsArea"
        className="small-12 medium-12 large-12 row"
        style={{ margin: '0rem 0rem 5rem 0rem', padding: '0vw 8vw' }}></div>
    </>
  );
};

export default Teams;

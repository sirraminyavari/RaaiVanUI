import useScript from 'hooks/useScript';

const Polls = () => {
  useScript('pageLoadScripts/LoadPolls/LoadPolls.js', 'LoadPolls.js', () => {
    window.loadPolls();
  });
  return (
    <div
      id="pollsArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{ margin: '0rem', padding: '0vw 6vw', paddingTop: '1rem' }}
    ></div>
  );
};

export default Polls;

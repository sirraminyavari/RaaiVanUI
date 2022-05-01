import useScript from 'hooks/useScript';

const Notifications = () => {
  useScript(
    'pageLoadScripts/LoadNotifications/LoadNotifications.js',
    'LoadNotifications.js',
    () => {
      window.loadNotifications();
    }
  );
  return (
    <div
      id="notmsgAdmin"
      className="small-12 medium-12 large-12 row"
      style={{
        margin: '0rem',
        marginBottom: '5rem',
        padding: '0vw 6vw',
        paddingTop: '1rem'
      }}
    ></div>
  );
};

export default Notifications;

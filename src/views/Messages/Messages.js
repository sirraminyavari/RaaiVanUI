import useScript from 'hooks/useScript';

const Messages = () => {
  useScript(
    'pageLoadScripts/LoadMessages/LoadMessages.js',
    'LoadMessages.js',
    () => {
      window.loadMessages();
    }
  );
  return (
    <div
      id="messagesArea"
      className="small-12 medium-12 large-12 row"
      style={{ margin: '1rem 0rem 5rem 0rem', padding: '0vw 10vw' }}
    ></div>
  );
};

export default Messages;

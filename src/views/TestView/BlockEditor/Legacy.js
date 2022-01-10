import { useState, useEffect } from 'react';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

const Legacy = ({ nodeId }) => {
  const [loading, setLoading] = useState(false);
  const { GlobalUtilities } = window;

  const containerId = 'wikiContainer';

  useEffect(() => {
    setLoading(true);

    GlobalUtilities.load_files(['Wiki/WikiManager.js'], {
      OnLoad: () => setTimeout(() => showWiki(), 1000),
    });
  }, [nodeId]);

  const showWiki = () => {
    setLoading(false);

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (!nodeId)
      container.innerHTML =
        "<div style='text-align:center; font-weight:bold;" +
        "font-size:1.2rem; color:rgb(100, 100, 100); padding-top:3rem;'>Select an item</div>";
    else
      new window.WikiManager(container, {
        OwnerID: nodeId,
        OwnerType: 'Node',
        Downloadable: true,
      });
  };

  return (
    <>
      {loading && (
        <div>
          <LogoLoader />
        </div>
      )}
      {!loading && <div id={containerId} />}
    </>
  );
};

export default Legacy;

import { useSelector } from 'react-redux';
import Panel from './Panel';

const Configuration = () => {
  const panels = useSelector((state) => state.sidebarItems.configPanels);

  return (
    <div
      className="small-12 medium-12 large-12 row"
      style={{ margin: '0 0 3rem 0', padding: '0vw 4vw' }}
    >
      {panels?.map((panel, key) => {
        return <Panel panel={panel} key={key} />;
      })}
    </div>
  );
};

export default Configuration;

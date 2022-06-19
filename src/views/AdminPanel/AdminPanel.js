import { useSelector } from 'react-redux';
import { selectSidebar } from 'store/slice/sidebar/selectors';
import Panel from './Panel';

const Configuration = () => {
  const { configPanels: panels } = useSelector(selectSidebar);

  return (
    <div
      className="small-12 medium-12 large-12 row"
      style={{
        margin: '0rem 0 3rem 0',
        padding: '0vw 4vw',
        paddingTop: '1rem',
      }}
    >
      {panels?.map((panel, key) => {
        return <Panel panel={panel} key={key} />;
      })}
    </div>
  );
};

export default Configuration;

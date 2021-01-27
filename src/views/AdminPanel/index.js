import PanelList from './panelList';
import Panel from 'components/Panel';

const Configuration = () => {
  return (
    <div
      id="settingsArea"
      className="small-12 medium-12 large-12 row"
      style={{ margin: '0 0 3rem 0', padding: '0vw 4vw' }}>
      {PanelList.map((params, key) => {
        return <Panel params={params} key={key} />;
      })}
    </div>
  );
};

export default Configuration;

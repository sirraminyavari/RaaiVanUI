const MonitoringView = ({ route }) => {
  return (
    <div>
      <pre>{JSON.stringify(route, null, 2)}</pre>
    </div>
  );
};

export default MonitoringView;

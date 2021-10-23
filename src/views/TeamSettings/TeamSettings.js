const TeamSettings = (props) => {
  console.log(props);
  const teamId = props?.match?.params?.id;
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Team Settings View</h1>
      <h1>{`Team ID: ${teamId}`}</h1>
    </div>
  );
};

export default TeamSettings;

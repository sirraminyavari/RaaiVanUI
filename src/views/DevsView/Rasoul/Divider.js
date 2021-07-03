const Divider = ({ title }) => {
  return (
    <>
      <hr style={{ backgroundColor: '#333', padding: '0.2rem' }} />
      <div style={{ textAlign: 'center', fontSize: '2rem' }}>{title}</div>
    </>
  );
};

export default Divider;

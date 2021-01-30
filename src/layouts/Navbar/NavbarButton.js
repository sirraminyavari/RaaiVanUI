const NavbarButton = ({ label, icon, badge }) => {
  return (
    <div style={{ position: 'relative', padding: '0 10px', margin: '0 15px' }}>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <img src={icon} alt={`button-${label}`} />
          {badge && (
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '9px',
                backgroundColor: 'red',
                position: 'absolute',
                top: '10px',
                left: '5px',
                color: '#fff',
              }}>
              <span style={{ fontSize: '9px' }}>{badge}</span>
            </div>
          )}
        </div>
        <div style={{ color: '#fff' }}>
          <span>{label}</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: -4.9,
          right: 0,
          width: '100%',
          borderTop: '8px solid #fff',
          borderRadius: 4,
        }}></div>
    </div>
  );
};

export default NavbarButton;

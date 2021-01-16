const NotLogedInNav = () => {
  return (
    <div
      className="RevDirection RevTextAlign"
      style={{
        position: "absolute",
        display: "flex",
        top: 0,
        bottom: 0,
        [window.RV_RevFloat]: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="rv-air-button rv-circle SoftBorder"
          style={{
            borderWidth: "2px",
            borderColor: "white",
            fontSize: "1rem",
            padding: "0.3rem 1.5rem",
          }}
          onClick={() => alert("Show login dialog")}
        >
          <div>{window.RVDic.SystemLogin}</div>
        </div>
      </div>
    </div>
  );
};

export default NotLogedInNav;

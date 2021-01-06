const NotLogedInNav = () => {
  return (
    <div
      className="RevDirection RevTextAlign"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [window.RV_RevFloat]: "2rem",
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
        <span>{window.RVDic.SystemLogin}</span>
      </div>
    </div>
  );
};

export default NotLogedInNav;
const SidebarOption = (props) => {
  const { name, hide, onClickButton, fontSize, imageURL, icon, title } = props;
  const handleOnClick = () => {
    if (!onClickButton) return;
    onClickButton();
  };
  return (
    <div
      id={name}
      className="rv-border-radius-quarter rv-bg-color-white-softer SoftBorder"
      style={{
        position: "relative",
        height: "4rem",
        width: "4rem",
        textAlign: "center",
        paddingBottom: "1.5rem",
        margin: "0.25rem 0.5rem",
        cursor: "pointer",
        borderColor: "rgb(200,200,200)",
        color: "rgb(100,100,100)",
        display: `${hide ? "none" : "inline-block"}`,
      }}
      onClick={handleOnClick}
    >
      <div
        className="small-12 medium-12 large-12"
        style={{ height: "100%", paddingTop: "0.3rem" }}
      >
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            placeItems: "center",
            fontSize: `${fontSize}rem`,
          }}
        >
          {imageURL && (
            <img
              className="rv-circle"
              style={{ width: "2rem", height: "2rem" }}
            />
          )}
          {icon && (
            <i
              className={`fa ${icon} fa-2x rv-icon-button`}
              style={{ marginTop: "0.1rem" }}
              aria-hidden={true}
            ></i>
          )}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "0.3rem",
          left: 0,
          right: 0,
          height: "1rem",
          fontSize: "0.7rem",
        }}
      >
      <span>{title}</span>
      </div>
    </div>
  );
};

export default SidebarOption;

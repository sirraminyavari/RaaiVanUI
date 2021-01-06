import ClassNames from "classnames";

const CustomButton = (props) => {
  const {
    name,
    imageURL,
    onClickButton,
    dontHide,
    hideForLarge,
    fontSize,
    icon,
    isMenu,
    title,
    hasAppId,
  } = props;

  const ButtonClass = ClassNames(
    "Direction TextAlign rv-bg-color-trans-white-opaque",
    {
      [dontHide ? "" : "show-for-large"]: hasAppId,
      [hideForLarge ? "hide-for-large" : ""]: hasAppId,
    }
  );

  const handleOnClick = (e) => {
    if (!onClickButton) return;
    onClickButton();
  };

  return (
    <div
      className={ButtonClass}
      style={{ ...styles.button }}
      onClick={handleOnClick}
    >
      <div style={styles.buttonFirstChild}>
        <div style={{fontSize: fontSize || '1rem'}}>
          {imageURL && (
            <img
              className="rv-circle"
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
          )}
          {icon && (
            <i
              className={`fa ${icon} fa-lg`}
              aria-hidden={true}
            ></i>
          )}
        </div>
      </div>
      <div style={styles.buttonSecondChild}>
        <span>{title}</span>
        {isMenu && (
          <i
            className="fa fa-caret-down"
            style={{ marginRight: "0.3rem" }}
            aria-hidden={true}
          ></i>
        )}
      </div>
    </div>
  );
};

const styles = {
  button: {
    position: "relative",
    height: "100%",
    width: "4rem",
    textAlign: "center",
    paddingBottom: "1.5rem",
    color: "rgba(255,255,255,0.8)",
    cursor: "pointer",
    display: "inline-block",
  },
  buttonFirstChild: {
    position: "absolute",
    bottom: "1.4rem",
    left: 0,
    right: 0,
    height: "1.8rem",
  },
  buttonSecondChild: {
    position: "absolute",
    bottom: "0.3rem",
    left: 0,
    right: 0,
    height: "1rem",
    fontSize: "0.7rem",
  },
};

export default CustomButton;

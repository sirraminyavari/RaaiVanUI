import ClassNames from "classnames";
import styles from "./NavButtonStyle";

const CustomNavBtn = (props) => {
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
    onClickButton(e);
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


export default CustomNavBtn;
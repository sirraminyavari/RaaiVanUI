import { useState } from "react";
import Avatar from "components/Avatar";
import SearchIcon from "assets/icons/search.svg";
import SearchSelectedIcon from "assets/icons/search-selected.svg";

const NewNavbar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const handleWidth = () => {
    setIsFocused(!isFocused);
  };
  return (
    <div
      style={{
        backgroundColor: "#2B7BE4",
        height: "11%",
        overflow: "hidden",
        position: "fixed",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        top: 0,
        width: "calc(100% - 250px)",
        padding: "0 20px",
        zIndex: 1,
        boxShadow: "0px 3px 10px #333"
      }}
    >
      <div style={{ height: "100%", display: "flex" }}>
        <div style={{ position: "relative", padding: "0 10px" }}>
          <div>NavButton</div>
          <div
            style={{
              position: "absolute",
              bottom: -4.9,
              right: 0,
              width: "100%",
              borderTop: "8px solid #fff",
              borderRadius: 4
            }}
          ></div>
        </div>
        <div style={{ position: "relative", padding: "0 10px", margin: "0 5px" }}>
          <div>NavButton</div>
          <div
            style={{
              position: "absolute",
              bottom: -4.9,
              right: 0,
              width: "100%",
              borderTop: "8px solid #fff",
              borderRadius: 4
            }}
          ></div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "400px",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={isFocused ? SearchSelectedIcon : SearchIcon}
            style={{
              position: "absolute",
              left: 5,
              top: 5,
            }}
          />
          <input
            type="search"
            placeholder={
              isFocused ? "" : "جستجو در مطالب،کاربران،ابزارها و ..."
            }
            onFocus={handleWidth}
            onBlur={handleWidth}
            style={{
              border: "none",
              borderRadius: "5px",
              outline: 0,
              color: "#333",
              height: "32px",
              padding: "0 10px",
              width: isFocused ? 300 : 230,
              transition: "all 0.5s ease",
            }}
          />
        </div>
        <Avatar radius={40} />
      </div>
    </div>
  );
};

export default NewNavbar;

import MenuIcon from "assets/icons/menu.svg";
import FilterIcon from "assets/icons/filter.svg";
import EditIcon from "assets/icons/edit.svg";
import Logo from "assets/icons/logo.svg";

const NewSidebar = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "250px",
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        zIndex: 1,
        top: 0,
        right: 0,
        backgroundColor: "#033547",
        overflowX: "hidden",
        color: "#fff",
      }}
    >
      <div style={{ flexGrow: 1, padding: "0 20px", }}>
        <div style={{ display: "flex", justifyContent: "space-between", height: "14%" }}>
          <img src={Logo} width="100" alt="logo-icon" />
          <img
            src={MenuIcon}
            width="25"
            alt="menu-icon"
            style={{ cursor: "pointer" }}
          />
        </div>
        <div style={{ fontSize: 22, margin: "35px 0" }}>
          <span>تیم شاهین</span>
        </div>
        <div
          style={{
            display: "flex",
            placeItems: "center",
            borderBottom: "1px solid #707070",
          }}
        >
          <input
            type="search"
            placeholder="جستجو در دسته و کلاس ها"
            style={{
              width: "100%",
              backgroundColor: "inherit",
              color: "#fff",
              border: "none",
              outline: 0,
            }}
          />
          <img src={FilterIcon} style={{ color: "#707070" }} />
        </div>
      </div>
      <div>
        <div
          style={{
            backgroundColor: "#032E3D",
            height: "40px",
            lineHeight: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={EditIcon} />
          <span style={{ marginRight: "5px" }}>مدیریت دسته و کلاس ها</span>
        </div>
        <div
          style={{
            height: "55px",
            lineHeight: "55px",
            backgroundColor: "#2B7BE4",
          }}
        >
          <h3 style={{ margin: "0", textAlign: "center" }}>Footer</h3>
        </div>
      </div>
    </div>
  );
};

export default NewSidebar;

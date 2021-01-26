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
        paddingTop: "10px",
        color: "#ddd",
      }}
    >
      <div style={{ flexGrow: 1, padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4>Logo</h4>
          <h4>Button</h4>
        </div>
        <h3>تیم شاهین</h3>
        <input
          type="search"
          placeholder="جستجو در دسته و کلاس ها"
          style={{ width: "100%" }}
        ></input>
      </div>
      <div>
        <div
          style={{
            backgroundColor: "#032E3D",
            height: "40px",
            lineHeight: "40px",
          }}
        >
          <h5 style={{ margin: "0", textAlign: "center" }}>
            مدیریت دسته و کلاس ها
          </h5>
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

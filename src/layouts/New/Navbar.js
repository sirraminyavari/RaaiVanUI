import Avatar from "components/Avatar";

const NewNavbar = () => {
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
      }}
    >
      <div>Nav Buttons</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "400px",
        }}
      >
        <div>
          <input
            type="search"
            style={{ border: "none", borderRadius: "5px", outline: 0, height: "32px", width: "250px", padding: "0 10px" }}
          />
        </div>
        <Avatar radius={45} />
      </div>
    </div>
  );
};

export default NewNavbar;

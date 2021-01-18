const Exception = ({message}) => {
  return (
    <div style={{ width: "100vw", height: "calc(100vh - 8rem)" }}>
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <img src={window.RVGlobal.LogoURL} style={{ maxWidth: "20rem" }} />
        </div>
        <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "blue" }}>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Exception;

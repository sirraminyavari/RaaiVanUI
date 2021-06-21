const SelectedTemplatesBox = ({
  zIndex,
  translateX,
  translateY,
  showContent,
}) => {
  return (
    <div
      className="selected-box"
      style={{ zIndex, transform: `translate(${translateX}, ${translateY})` }}>
      {showContent && <div></div>}
    </div>
  );
};
export default SelectedTemplatesBox;

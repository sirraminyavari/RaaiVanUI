import UserIcon from "assets/icons/user.svg";

const Avatar = (props) => {
  const { radius, image } = props;
  return (
    <div
      style={{
        width: radius,
        height: radius,
        borderRadius: radius,
        padding: 0,
        marginRight: 15,
        position: "relative",
        overflow: "hidden",
        border: "2px solid #fff",
      }}
    >
      <img
        src={image ? image : UserIcon}
        width="100%"
        style={{ position: "absolute", top: 0 }}
      />
    </div>
  );
};

export default Avatar;

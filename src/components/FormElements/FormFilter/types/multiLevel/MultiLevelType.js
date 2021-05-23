const MultiLevelType = (props) => {
  const { onChange, data } = props;
  return <div>لطفا {data.Info.NodeType.Name} را انتخاب کنید</div>;
};

export default MultiLevelType;

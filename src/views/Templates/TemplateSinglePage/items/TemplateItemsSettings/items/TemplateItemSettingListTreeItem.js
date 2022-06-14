const TemplateItemSettingListTreeItem = ({ provided, ...rest }) => {
  console.log('item props object: ', rest);
  return (
    <div ref={provided?.innerRef} {...provided.draggableProps}>
      <div>item</div>
    </div>
  );
};

export default TemplateItemSettingListTreeItem;

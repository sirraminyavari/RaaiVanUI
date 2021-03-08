const { AdvancedTextArea, GlobalUtilities, Base64, JSON, RVAPI } = window;

const isImage = (fileExtension) =>
  ['jpg', 'png', 'gif', 'jpeg'].some((ext) => fileExtension == ext);

const InsertTag = (editor, tag) => {
  const _ext = tag.Info.Extension.toString().toLowerCase();
  let html = '';

  if (isImage(_ext)) {
    tag.Info = GlobalUtilities.extend({}, tag.Info);

    html =
      '<img style="max-width:100%;' +
      (tag.Info.W ? 'width:' + tag.Info.W + 'px;' : '') +
      (tag.Info.H ? 'height:' + tag.Info.H + 'px;' : '') +
      '" ' +
      'data-RV_TagID="' +
      tag.ID +
      '" ' +
      'data-RV_TagType="' +
      tag.Type +
      '" ' +
      'data-RV_TagValue="' +
      tag.Value +
      '" ' +
      'data-RV_TagInfo="' +
      Base64.encode(JSON.stringify(tag.Info)) +
      '" ' +
      'src="' +
      RVAPI.DownloadURL({ FileID: tag.ID || '' }) +
      '"/><span>&nbsp;</span>';
  } else {
    html =
      '<a data-RV_TagID="' +
      tag.ID +
      '" ' +
      'data-RV_TagType="' +
      tag.Type +
      '" ' +
      'data-RV_TagValue="' +
      tag.Value +
      '" ' +
      'data-RV_TagInfo="' +
      Base64.encode(JSON.stringify(tag.Info)) +
      '" ' +
      'href="' +
      AdvancedTextArea.get_url(tag) +
      '" ' +
      '>' +
      Base64.decode(tag.Value) +
      '</a><span>&nbsp;</span>';
  }

  const viewFragment = editor.data.processor.toView(html);
  const modelFragment = editor.data.toModel(viewFragment);
  editor.model.insertContent(modelFragment);
};

export default InsertTag;

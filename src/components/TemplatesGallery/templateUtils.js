import { decodeBase64 } from 'helpers/helpers';

export const parseTemplates = (data) => {
  data = data || {};

  let tags = data.Tags || [],
    templateTags = data.TemplateTags || [],
    templates = data.Templates || [];

  tags.forEach((tg) => {
    tg.Templates = Object.keys(templateTags)
      .map((key) => ({
        TemplateID: key,
        TagIDs: templateTags[key] || [],
      }))
      .filter((x) => {
        return (
          x.TagIDs.some((tId) => tId === tg.NodeID) &&
          templates.some((t) => t.NodeTypeID === x.TemplateID)
        );
      })
      .map((x) => templates.filter((t) => t.NodeTypeID === x.TemplateID)[0]);
  });

  templates.forEach((tmp) => {
    tmp.Tags = !templateTags[tmp.NodeTypeID]
      ? []
      : templateTags[tmp.NodeTypeID]
          .map((id) => tags.filter((tg) => tg.NodeID === id))
          .map((arr) => (!arr.length ? null : arr[0]))
          .filter((tg) => !!tg);
  });

  return {
    Tags: tags.filter((t) => (t.Templates || []).length),
    TemplatesWithoutTag: templates.filter(
      (tmp) =>
        !tags.some((tg) =>
          tg.Templates.some((tt) => tt.NodeTypeID === tmp.NodeTypeID)
        )
    ),
    AllTemplates: templates,
  };
};

export const provideTemplatesForTree = (data) => {
  const parsedTemplates = parseTemplates(data);
  const {
    AllTemplates,
    //  Tags,
    //   TemplatesWithoutTag
  } = parsedTemplates || {};

  //   console.log(parsedTemplates);

  //! Root id for tree (It is required by documentation).
  const rootId = `templates-${data?.AppID || 'list'}`;

  //! Provide category ids.
  const parentIds = AllTemplates?.filter(
    //! Filter out template without tag.
    (template) => !!template?.Tags.length
  )?.map((template) => template?.NodeTypeID);

  //!Get excluded other templates.
  //   const excludedCategory = AllTemplates?.find((temp) => !temp?.Tags.length);

  //! provide categories for tree.
  const templateCategories = parsedTemplates?.AllTemplates?.reduce(
    (acc, currentValue) => {
      const { NodeTypeID: id, TypeName: title, IconURL, Tags } = currentValue;
      const categoryChildrenIds = Tags?.map((tag) => tag?.NodeID);

      const treeObj = {
        id,
        children: categoryChildrenIds,
        hasChildren: !!Tags.length,
        isCategory: !!Tags.length,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          title: decodeBase64(title),
          description: 'Category Description',
          iconURL: IconURL,
          tags: Tags,
          rawData: currentValue,
        },
      };

      return { ...acc, [id]: treeObj };
    },
    {}
  );

  //! provide children for tree.
  const templateChildren = parsedTemplates?.Tags?.reduce(
    (acc, currentValue) => {
      const {
        NodeID: id,
        Name: title,
        //  Templates
      } = currentValue;

      const treeObj = {
        id,
        children: [],
        hasChildren: false,
        isCategory: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          title: decodeBase64(title),
          description: 'Template Description',
          rawData: currentValue,
        },
      };

      return { ...acc, [id]: treeObj };
    },
    {}
  );

  const templatesForTree = {
    rootId,
    items: {
      [rootId]: {
        id: rootId,
        children: parentIds,
        hasChildren: true,
        isCategory: true,
        isExpanded: true,
        isChildrenLoading: false,
        data: {
          title: 'Templates Tree',
        },
      },
      ...templateCategories,
      ...templateChildren,
    },
  };

  return templatesForTree;
};

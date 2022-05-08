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
    tmp.IsDefaultTemplate = (data.DefaultTemplateIDs || []).some(
      (id) => id === tmp.NodeTypeID
    );

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
  const { AllTemplates, Tags, TemplatesWithoutTag } = parsedTemplates || {};

  // console.log(parsedTemplates);

  //! Root id for tree (It is required by documentation).
  const rootId = `templates-${data?.AppID || 'list'}`;

  //! Provide category ids.
  const parentIds = Tags?.map((tag) => tag?.NodeID);

  if (!!TemplatesWithoutTag.length) {
    parentIds.push(`other-templates-${data?.AppID}`);
  }

  //!Get excluded other templates.
  //   const excludedCategory = AllTemplates?.find((temp) => !temp?.Tags.length);

  //! provide categories for tree.
  const templateCategories = Tags?.reduce((acc, currentValue) => {
    const { NodeID: id, Name: title, Templates } = currentValue;
    const categoryChildrenIds = Templates?.map((temp) => temp?.NodeTypeID);

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
        rawData: currentValue,
      },
    };

    return { ...acc, [id]: treeObj };
  }, {});

  const otherCategoryChildrenIds = TemplatesWithoutTag?.map(
    (temp) => temp?.NodeTypeID
  );

  //! provide categories without tags.
  const otherCategory = {
    [`other-templates-${data?.AppID}`]: {
      id: `other-templates-${data?.AppID}`,
      children: otherCategoryChildrenIds,
      hasChildren: !!TemplatesWithoutTag.length,
      isCategory: true,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: 'سایر',
        description: 'Other Categories Description',
        rawData: TemplatesWithoutTag,
      },
    },
  };

  //! provide children for tree.
  const templates = AllTemplates?.reduce((acc, currentValue) => {
    const { NodeTypeID: id, TypeName: title, Tags } = currentValue;

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
  }, {});

  //! provide children for tree.
  const templatesWithoutTags = TemplatesWithoutTag?.reduce(
    (acc, currentValue) => {
      const { NodeTypeID: id, TypeName: title, Tags } = currentValue;

      const treeObj = {
        id,
        children: [],
        hasChildren: false,
        isCategory: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          title: decodeBase64(title),
          description: 'Template without tag Description',
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
      ...otherCategory,
      ...templates,
      ...templatesWithoutTags,
    },
  };

  return templatesForTree;
};

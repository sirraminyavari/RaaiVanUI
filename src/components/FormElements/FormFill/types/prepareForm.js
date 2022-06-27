import { encodeBase64 } from 'helpers/helpers';

const prepareForm = (prevForm, elementId, event, type) => {
  const { Elements } = prevForm || {};

  const requireItems = (x) => {
    console.log(x?.RefElementID, x?.ElementID ? true : false, 'Filled');
    return {
      Type: x?.Type,
      ElementID: x?.ElementID,
      RefElementID: x?.RefElementID,
      InstanceID: x?.InstanceID,
      Info: x?.Info,
      Title: x?.Title,
      Filled: x?.RefElementID && x?.ElementID ? true : false,
    };
  };
  switch (type) {
    case 'User':
      console.log(event, 'event user select');
      const result = {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...requireItems(x),
                GuidItems: event.multiSelect
                  ? x?.SelectedItems.find((z) => z.ID === event?.id)
                    ? x?.SelectedItems.filter((z) => z.ID !== event?.id)
                    : [
                        ...x?.SelectedItems,
                        {
                          ID: event?.id,
                          Code: '',
                          Name: event?.name,
                          IconURL: event?.avatarUrl,
                        },
                      ]
                  : x?.SelectedItems.find((z) => z.ID === event?.id)
                  ? []
                  : [
                      {
                        ID: event?.id,
                        Code: '',
                        Name: event?.name,
                        IconURL: event?.avatarUrl,
                      },
                    ],
                SelectedItems: event.multiSelect
                  ? x?.SelectedItems.find((z) => z.ID === event?.id)
                    ? x?.SelectedItems.filter((z) => z.ID !== event?.id)
                    : [
                        ...x?.SelectedItems,
                        {
                          ID: event?.id,
                          Code: '',
                          Name: event?.name,
                          IconURL: event?.avatarUrl,
                        },
                      ]
                  : x?.SelectedItems.find((z) => z.ID === event?.id)
                  ? []
                  : [
                      {
                        ID: event?.id,
                        Code: '',
                        Name: event?.name,
                        IconURL: event?.avatarUrl,
                      },
                    ],
              }
            : x
        ),
      };
      console.log(result, '********');

      return result;
    case 'MultiLevel':
      const multiLevel = {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...requireItems(x),
                GuidItems: event,
              }
            : x
        ),
      };
      return multiLevel;

    case 'Numeric':
      return {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...x,
                FloatValue: event,
              }
            : x
        ),
      };
    case 'Binary':
      Elements.filter((x) => x?.ElementID === elementId);
      return {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...x,
                TextValue: encodeBase64(event.label),
                BitValue: event.value,
              }
            : x
        ),
      };
    case 'Checkbox':
      return {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...x,
                TextValue:
                  event?.length > 0 ? event.map((x) => x.value).join('~') : '',
              }
            : x
        ),
      };
    case 'Select':
      return {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...x,
                TextValue: event?.value,
              }
            : x
        ),
      };
    case 'Text':
      return {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...requireItems(x),
                TextValue: event,
              }
            : x
        ),
      };
    case 'File':
      return {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...x,
                Files: event,
              }
            : x
        ),
      };
    case 'Node':
      const node = {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...requireItems(x),
                GuidItems: event,
              }
            : x
        ),
      };
      return node;
    default:
      return prevForm;
  }
};
export default prepareForm;

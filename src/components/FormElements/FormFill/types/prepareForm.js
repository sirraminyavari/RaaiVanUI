import { encodeBase64 } from 'helpers/helpers';
import { encode } from 'js-base64';

const prepareForm = (prevForm, elementId, event, type) => {
  const { Elements } = prevForm || {};

  const requireItems = (x) => {
    return {
      Type: x?.Type,
      ElementID: x?.ElementID,
      RefElementID: x?.RefElementID,
      InstanceID: x?.InstanceID,
      Info: x?.Info,
      Title: x?.Title,
    };
  };
  switch (type) {
    case 'User':
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
                        { ID: event?.id, Code: '', Name: event?.name },
                      ]
                  : x?.SelectedItems.find((z) => z.ID === event?.id)
                  ? []
                  : [{ ID: event?.id, Code: '', Name: event?.name }],
                SelectedItems: event.multiSelect
                  ? x?.SelectedItems.find((z) => z.ID === event?.id)
                    ? x?.SelectedItems.filter((z) => z.ID !== event?.id)
                    : [
                        ...x?.SelectedItems,
                        { ID: event?.id, Code: '', Name: event?.name },
                      ]
                  : x?.SelectedItems.find((z) => z.ID === event?.id)
                  ? []
                  : [{ ID: event?.id, Code: '', Name: event?.name }],
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
    default:
      return prevForm;
  }
};
export default prepareForm;

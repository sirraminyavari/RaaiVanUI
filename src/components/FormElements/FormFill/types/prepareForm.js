import { encodeBase64 } from 'helpers/helpers';
import { encode } from 'js-base64';

const prepareForm = (prevForm, elementId, event, type) => {
  console.log(prevForm, 'prevForm');
  console.log(elementId, 'elementId');
  console.log(type, 'type');
  console.log(event, 'event');
  const { Elements } = prevForm || {};

  switch (type) {
    case 'User':
      const result = {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...x,
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
      console.log(event, '#########********');

      const multiLevel = {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...x,
                GuidItems: event,
              }
            : x
        ),
      };
      console.log(multiLevel, 'multiLevel ***');
      return multiLevel;

    case 'Numeric':
      console.log(event, 'numeric***');
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
                ...x,
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

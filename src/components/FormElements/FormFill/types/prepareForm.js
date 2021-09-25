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
      return {
        ...prevForm,
        Elements: Elements?.map((x) =>
          x?.ElementID === elementId
            ? {
                ...x,
                SelectedItems: [
                  { ID: event?.id, Code: '', Name: encodeBase64(event?.name) },
                ],
              }
            : x
        ),
      };
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

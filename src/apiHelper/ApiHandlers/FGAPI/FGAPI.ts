import {
  API_NAME_FG_GET_FORM_ELEMENTS,
  API_NAME_FG_GET_FORM_INSTANCE,
  API_NAME_FG_INITIALIZE_OWNER_FORM_INSTANCE,
  API_NAME_FG_SAVE_FORM_ELEMENTS,
} from 'constant/api-names-fg';
import { FG_API } from 'constant/apiConstants';
import {
  API_Provider,
  decodeBase64,
  encodeBase64,
  extend,
} from 'helpers/helpers';
import { apiCallWrapper } from '../apiCallHelpers';

/**
 * @description gets the elements of a form
 * @param {string} FormID the id of the form
 */
export const getFormElements = ({
  FormID,
  OwnerID,
  Type,
  ConsiderElementLimits,
}) => {
  return apiCallWrapper(API_Provider(FG_API, API_NAME_FG_GET_FORM_ELEMENTS), {
    FormID,
    OwnerID,
    Type,
    ConsiderElementLimits,
  }).then((res: any) => ({
    FormName: decodeBase64(res?.FormName),
    FormDescription: decodeBase64(res?.FormDescription),
    Elements: (res?.Elements || []).map((e) => {
      const info = !e?.Info ? undefined : JSON.parse(decodeBase64(e.Info));

      return {
        ...e,
        Title: decodeBase64(e?.Title),
        Name: decodeBase64(e?.Name),
        Help: decodeBase64(e?.Help),
        Info: !info
          ? undefined
          : extend({}, info, {
              Options: !info.Options?.length
                ? undefined
                : info.Options.map((o) => decodeBase64(o)),
              Yes: !info.Yes ? undefined : decodeBase64(info.Yes),
              No: !info.No ? undefined : decodeBase64(info.No),
              NodeTypes: !(info.NodeTypes || []).length
                ? undefined
                : info.NodeTypes.map((nt) => ({
                    ...nt,
                    NodeType: decodeBase64(nt.NodeType),
                  })),
              FormName: !info.FormName
                ? undefined
                : decodeBase64(info.FormName),
              NodeType: !info.NodeType
                ? undefined
                : { ...info.NodeType, Name: decodeBase64(info.NodeType?.Name) },
              Levels: !info.Levels?.length
                ? undefined
                : info.Levels.map((l) => decodeBase64(l)),
            }),
      };
    }),
  }));
};

/**
 * @description saves the elements of a form
 * @param {string} FormID the id of the form
 * @param {string?} Name the name or unique code of the form
 * @param {object[]} Elements an array of all form elements
 */
export const saveFormElements = ({ FormID, Name, Description, Elements }) => {
  return apiCallWrapper(API_Provider(FG_API, API_NAME_FG_SAVE_FORM_ELEMENTS), {
    FormID,
    Name: encodeBase64(Name),
    Description: encodeBase64(Description),
    Elements: encodeBase64(
      JSON.stringify({
        Elements: (Elements || []).map((e) => ({
          ElementID: e.ElementID,
          Type: e.Type, //necessary
          Name: encodeBase64(e.Name), //optional
          Title: encodeBase64(e.Title), //necessary
          Info: !e.Info
            ? null
            : encodeBase64(
                JSON.stringify(
                  extend({}, e.Info || {}, {
                    Options: !e?.Info?.Options?.length
                      ? undefined
                      : e.Info.Options.map((o) => encodeBase64(o)),
                    Yes: !e?.Info?.Yes ? undefined : encodeBase64(e.Info.Yes),
                    No: !e?.Info?.No ? undefined : encodeBase64(e.Info.No),
                    NodeTypes: !e?.Info?.NodeTypes?.length
                      ? undefined
                      : e.Info.NodeTypes.map((nt) => ({
                          ...nt,
                          NodeType: encodeBase64(nt.NodeType),
                        })),
                    FormName: !e?.Info?.FormName
                      ? undefined
                      : encodeBase64(e.Info.FormName),
                    NodeType: !e?.Info?.NodeType
                      ? undefined
                      : {
                          ...e.Info.NodeType,
                          Name: encodeBase64(e.Info.NodeType?.Name),
                        },
                    Levels: !e?.Info?.Levels?.length
                      ? undefined
                      : e.Info.Levels.map((l) => encodeBase64(l)),
                  })
                )
              ),
          Help: encodeBase64(e.Help), //optional
          Necessary: e.Necessary, //default: false
          UniqueValue: e.UniqueValue, //default: false
          Weight: e.Weight, //default: null
        })),
      })
    ),
  });
};

/**
 *
 */

export const initializeOwnerFormInstance = ({ OwnerID }) => {
  return apiCallWrapper(
    API_Provider(FG_API, API_NAME_FG_INITIALIZE_OWNER_FORM_INSTANCE),
    { OwnerID }
  );
};
/**
 *
 */

export const getFormInstance = ({
  InstanceID,
  LimitOwnerID,
  ShowAllIfNoLimit,
}) => {
  return apiCallWrapper(API_Provider(FG_API, API_NAME_FG_GET_FORM_INSTANCE), {
    InstanceID,
    LimitOwnerID,
    ShowAllIfNoLimit,
  });
};

const customizedElements = {
  'short text': {
    Type: 'Text',
    Info: { UseSimpleEditor: true },
  },
  paragraph: {
    Type: 'Text',
    Info: { min: '[number]', max: '[number]' },
  },
  email: {
    Type: 'Text',
    Info: { UseSimpleEditor: true, PatternName: 'email' },
  },
  link: {
    Type: 'Text',
    Info: { UseSimpleEditor: true, PatternName: 'url' },
  },
  number: {
    Type: 'Numeric',
    Info: {
      min: '[number]',
      max: '[number]',
      PatternName: 'number | currency | nationalCode | postalCode | none',
      currency: 'IRT | IRR | USD | EUR | none',
      separator: true,
      percentage: true,
    },
  },
  'phone number': {
    Type: 'Text',
    Info: {
      UseSimpleEditor: true,
      PatternName: 'mobile | phone | phoneByNationalCode ',
    },
  },
  date: {
    Type: 'Date',
  },
  'single-select': {
    Type: 'Select',
    Info: {
      // Options: '[array of string items]',
      Items: [
        {
          text: '[string]',
          color: '[string]',
          min: '[number]',
          max: '[number]',
        },
      ],
      ViewType: 'sliding | optional',
      addOption: true,
    },
  },
  'multi-select': {
    Type: 'Checkbox',
    Info: {
      // Options: '[array of string items]',
      Items: [
        {
          text: '[string]',
          color: '[string]',
        },
      ],
      ViewType: 'sliding | optional',
      addOption: true,
    },
  },
  'two options': {
    Type: 'Binary',
    Info: { Yes: '[string]', No: '[string]' },
  },
  rating: {
    Type: 'Numeric',
    Info: {
      PatternName: 'rating',
      min: '[number]',
      max: '[number]',
      ViewType: 'numerical | stars',
    },
  },
  item: {
    Type: 'Node',
    Info: {
      NodeTypes: [{ NodeTypeID: '[string]', NodeType: '[string]' }], //array of node types
      MultiSelect: '[boolean]',
    },
  },
  user: {
    Type: 'User',
    Info: {
      MultiSelect: '[boolean]',
      GroupSelect: '[boolean]',
      GroupIDs: '[array of group ids]',
    },
  },
  file: {
    Type: 'File',
    Info: {
      MaxCount: '[integer]',
      MaxSize: '[integer]',
      TotalSize: '[integer]',
      ImageOnly: '[boolean]',
      AllowedExtensions: "array of strings. i.e. ['pdf', 'docx']",
    },
  },
  separator: {
    Type: 'Separator',
    Info: {
      SeparatorType: 'text | line | ...',
      SeparatorText: '[string]',
    },
  },
  table: {
    Type: 'Form',
    Info: { FormID: '[string]', FormName: '[string]' },
  },
  multilevel: {
    Type: 'MultiLevel',
    Info: {
      Template: '[string]', //Country_Province_City, University
      NodeType: { ID: '[string]', Name: '[string]' },
      Levels: 'array of string values',
    },
  },
};

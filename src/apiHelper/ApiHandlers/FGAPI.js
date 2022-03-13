import { API_NAME_FG_SAVE_FORM_ELEMENTS } from 'constant/api-names-fg';
import { FG_API } from 'constant/apiConstants';
import { API_Provider, encodeBase64, extend } from 'helpers/helpers';
import { apiCallWrapper } from './apiCallHelpers';

/**
 * @description saves the elements of a form
 * @param {string} FormID the id of the form
 * @param {string?} Name the name or unique code of the form
 * @param {object[]} Elements an array of all form elements
 */
export const saveFormElements = ({
  FormID,
  Name,
  Description,
  Elements,
} = {}) => {
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

const customizedElements = {
  'short text': {
    Type: 'Text',
    Info: { UseSimpleEditor: true },
  },
  paragraph: {
    Type: 'Text',
    Info: {},
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
    Info: { min: '[number]', max: '[number]' },
  },
  'phone number': {
    Type: 'Text',
    Info: { UseSimpleEditor: true, PatternName: 'mobile' },
  },
  date: {
    Type: 'Date',
  },
  'single-select': {
    Type: 'Select',
    Info: { Options: '[array of string items]' },
  },
  'multi-select': {
    Type: 'Checkbox',
    Info: { Options: '[array of string items]' },
  },
  'two options': {
    Type: 'Binary',
    Info: { Yes: '[string]', No: '[string]' },
  },
};

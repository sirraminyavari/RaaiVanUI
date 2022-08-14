import { cloneJsonObject, randomString } from 'helpers/helpers';
import { ILanguage, LanguageList } from './ILanguage';

export type IDictionaryEntryTranslations = {
  [language in ILanguage]: string;
};

export type IDictionaryEntry = {
  id?: string;
  translations: IDictionaryEntryTranslations;
};

export const EmptyDictionaryTranslations: IDictionaryEntryTranslations =
  LanguageList.reduce((dic, lang) => {
    dic[lang] = '';
    return dic;
  }, {}) as unknown as IDictionaryEntryTranslations;

export const randomDictionaryTranslations =
  (): IDictionaryEntryTranslations => {
    const value: IDictionaryEntryTranslations =
      cloneJsonObject<IDictionaryEntryTranslations>(
        EmptyDictionaryTranslations
      );
    Object.keys(value).forEach((k) => (value[k] = randomString(10)));
    return value;
  };

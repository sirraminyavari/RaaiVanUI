export const _languages = ['fa', 'en'] as const;

export type ILanguage = typeof _languages[number];

export const LanguageList: ILanguage[] = _languages as unknown as ILanguage[];

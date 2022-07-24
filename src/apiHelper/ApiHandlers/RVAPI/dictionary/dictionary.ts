import { RV_API } from 'constant/apiConstants';
import { API_Provider, random, randomString, range } from 'helpers/helpers';
import {
  EmptyDictionaryTranslations,
  IDictionaryEntry,
  randomDictionaryTranslations,
} from 'models/dictionary/IDictionaryEntry';
import { apiCallWrapper } from '../../apiCallHelpers';
import { IGetDictionaryEntriesResponse } from './types';

export const getDictionaryEntries = async ({
  Count = 50,
  LowerBoundary,
  SearchText,
}: {
  Count?: number;
  LowerBoundary?: number;
  SearchText?: string;
}): Promise<IGetDictionaryEntriesResponse> => {
  return {
    total: 1910,
    entries: range(Count).map(() => {
      return {
        id: randomString(10),
        translations: randomDictionaryTranslations(),
      };
    }),
  };
};

export const saveDictionaryEntry = async (data: IDictionaryEntry) => {
  return {
    Succeed: 'OperationCompletedSuccessfully',
    entry: { ...data, id: data.id || randomString(10) },
  };
};

export const removeDictionaryEntry = async ({ id }: { id: string }) => {
  return { Succeed: 'OperationCompletedSuccessfully' };
};

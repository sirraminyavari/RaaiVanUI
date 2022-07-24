import { IDictionaryEntry } from 'models/dictionary/IDictionaryEntry';

export interface IGetDictionaryEntriesResponse {
  total: number;
  entries: IDictionaryEntry[];
}

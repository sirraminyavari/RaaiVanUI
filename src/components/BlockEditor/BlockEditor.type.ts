export interface IGetWikiBlock {
  AppID: string;
  LegacyWiki: string;
  Wiki: {
    blocks: [];
    entityMap: {
      [key: string]: any;
    };
  };
}

export type IHandleSaveBlocks = (params: {
  content?: IGetWikiBlock['Wiki'];
  insertAfterKey?: unknown | undefined;
  removeBlocks?: any[];
}) => void;
export type IGetWikiBlocks = (params: {
  ownerId?: string;
}) => Promise<IGetWikiBlock>;

export type IHandleSaveRawHtmlContent = (params: {
  html?: string;
  css?: string;
}) => void;

export type ISaveBlocks = (params: {
  ownerId?: string;
  content?: IGetWikiBlock['Wiki'];
  insertAfterKey?: unknown | undefined;
  removeBlocks?: any[];
}) => void;

export type IRemoveBlocks = (params: {
  ownerId?: string;
  content?: IGetWikiBlock['Wiki'];
}) => void;

export type ISortBlocks = (params: {
  ownerId?: string;
  content?: IGetWikiBlock['Wiki'];
}) => void;

export type ISaveHTMLContent = (params: {
  ownerId?: string;
  css?: string;
  html?: string;
}) => void;

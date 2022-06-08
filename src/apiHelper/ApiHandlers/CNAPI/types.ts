import { IFormFilters } from '../FGAPI/types';

export interface IServiceSettingBinaryOption {
  NodeTypeID?: string;
  NodeID?: string;
  Value?: boolean;
}

export interface IContributor {
  UserID: string;
  Share: number;
}

export interface IGetNodesRequest {
  NodeIDs?: string[];
  NodeTypeIDs?: string[];
  RelatedToIDs?: string[];
  CreatorUserIDs?: string[];
  UseNodeTypeHierarchy?: boolean;
  SearchText?: string;
  IsDocument?: boolean;
  IsKnowledge?: boolean;
  IsMine?: boolean;
  Archive?: boolean;
  Searchable?: boolean;
  CreatedFromNDaysAgo?: number;
  CreatedToNDaysAgo?: number;
  CreationDateFrom?: string;
  CreationDateTo?: string;
  IsFavorite?: boolean;
  IsGroup?: boolean;
  IsExpertiseDomain?: boolean;
  FormFilters?: IFormFilters;
  MatchAllFilters?: boolean;
  FetchCounts?: boolean;
  GroupByElementID?: string;
  HasChild?: boolean;
  Count?: number;
  LowerBoundary?: number;
}

export interface IGetChildNodesRequest {
  NodeID?: string; //parentId
  NodeTypeID?: string;
  NodeTypeAdditionalID?: string;
  OrderBy?: 'Type' | 'Date' | 'Name';
  OrderByDesc?: boolean;
  SearchText?: string;
  Count?: number;
  LowerBoundary?: number;
}

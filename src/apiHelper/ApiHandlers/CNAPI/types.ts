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

export interface IGetNodeResponse {
  AdditionalID: string;
  AdminArea: {
    Editable: boolean;
    Value: {
      NodeID: string;
      NodeName: string;
      NodeType: string;
    };
  };
  AdminType: 'NotSet' | string;
  AppID: string;
  AttachedFiles: { Editable: boolean; Value: unknown[] };
  ConfidentialityLevel: {
    Editable: boolean;
    Value: {
      ConfidentialityID: null | string;
      ID: null | string;
      LevelID: null | string;
      Title: string;
    };
  };
  Contribution: boolean;
  Contributors: {
    Editable: boolean;
    Value: {
      FirstName: string;
      LastName: string;
      ProfileImageURL: string;
      Share: string | number;
      UserID: string;
      UserName: string;
    }[];
  };
  CoverPhotoURL: { Editable: boolean; Value: string; HighQuality: string };
  CreationDate: string;
  Creator: {
    FirstName: string;
    FullName: string;
    ImageURL: string;
    IncompleteProfile: boolean;
    LastName: string;
    ProfileImageURL: string;
    UserID: string;
    UserName: string;
  };
  Description: { Editable: boolean; Value: string };
  DisableAbstractAndKeywords: boolean;
  DisableFileUpload: boolean;
  DisableRelatedNodesSelect: boolean;
  DocumentTree: {
    Editable: boolean;
    Value: { Childs: unknown[]; ID: string; Name: string };
  };
  EditSuggestion: boolean;
  Editable: boolean;
  EnablePreviousVersionSelect: boolean;
  ForcedMembership: boolean;
  FormInstance: {
    CreationDate: string;
    CreationDate_Jalali: string;
    DirectorID: string;
    FormID: string;
    InstanceID: string;
    IsTemporary: boolean;
    OwnerID: string;
    Title: string;
  };
  HasChild: boolean;
  HasFormContent: boolean;
  HasWikiContent: boolean;
  HasWorkFlowEditPermission: boolean;
  HideCreators: boolean;
  IconURL: { Editable: boolean; Value: string; HighQuality: string };
  IsAdmin: boolean;
  IsAreaAdmin: boolean;
  IsContributor: boolean;
  IsDocument: boolean;
  IsExpert: boolean;
  IsFreeUser: boolean;
  IsKnowledge: boolean;
  IsMember: boolean;
  IsRegisterer: boolean;
  IsServiceAdmin: boolean;
  IsSystemAdmin: boolean;
  IsTree: boolean;
  Keywords: { Editable: boolean; Value: unknown[] };
  LikeStatus: boolean;
  LikesCount: number;
  MembershipRequestsCount: number;
  MembershipStatus: string;
  Name: { Editable: boolean; Value: string };
  NameHierarchy: { Editable: boolean; Value: unknown[] };
  NewVersions: unknown[];
  NoContentService: boolean;
  NodeID: string;
  NodeType: { Editable: boolean; Value: unknown[] };
  NodeTypeID: string;
  Owner: { NodeID: string; Name: string };
  PDFCovers: unknown[];
  Permissions: {
    ViewAbstract: boolean;
    ViewRelatedItems: boolean;
    Modify: boolean;
    Delete: boolean;
    Download: boolean;
  };
  PreviousVersion: { Editable: boolean; Value: { ID: string; Name: string } };
  PublicDescription: { Editable: boolean; Value: string };
  PublicationDate: string;
  Removable: boolean;
  Score: number;
  Searchable: { Editable: boolean; Value: boolean };
  Status: string;
  ViewPermission: 'View' | string;
  VisitsCount: number;
}

export interface IRegisterNewNodeResponse {
  AccessToken: string;
  AdditionalID: string;
  AppID: string;
  Name: string;
  NodeID: string;
  Succeed: string;
  SuccessMessage: string;
}

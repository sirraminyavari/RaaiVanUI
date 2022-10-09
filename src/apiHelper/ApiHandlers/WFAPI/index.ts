import { WF_API, KNOWLEDGE_API } from 'constant/apiConstants';
import { API_Provider, encodeBase64, decodeBase64 } from 'helpers/helpers';
import { apiCallWrapper } from '../apiCallHelpers';

interface IWorkflowState {
  AttachedFiles: [];
  Description: string;
  Director: {
    UserID: string;
    FullName: string;
    NodeID: string;
    NodeName: string;
    NodeType: string;
    ProfileImageURL: string;
  };
  Forms: [];
  HistoryID: string;
  OwnerID: string;
  PollID: string;
  PollName: string;
  PreviousHistoryID: string;
  SendDate: string;
  StateID: string;
  StateTitle: string;
  WorkFlowID: string;
  WorkFlowStateFormID: string;
  WorkFlowStateID: string;
}
interface IGetOwnerHistory {
  AppID: string;
  States: IWorkflowState[];
}

/**
 * @description fetch Node's workflow owner history
 */
export const GetOwnerHistory = ({
  OwnerID,
  LastOnly,
  Done,
}: {
  OwnerID: string;
  LastOnly?: boolean;
  Done?: boolean;
}) => {
  return apiCallWrapper<IGetOwnerHistory>(
    API_Provider(WF_API, 'GetOwnerHistory'),
    {
      OwnerID,
      LastOnly,
      Done,
    }
  );
};

interface IKnowledgeItem {
  Action: 'Comment';
  ActionDate: string;
  Actor: {
    FirstName: string;
    FullName: string;
    ImageURL: string;
    IncompleteProfile: boolean;
    LastName: string;
    ProfileImageURL: string;
    UserID: string;
    UserName: string;
  };
  Deputy: null;
  Description: string;
  ID: string;
  IsContributor: boolean;
  IsCreator: boolean;
  TextOptions: [];
  WFVersionID: 1;
}

/**
 * @description fetch Node's knowledge workflow history
 */
export const GetKnowledgeHistory = async ({
  KnowledgeID,
}: {
  KnowledgeID: string;
}) => {
  return apiCallWrapper<IKnowledgeItem[]>(
    API_Provider(KNOWLEDGE_API, 'GetHistory'),
    {
      KnowledgeID,
    }
  );
};

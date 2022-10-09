import API from 'apiHelper';
import Avatar from 'components/Avatar/Avatar';
import FormCell from 'components/FormElements/FormFill/FormCell';
import WorkflowIcon from 'components/Icons/WorkflowIcon/WorkflowIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import useWindowContext from 'hooks/useWindowContext';
import { useEffect, useState } from 'react';
import * as Styles from './WorkflowField.styles';
import WorkflowKnowledgeFieldButtonType from './WorkflowKnowledgeFieldButtonType';

interface IWorkflowKnowledgeField {
  NodeID: string;
  AdditionalID?: string;
  Creator?: {
    FirstName: string;
    FullName: string;
    ImageURL: string;
    IncompleteProfile: boolean;
    LastName: string;
    ProfileImageURL: string;
    UserID: string;
    UserName: string;
  };
  Status:
    | 'Personal'
    | 'SentToAdmin'
    | 'SentBackForRevision'
    | 'SentToEvaluators'
    | 'Rejected'
    | 'Accepted'
    | '';
  EvaluationNeeded?: boolean;
  PreEvaluateByOwner?: boolean;
  // NodeName: params.NodeName,
  // AdminType: params.AdminType || "",
  // HasAdmin: boolean;
  // Evaluators: params.Evaluators || "",
  // NodeSelectType: params.NodeSelectType || "",
  // DescriptionArea: null
  // ForceEvaluatorsDescribe: params.ForceEvaluatorsDescribe === true,
  // PreEvaluated: params.PreEvaluated === true,
  // UnhideEvaluators: params.UnhideEvaluators === true,
  // UnhideEvaluations: params.UnhideEvaluations === true,
  // UnhideNodeCreators: params.UnhideNodeCreators === true,
  // TextOptions: {},
  // IsRegisterer: params.IsRegisterer === true,
  // IsContributor: params.IsContributor === true,
  // IsAreaAdmin: params.IsAreaAdmin === true,
  // IsEvaluator: params.IsEvaluator === true,
  // HasEvaluated: params.HasEvaluated === true,
  // EvaluationsEditable: params.EvaluationsEditable === true,
  // EvaluationsEditableForAdmin: params.EvaluationsEditableForAdmin === true,
  // IsFreeUser: params.IsFreeUser === true,
  // IsServiceAdmin: params.IsServiceAdmin === true,
  // IsSystemAdmin: params.IsSystemAdmin === true,
  // IsDirector: params.IsDirector === true,
  // KWFPermission: params.KWFPermission === true,
  // Searchable: params.Searchable === true,
  // Publicated: params.Status == "Accepted",
}
const WorkflowKnowledgeField = ({
  NodeID,
  Status,
  EvaluationNeeded,
}: IWorkflowKnowledgeField) => {
  const { RVDic } = useWindowContext();

  const [workflowHistory, setWorkflowHistory] = useState<
    Awaited<ReturnType<typeof API.WFAPI.GetKnowledgeHistory>>
  >([]);

  const RVDicEvaluationNeeded = RVDic.KW.ManageEvaluationProcess;
  const RVDicHistory = RVDic.History;

  useEffect(() => {
    (async () => {
      const KnowledgeItems = await API.WFAPI.GetKnowledgeHistory({
        KnowledgeID: NodeID,
      });
      setWorkflowHistory(KnowledgeItems);
    })();
  }, [NodeID]);

  return (
    <>
      {/*@ts-expect-error */}
      <FormCell
        editModeVisible={false}
        title={'جریان کاری'}
        style={{ display: 'flex', flexGrow: 1 }}
        iconComponent={<WorkflowIcon size="1.25rem" color={CV_GRAY} />}
      >
        <Styles.WorkflowFieldAccordion
          label={<WorkflowFieldAccordionLabel Status={Status} />}
        >
          <Styles.WorkflowFieldContainer>
            <Styles.WorkflowFieldItemActionsContainer>
              {EvaluationNeeded && (
                <Styles.WorkflowFieldButton>
                  {RVDicEvaluationNeeded}
                </Styles.WorkflowFieldButton>
              )}
            </Styles.WorkflowFieldItemActionsContainer>
            <Styles.WorkflowFieldLabel>
              {RVDicHistory}
              <span />
            </Styles.WorkflowFieldLabel>
            {workflowHistory.map((item, idx) => (
              <Styles.WorkflowFieldItemContainer key={idx}>
                <Styles.WorkflowFieldItemLabelContainer>
                  <Styles.WorkflowFieldItemLabelContainer>
                    {/*@ts-expect-error */}
                    <Avatar userImage={item.Actor.ProfileImageURL} />
                    <Styles.WorkflowFieldItemLabelTitle>
                      <span>{decodeBase64(item.Actor.FullName)}</span>
                      <Styles.WorkflowFieldItemLabelTitleDate>
                        {item.ActionDate}
                      </Styles.WorkflowFieldItemLabelTitleDate>
                    </Styles.WorkflowFieldItemLabelTitle>
                  </Styles.WorkflowFieldItemLabelContainer>
                  <Styles.WorkflowFieldItemLabelContainer actionsOnly>
                    <WorkflowKnowledgeFieldButtonType type={item.Action} />
                  </Styles.WorkflowFieldItemLabelContainer>
                </Styles.WorkflowFieldItemLabelContainer>

                <Styles.WorkflowFieldItemContent
                  muted={!decodeBase64(item.Description)}
                >
                  {decodeBase64(item.Description) || RVDic.DescriptionIsEmpty}
                </Styles.WorkflowFieldItemContent>
              </Styles.WorkflowFieldItemContainer>
            ))}
          </Styles.WorkflowFieldContainer>
        </Styles.WorkflowFieldAccordion>
      </FormCell>
    </>
  );
};

WorkflowKnowledgeField.displayName = 'WorkflowKnowledgeField';
export default WorkflowKnowledgeField;

const WorkflowFieldAccordionLabel = ({
  Status,
}: Pick<IWorkflowKnowledgeField, 'Status'>) => {
  const { RVDic } = useWindowContext();

  const RVDicWorkflowStatus = Status && RVDic.CN[Status];
  return (
    <Styles.WorkflowFieldAccordionLabelContainer>
      وضعیت کنونی:
      <Styles.WorkflowFieldAccordionLabelStatus>
        {RVDicWorkflowStatus}
      </Styles.WorkflowFieldAccordionLabelStatus>
    </Styles.WorkflowFieldAccordionLabelContainer>
  );
};

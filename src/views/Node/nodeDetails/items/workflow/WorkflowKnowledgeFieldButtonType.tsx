import useWindowContext from 'hooks/useWindowContext';
import * as Styles from './WorkflowField.styles';

interface IWorkflowKnowledgeFieldButtonType {
  type?: string;
  action?: () => void;
}
const WorkflowKnowledgeFieldButtonType = ({
  type,
  action = () => {},
}: IWorkflowKnowledgeFieldButtonType) => {
  const { RVDic } = useWindowContext();

  //! RVDic i18n
  const RVDicLabel = type && (RVDic[type] || RVDic.KW[type]);
  return (
    <Styles.WorkflowFieldItemButton>
      {RVDicLabel}
    </Styles.WorkflowFieldItemButton>
  );
};

export default WorkflowKnowledgeFieldButtonType;

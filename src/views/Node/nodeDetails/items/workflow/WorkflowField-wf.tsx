import API from 'apiHelper';
import Avatar from 'components/Avatar/Avatar';
import Button from 'components/Buttons/Button';
import FormCell from 'components/FormElements/FormFill/FormCell';
import WorkflowIcon from 'components/Icons/WorkflowIcon/WorkflowIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import { useEffect, useState } from 'react';
import * as Styles from './WorkflowField.styles';

const worsArray = [
  { status: 'وضعیت شماره دو', date: '16:45 1400/07/25', ctx: 'بشسیبشسیبشسی' },
  { status: 'وضعیت شماره یک', date: '16:45 1400/07/15', ctx: 'asdasdasdasd' },
];

interface IWorkflowField {
  NodeID: string;
}
const WorkflowField = ({ NodeID }: IWorkflowField) => {
  const [workflowHistory, setWorkflowHistory] = useState<
    Awaited<ReturnType<typeof API.WFAPI.GetOwnerHistory>>['States']
  >([]);
  useEffect(() => {
    (async () => {
      const { States } = await API.WFAPI.GetOwnerHistory({ OwnerID: NodeID });
      setWorkflowHistory(States);
    })();
  }, []);

  return (
    <>
      {/*@ts-expect-error */}
      <FormCell
        editModeVisible={false}
        title={'جریان کاری'}
        style={{ display: 'flex', flexGrow: 1 }}
        iconComponent={<WorkflowIcon size="1.25rem" color={CV_GRAY} />}
      >
        <Styles.WorkflowFieldAccordion label={<WorkflowFieldAccordionLabel />}>
          <Styles.WorkflowFieldContainer>
            <>
              <Styles.WorkflowFieldInput
                //@ts-expect-error
                placeholder="نظر شما ..."
                style={{ maxWidth: '100%' }}
              />
            </>
            {workflowHistory.map((item, idx) => (
              <Styles.WorkflowFieldItemContainer>
                <Styles.WorkflowFieldItemContainer>
                  <Styles.WorkflowFieldItemLabelTitle>
                    <span>{decodeBase64(item.StateTitle)}</span>
                    <Styles.WorkflowFieldItemLabelTitleDate>
                      {item.SendDate}
                    </Styles.WorkflowFieldItemLabelTitleDate>
                  </Styles.WorkflowFieldItemLabelTitle>

                  {/*@ts-expect-error */}
                  <Avatar userImage={item.Director.ProfileImageURL} />
                </Styles.WorkflowFieldItemContainer>
                <Styles.WorkflowFieldItemContent>
                  {decodeBase64(item.Description)}
                </Styles.WorkflowFieldItemContent>
              </Styles.WorkflowFieldItemContainer>
            ))}

            <Styles.WorkflowFieldItemActionsContainer>
              <Button type="primary">ورود به اتاق هم اندیشی</Button>
              <Button type="negative-o" style={{ marginInlineStart: 'auto' }}>
                پایان دادن به فرآیند
              </Button>
            </Styles.WorkflowFieldItemActionsContainer>
          </Styles.WorkflowFieldContainer>
        </Styles.WorkflowFieldAccordion>
      </FormCell>
    </>
  );
};

WorkflowField.displayName = 'WorkflowField';
export default WorkflowField;

const WorkflowFieldAccordionLabel = () => {
  return (
    <Styles.WorkflowFieldAccordionLabelContainer>
      وضعیت کنونی:
      <Styles.WorkflowFieldAccordionLabelStatus>
        وضعیت سه
      </Styles.WorkflowFieldAccordionLabelStatus>
    </Styles.WorkflowFieldAccordionLabelContainer>
  );
};

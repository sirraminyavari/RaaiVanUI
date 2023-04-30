/**
 * The main content of NodeDetails will produce here.
 */

import APIHandler from 'apiHelper/APIHandler';
import FormFill from 'components/FormElements/FormFill/FormFill';
import Heading from 'components/Heading/Heading';
import Input from 'components/Inputs/Input';
import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { modifyNodeName, registerNewNode } from 'apiHelper/ApiHandlers/CNAPI';
import NodePageRelatedNodeItems from './topBar/NodePageRelatedNodeItems';
import SummeryInputIcon from 'components/Icons/InputIcon/SummeryInputIcon.tsx';
import useWindowContext from 'hooks/useWindowContext';
import ParagraphField from 'components/FormElements/FormFill/types/ParagraphField/ParagraphField';
import WikiBlockEditor from 'views/Node/nodeDetails/items/WikiBlock';
import KeywordField from 'components/FormElements/FormFill/types/keywordField/KeywordField';
import Button from 'components/Buttons/Button';
import { useHistory } from 'react-router-dom';
import { getNodePageUrl } from 'apiHelper/getPageUrl';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import WorkflowField from './workflow/WorkflowField';

//TODO replace ModifyNodeDescription and ModifyNodeTags API Handler Calls with apiHelper imports
const ModifyNodeDescription = new APIHandler('CNAPI', 'ModifyNodeDescription');
const ModifyNodeTags = new APIHandler('CNAPI', 'ModifyNodeTags');

const MainNode = ({
  nodeDetails,
  nodeId,
  fields,
  newNode,
  NodeTypeID,
  InstanceID,
}) => {
  //TODO: Update RVDic object dictionary
  const history = useHistory();
  const { isTabletOrDesktop, isTablet, isMobile } = DimensionHelper();
  const [titleEditMode, setTitleEditMode] = useState(newNode);

  const [whichElementChanged, setWhichElementChanged] = useState(null);
  const [title, setTitle] = useState(decodeBase64(nodeDetails?.Name?.Value));
  const [description, setDescription] = useState(null);
  const [keywords, setKeywords] = useState(undefined);
  const { RVDic, RVGlobal } = useWindowContext();

  const onSaveTitle = async () => {
    setTitleEditMode(false);
    if (whichElementChanged === 'title') {
      setTitleEditMode(false);
      const { NodeID } = nodeDetails || {};

      await modifyNodeName(title, NodeID);
    }
    setWhichElementChanged(null);
  };
  const onTitleChange = (event) => {
    setWhichElementChanged('title');
    setTitle(event.target.value);
  };

  const onSaveDesc = (textFieldValue) => {
    const { NodeID } = nodeDetails || {};
    ModifyNodeDescription.fetch(
      {
        NodeID: NodeID,
        Description: encodeBase64(textFieldValue),
      },
      (res) => {
        console.log(res, 'save result', textFieldValue);
      }
    );
    setWhichElementChanged(null);
  };

  const onSaveKeywords = useCallback(
    (Keywords) => {
      const readyToSaveKeywords = Keywords.map((x) => x.value);
      if (newNode) setKeywords(readyToSaveKeywords);
      else
        ModifyNodeTags.fetch(
          { NodeID: nodeId, Tags: encodeBase64(readyToSaveKeywords.join('~')) },
          (_res) => {
            // alert('saved', {
            //   Timeout: 1000,
            // });
          }
        );
    },
    [newNode, nodeId]
  );

  const onCreateNode = useCallback(async () => {
    if (title) {
      const { NodeID } = await registerNewNode({
        Name: title,
        Description: description,
        NodeTypeID,
        FormInstanceID: InstanceID,
        Tags: keywords,
      });
      history.push(getNodePageUrl(NodeID));
    } else alert('نام وارد نشده است !');
  }, [title, description, NodeTypeID, InstanceID, keywords, history]);

  return (
    <>
      <Main>
        {RVGlobal.IsDev && !newNode && (
          <WorkflowField
            NodeID={nodeId}
            Status={nodeDetails.Status}
            EvaluationNeeded={nodeDetails.EvaluationNeeded}
          />
        )}

        <>
          <NodePageRelatedNodeItems
            ClassID={nodeDetails?.NodeType?.Value[0]?.ID}
            NodeID={nodeId}
          />
        </>
        {nodeDetails?.DisableAbstractAndKeywords !== true && (
          <>
            {nodeDetails?.Description?.Value !== undefined && (
              <ParagraphField
                decodeTitle={RVDic.Summary}
                iconComponent={<SummeryInputIcon color={CV_GRAY} />}
                onAnyFieldChanged={(_, fieldValue) =>
                  newNode ? setDescription(fieldValue) : onSaveDesc(fieldValue)
                }
                value={decodeBase64(nodeDetails?.Description?.Value)}
                isEditable={nodeDetails?.Description?.Editable}
              />
            )}
            <KeywordField
              Keywords={nodeDetails?.Keywords}
              onSaveKeywords={onSaveKeywords}
              isEditable={nodeDetails?.Description?.Editable}
            />
          </>
        )}
        {fields && <FormFill editable={nodeDetails?.Editable} data={fields} />}

        {!newNode && (
          <WikiBlockEditor nodeId={nodeId} editable={nodeDetails?.Editable} />
        )}

        {newNode && (
          <SubmitButton
            type="primary"
            onClick={onCreateNode}
            isTabletOrDesktop={isTabletOrDesktop}
            isTablet={isTablet}
            isMobile={isMobile}
          >
            {RVDic.CreateN.replace('[n]', RVDic.Node)}
          </SubmitButton>
        )}
      </Main>
    </>
  );
};
export default MainNode;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SubmitButton = styled(Button)`
  margin-block-start: 3.5rem;
  margin-inline: auto;
  width: ${({ isTabletOrDesktop, isTablet, isMobile }) => {
    switch (true) {
      case isMobile:
        return '100%';
      case isTablet:
        return '75%';
      case isTabletOrDesktop:
      default:
        return '50%';
    }
  }};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-block: ${({ newNode }) => (newNode ? 0 : 1.5)}rem;
`;

const TitleInput = styled(Input)`
  font-size: 1.4rem;
  font-weight: bold;
  border-width: 0;
  border-bottom-width: ${({ titleEditMode }) => (titleEditMode ? 1 : 0)}px;
  border-radius: 0;
  border-color: ${CV_DISTANT} !important;
  width: 100%;

  &::-webkit-input-placeholder {
    color: ${CV_DISTANT};
  }
`;

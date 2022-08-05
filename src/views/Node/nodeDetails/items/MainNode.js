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
  const history = useHistory();
  const [titleEditMode, setTitleEditMode] = useState(false);

  const [whichElementChanged, setWhichElementChanged] = useState(null);
  const [title, setTitle] = useState(decodeBase64(nodeDetails?.Name?.Value));
  const [description, setDescription] = useState(null);
  const [keywords, setKeywords] = useState(undefined);
  const { RVDic } = useWindowContext();

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
        {nodeDetails?.Name?.Value !== undefined && (
          <TitleContainer style={{ marginBottom: '3rem' }}>
            {nodeDetails?.Name?.Editable ? (
              <Input
                onChange={onTitleChange}
                defaultValue={decodeBase64(nodeDetails?.Name?.Value)}
                onFocus={() => {
                  setTitleEditMode(true);
                }}
                onBlur={onSaveTitle}
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  borderWidth: 0,
                  borderBottomWidth: +`${titleEditMode ? 1 : 0}`,
                  borderRadius: 0,
                  borderColor: `${CV_DISTANT}`,
                  width: '100%',
                }}
              />
            ) : (
              <Heading type={'h1'}>
                {decodeBase64(title || nodeDetails?.Name?.Value)}
              </Heading>
            )}
          </TitleContainer>
        )}

        <>
          <NodePageRelatedNodeItems
            ClassID={nodeDetails?.NodeType?.Value[0]?.ID}
            NodeID={nodeId}
          />
        </>
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
        <TitleContainer>
          <KeywordField
            Keywords={nodeDetails?.Keywords}
            onSaveKeywords={onSaveKeywords}
            isEditable={nodeDetails?.Description?.Editable}
          />
        </TitleContainer>
        {fields && <FormFill editable={nodeDetails?.Editable} data={fields} />}

        {!newNode && (
          <WikiBlockEditor nodeId={nodeId} editable={nodeDetails?.Editable} />
        )}

        {newNode && (
          <Button type="primary" onClick={onCreateNode}>
            {RVDic.CreateN.replace('[n]', RVDic.Node)}
          </Button>
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
const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

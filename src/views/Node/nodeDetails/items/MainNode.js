/**
 * The main content of NodeDetails will produce here.
 */

import APIHandler from 'apiHelper/APIHandler';
import FormFill from 'components/FormElements/FormFill/FormFill';
import Heading from 'components/Heading/Heading';
import Input from 'components/Inputs/Input';
import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import { useState } from 'react';
import styled from 'styled-components';
import { modifyNodeName } from 'apiHelper/ApiHandlers/CNAPI';
import NodePageRelatedNodeItems from './topBar/NodePageRelatedNodeItems';
import SummeryInputIcon from 'components/Icons/InputIcon/SummeryInputIcon.tsx';
import useWindowContext from 'hooks/useWindowContext';
import ParagraphField from 'components/FormElements/FormFill/types/ParagraphField/ParagraphField';
import WikiBlockEditor from 'views/Node/nodeDetails/items/WikiBlock';
import KeywordField from 'components/FormElements/FormFill/types/keywordField/KeywordField';

//TODO replace ModifyNodeDescription and ModifyNodeTags API Handler Calls with apiHelper imports
const ModifyNodeDescription = new APIHandler('CNAPI', 'ModifyNodeDescription');

const MainNode = ({ nodeDetails, nodeId, fields }) => {
  const [titleEditMode, setTitleEditMode] = useState(false);

  const [whichElementChanged, setWhichElementChanged] = useState(null);
  const [title, setTitle] = useState(decodeBase64(nodeDetails?.Name?.Value));
  const { RVDic } = useWindowContext();

  const onSaveTitle = async () => {
    setTitleEditMode(false);
    if (whichElementChanged === 'title') {
      setTitleEditMode(false);
      const { NodeID } = nodeDetails || {};

      await modifyNodeName({
        NodeID: NodeID,
        Name: encodeBase64(title),
      });
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
            onAnyFieldChanged={(_, fieldValue) => onSaveDesc(fieldValue)}
            value={decodeBase64(nodeDetails?.Description?.Value)}
            isEditable={nodeDetails?.Description?.Editable}
          />
        )}
        <TitleContainer>
          <KeywordField
            Keywords={nodeDetails?.Keywords}
            NodeID={nodeDetails?.NodeID}
          />
        </TitleContainer>
        {fields && <FormFill editable={nodeDetails?.Editable} data={fields} />}

        <WikiBlockEditor nodeId={nodeId} editable={nodeDetails?.Editable} />
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

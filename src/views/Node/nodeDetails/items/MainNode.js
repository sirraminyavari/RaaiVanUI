/**
 * The main content of NodeDetails will produce here.
 */

import APIHandler from 'apiHelper/APIHandler';
import FormCell from 'components/FormElements/FormFill/FormCell';
import FormFill from 'components/FormElements/FormFill/FormFill';
import Heading from 'components/Heading/Heading';
import Input from 'components/Inputs/Input';
import { CV_DISTANT, CV_GRAY, CV_WHITE } from 'constant/CssVariables';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import { modifyNodeName } from 'apiHelper/ApiHandlers/CNAPI';
import NodePageRelatedNodeItems from './topBar/NodePageRelatedNodeItems';
import SummeryInputIcon from 'components/Icons/InputIcon/SummeryInputIcon.tsx';
import useWindowContext from 'hooks/useWindowContext';
import ParagraphField from 'components/FormElements/FormFill/types/ParagraphField/ParagraphField';
import TagIcon from 'components/Icons/TagIcon/TagIcon';
import WikiBlockEditor from 'views/Node/nodeDetails/items/WikiBlock';

//TODO replace ModifyNodeDescription and ModifyNodeTags API Handler Calls with apiHelper imports
const ModifyNodeDescription = new APIHandler('CNAPI', 'ModifyNodeDescription');
const ModifyNodeTags = new APIHandler('CNAPI', 'ModifyNodeTags');

const MainNode = ({ nodeDetails, nodeId, fields }) => {
  const [titleEditMode, setTitleEditMode] = useState(false);

  //TODO identify `descEditMode` usage ...
  const [descEditMode, setDescEditMode] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [whichElementChanged, setWhichElementChanged] = useState(null);
  const [title, setTitle] = useState(decodeBase64(nodeDetails?.Name?.Value));
  const [desc, setDesc] = useState(
    decodeBase64(nodeDetails?.Description?.Value)
  );
  const { RVDic } = useWindowContext();

  useEffect(() => {
    if (descEditMode) setTitle(decodeBase64(nodeDetails?.Name?.Value));
    setDesc(decodeBase64(nodeDetails?.Description?.Value));
    setKeywords(
      nodeDetails?.Keywords?.Value?.length > 0
        ? nodeDetails?.Keywords?.Value?.map((x) => {
            return {
              label: decodeBase64(x),
              value: decodeBase64(x),
            };
          })
        : []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeDetails?.Name?.Value]);

  // const onEditTitle = () => {
  //   setTitleEditMode(true);
  // };
  const onSaveTitle = async () => {
    setTitleEditMode(false);
    if (whichElementChanged === 'title') {
      setTitleEditMode(false);
      const { NodeID } = nodeDetails || {};

      const saveResult = await modifyNodeName({
        NodeID: NodeID,
        Name: encodeBase64(title),
      });
      console.log({ saveResult });

      // alert('saved', {
      //   Timeout: 1000,
      // });
    }
    setWhichElementChanged(null);
  };
  const onTitleChange = (event) => {
    setWhichElementChanged('title');
    setTitle(event.target.value);
  };
  // const onEditDesc = () => {
  //   setDescEditMode(true);
  // };

  const onSaveDesc = (textFieldValue) => {
    setDescEditMode(false);
    const { NodeID } = nodeDetails || {};
    ModifyNodeDescription.fetch(
      {
        NodeID: NodeID,
        Description: encodeBase64(textFieldValue),
      },
      (res) => {
        console.log(res, 'save result', textFieldValue);

        // alert('saved', {
        //   Timeout: 1000,
        // });
      }
    );
    setWhichElementChanged(null);
  };
  const onSaveKeywords = (event) => {
    const readyToSaveKeywords = keywords.map((x) => x.value).join('~');
    const { NodeID } = nodeDetails || {};
    ModifyNodeTags.fetch(
      { NodeID: NodeID, Tags: encodeBase64(readyToSaveKeywords) },
      (res) => {
        // alert('saved', {
        //   Timeout: 1000,
        // });
      }
    );
  };

  return (
    <>
      <Main>
        <TitleContainer style={{ marginBottom: '3rem' }}>
          {nodeDetails?.Name?.Editable && nodeDetails?.Name?.Value ? (
            <Input
              onChange={onTitleChange}
              value={title}
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
            <Heading type={'h1'}>{title}</Heading>
          )}
        </TitleContainer>

        <>
          <NodePageRelatedNodeItems
            ClassID={nodeDetails?.NodeType?.Value[0]?.ID}
            NodeID={nodeId}
          />
        </>
        <>
          <ParagraphField
            decodeTitle={RVDic.Summary}
            iconComponent={<SummeryInputIcon color={CV_GRAY} />}
            onAnyFieldChanged={(_, fieldValue) => onSaveDesc(fieldValue)}
            value={desc}
            isEditable={nodeDetails?.Description?.Editable}
          />
        </>
        <TitleContainer>
          <FormCell
            editModeVisible={false}
            title={RVDic.Keywords}
            style={{ display: 'flex', flexGrow: 1 }}
            iconComponent={<TagIcon size="1.25rem" color={CV_GRAY} />}
          >
            <CellContainer>
              <CreatableSelect
                value={keywords}
                isMulti
                isDisabled={!nodeDetails?.Keywords?.Editable}
                isClearable
                placeholder={RVDic.Select}
                onBlur={onSaveKeywords}
                onChange={setKeywords}
                styles={customStyles}
                className="basic-multi-select"
                classNamePrefix="select"
                components={{
                  Menu: () => null, // Remove menu
                  MenuList: () => null, // Remove menu list
                  DropdownIndicator: () => null, // Remove dropdown icon
                  IndicatorSeparator: () => null, // Remove separator
                }}
              />
            </CellContainer>
          </FormCell>
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
const CellContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

const customStyles = {
  option: (provided, state) => ({
    ...provided,
  }),
  menuPortal: (provided, state) => ({
    ...provided,
  }),
  control: (provided) => ({
    // none of react-select's styles are passed to <Control />
    ...provided,
    minWidth: '13rem',
    borderColor: CV_WHITE,
    backgroundColor: CV_WHITE,
    ':focus': {
      borderWidth: 0,
    },
    ':hover': {},
  }),
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: '#e6f4f1',
      borderRadius: '0.5rem',
      padding: '0.3rem',
    };
  },
  multiValueRemove: (styles, { data }) => {
    return {
      ...styles,
      ':hover': {
        color: 'red',
      },
    };
  },
  menu: (provided) => ({
    ...provided,
    borderColor: '#e6f4f1',
    ':hover': {
      borderWidth: 0,
    },
  }),
};

/**
 * The main content of NodeDetails will produce here.
 */

import APIHandler from 'apiHelper/APIHandler';
import FormCell from 'components/FormElements/FormFill/FormCell';
import FormFill from 'components/FormElements/FormFill/FormFill';
import Heading from 'components/Heading/Heading';
import TextIcon from 'components/Icons/TextIcon';
import Input from 'components/Inputs/Input';
import { CV_DISTANT, CV_GRAY, CV_WHITE } from 'constant/CssVariables';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { RVDic } from 'utils/TestUtils/fa';
import CreatableSelect from 'react-select/creatable';
import {
  getFormInstance,
  initializeOwnerFormInstance,
} from 'apiHelper/ApiHandlers/FGAPI';

const ModifyNodeName = new APIHandler('CNAPI', 'ModifyNodeName');
const ModifyNodeDescription = new APIHandler('CNAPI', 'ModifyNodeDescription');
const ModifyNodeTags = new APIHandler('CNAPI', 'ModifyNodeTags');
const getInstanceId = new APIHandler('FGAPI', 'InitializeOwnerFormInstance');
const MainNode = ({ nodeDetails, nodeId, fields }) => {
  const [titleEditMode, setTitleEditMode] = useState(false);
  const [descEditMode, setDescEditMode] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [whichElementChanged, setWhichElementChanged] = useState(null);
  const [title, setTitle] = useState(decodeBase64(nodeDetails?.Name?.Value));
  const [desc, setDesc] = useState(
    decodeBase64(nodeDetails?.Description?.Value)
  );

  useEffect(() => {
    setTitle(decodeBase64(nodeDetails?.Name?.Value));
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
  }, [nodeDetails?.Name?.Value]);

  const onEditTitle = () => {
    setTitleEditMode(true);
  };
  const onSaveTitle = () => {
    setTitleEditMode(false);
    if (whichElementChanged === 'title') {
      setTitleEditMode(false);
      const { NodeID } = nodeDetails || {};
      ModifyNodeName.fetch(
        { NodeID: NodeID, Name: encodeBase64(title) },
        (res) => {
          console.log(res, 'save result');

          alert('saved', {
            Timeout: 1000,
          });
        }
      );
    }
    setWhichElementChanged(null);
  };
  const onTitleChange = (event) => {
    setWhichElementChanged('title');
    setTitle(event.target.value);
  };
  const onEditDesc = () => {
    setDescEditMode(true);
  };

  const onSaveDesc = () => {
    if (whichElementChanged === 'desc') {
      setDescEditMode(false);
      const { NodeID } = nodeDetails || {};
      ModifyNodeDescription.fetch(
        { NodeID: NodeID, Description: encodeBase64(desc) },
        (res) => {
          console.log(res, 'save result', desc);

          alert('saved', {
            Timeout: 1000,
          });
        }
      );
    }
    setWhichElementChanged(null);
  };
  const onDescChange = (event) => {
    setWhichElementChanged('desc');
    setDesc(event.target.value);
  };
  const onSaveKeywords = (event) => {
    const readyToSaveKeywords = keywords.map((x) => x.value).join('~');
    const { NodeID } = nodeDetails || {};
    ModifyNodeTags.fetch(
      { NodeID: NodeID, Tags: encodeBase64(readyToSaveKeywords) },
      (res) => {
        alert('saved', {
          Timeout: 1000,
        });
      }
    );
  };

  return (
    <>
      <Main>
        <TitleContainer style={{ marginBottom: '3rem' }}>
          {nodeDetails?.Name?.Editable ? (
            <Input
              onChange={onTitleChange}
              value={title}
              onFocus={() => {
                console.log('focused');
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
        <TitleContainer>
          <>
            <FormCell
              editModeVisible={false}
              title={RVDic.Summary}
              style={{ display: 'flex', flexGrow: 1 }}
              iconComponent={<TextIcon color={CV_GRAY} />}
            >
              {nodeDetails?.Name?.Editable ? (
                <Input
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '300',
                    width: '100%',
                  }}
                  onChange={onDescChange}
                  value={desc}
                  onBlur={onSaveDesc}
                />
              ) : (
                <Heading type={'h3'}>{desc}</Heading>
              )}
              {/* {descEditMode ? (
              <CellContainer>
                <Input
                  style={{ width: '90%' }}
                  onChange={onDescChange}
                  value={desc}
                />
                <SaveButton
                  style={{ margin: '0 1rem 0 1rem' }}
                  onClick={onSaveDesc}
                />
              </CellContainer>
            ) : (
              <>
                {nodeDetails?.Name?.Editable && (
                  <PencilIcon
                    size={'1.5rem'}
                    style={{ margin: '0 1rem 0 1rem' }}
                    color={TCV_WARM}
                    onClick={onEditDesc}
                  />
                )}
                <Heading type={'h3'}>{desc}</Heading>
              </>
            )} */}
            </FormCell>
          </>
        </TitleContainer>
        <TitleContainer>
          <>
            <FormCell
              editModeVisible={false}
              title={RVDic.Keywords}
              style={{ display: 'flex', flexGrow: 1 }}
              iconComponent={<TextIcon color={CV_GRAY} />}
            >
              <CellContainer>
                <CreatableSelect
                  value={keywords}
                  isMulti
                  isDisabled={!nodeDetails?.Keywords?.Editable}
                  isClearable
                  onBlur={onSaveKeywords}
                  onChange={setKeywords}
                  styles={customStyles}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </CellContainer>
            </FormCell>
          </>
        </TitleContainer>
        {fields && <FormFill editable={nodeDetails?.Editable} data={fields} />}
      </Main>
    </>
  );
};
export default MainNode;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100rem;
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

/**
 * The main content of NodeDetails will produce here.
 */

import APIHandler from 'apiHelper/APIHandler';
import FormCell from 'components/FormElements/FormFill/FormCell';
import FormFill from 'components/FormElements/FormFill/FormFill';
import SaveButton from 'components/FormElements/FormFill/items/SaveButton';
import Heading from 'components/Heading/Heading';
import PencilIcon from 'components/Icons/EditIcons/Pencil';
import TextIcon from 'components/Icons/TextIcon';
import Input from 'components/Inputs/Input';
import { CV_GRAY, CV_WHITE, TCV_WARM } from 'constant/CssVariables';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { RVDic } from 'utils/TestUtils/fa';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

const ModifyNodeName = new APIHandler('CNAPI', 'ModifyNodeName');
const ModifyNodeDescription = new APIHandler('CNAPI', 'ModifyNodeDescription');
const ModifyNodeTags = new APIHandler('CNAPI', 'ModifyNodeTags');
const getFormInstance = new APIHandler('FGAPI', 'GetFormInstance');
const getInstanceId = new APIHandler('FGAPI', 'InitializeOwnerFormInstance');
const MainNode = ({ nodeDetails, nodeId }) => {
  const [fields, setFields] = useState(null);
  const [titleEditMode, setTitleEditMode] = useState(false);
  const [descEditMode, setDescEditMode] = useState(false);
  const [keywords, setKeywords] = useState([]);
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
  // useEffect(() => {
  // }, [nodeDetails?.Description?.Value]);
  const onEditTitle = () => {
    setTitleEditMode(true);
  };
  const onSaveTitle = () => {
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
  };
  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const onEditDesc = () => {
    setDescEditMode(true);
  };

  const onSaveDesc = () => {
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
  };
  const onDescChange = (event) => {
    setDesc(event.target.value);
  };
  const onSaveKeywords = (event) => {
    const readyToSaveKeywords = keywords.map((x) => x.value).join('~');
    const { NodeID } = nodeDetails || {};
    ModifyNodeTags.fetch(
      { NodeID: NodeID, Tags: encodeBase64(readyToSaveKeywords) },
      (res) => {
        console.log(res, 'save result', desc);
        alert('saved', {
          Timeout: 1000,
        });
      }
    );
  };

  useEffect(() => {
    getInstanceId.fetch(
      {
        OwnerID: nodeId,
      },
      (result) => {
        getFormInstance.fetch(
          {
            InstanceID: result?.InstanceID,
            LimitOwnerID: null,
            ShowAllIfNoLimit: true,
          },
          (response) => {
            setFields(response);
          }
        );
      }
    );
  }, []);

  return (
    <Main>
      <TitleContainer>
        {titleEditMode ? (
          <>
            <Input onChange={onTitleChange} value={title} />
            <SaveButton
              style={{ margin: '0 1rem 0 1rem' }}
              onClick={onSaveTitle}
            />
          </>
        ) : (
          <>
            {nodeDetails?.Name?.Editable && (
              <PencilIcon
                size={'1.5rem'}
                style={{ margin: '0 1rem 0 1rem' }}
                color={TCV_WARM}
                onClick={onEditTitle}
              />
            )}
            <Heading type={'h1'}>{title}</Heading>
          </>
        )}
      </TitleContainer>
      <TitleContainer>
        <>
          {/* <Heading type={'h1'}>{desc}</Heading> */}
          <FormCell
            editModeVisible={false}
            title={RVDic.Summary}
            style={{ display: 'flex', flexGrow: 1 }}
            iconComponent={<TextIcon color={CV_GRAY} />}>
            {descEditMode ? (
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
            )}
          </FormCell>
        </>
      </TitleContainer>
      <TitleContainer>
        <>
          {/* <Heading type={'h1'}>{desc}</Heading> */}
          <FormCell
            editModeVisible={false}
            title={RVDic.Keywords}
            style={{ display: 'flex', flexGrow: 1 }}
            iconComponent={<TextIcon color={CV_GRAY} />}>
            <CellContainer>
              <CreatableSelect
                value={keywords}
                isMulti
                isDisabled={!nodeDetails?.Keywords?.Editable}
                isClearable
                onBlur={onSaveKeywords}
                onChange={setKeywords}
                styles={customStyles}
                value={keywords}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </CellContainer>
          </FormCell>
        </>
      </TitleContainer>
      {/* {formProducer()} */}
      {console.log(nodeDetails, 'nodeDetails')}
      {console.log(decodeBase64(nodeDetails?.Name?.Value), 'name')}
      {fields && <FormFill data={fields} />}
    </Main>
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

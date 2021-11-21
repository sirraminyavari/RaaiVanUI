import { getChildNodes } from 'apiHelper/apiFunctions';
import FilterIconIo from 'components/Icons/FilterIconIo';
import { CV_GRAY, CV_WHITE, TCV_WARM } from 'constant/CssVariables';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import FormCell from '../../FormCell';
import { decodeBase64 } from 'helpers/helpers';

const normalizedOptions = (options) =>
  options?.nodes?.map((x) => {
    return { label: decodeBase64(x.Name), value: { ...x } };
  });

const { RVDic } = window;
const MultiLevelField = ({
  elementId,
  onAnyFieldChanged,
  value,
  decodeInfo,
  decodeTitle,
  type,
  save,
  ...props
}) => {
  const parseDecodeInfo = JSON.parse(decodeInfo);
  const { NodeType, Levels } = parseDecodeInfo || {};

  const { Name } = NodeType;
  const [levels, setLevels] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState(
    Levels.map((x) => {
      return { ID: '', Name: '' };
    })
  );

  useEffect(async () => {
    const firstLevel = await getChildNodes(NodeType?.ID);
    const { Nodes } = firstLevel || {};
    setLevels(Levels.map((x, index) => (index === 0 ? { nodes: Nodes } : x)));
  }, []);
  useEffect(() => {}, [levels]);

  const onLevelSelected = async (elementId, event, type, index) => {
    const selectedTemp = selectedLevels?.map((x, ind) =>
      ind === index
        ? { ID: event?.value?.NodeID, Name: event?.label }
        : ind > index
        ? { ID: '', Name: '' }
        : x
    );
    setSelectedLevels(selectedTemp);

    onAnyFieldChanged(elementId, selectedTemp, type);
    const exceptFirstLevel = await getChildNodes(
      NodeType?.ID,
      event?.value?.NodeID
    );
    const { Nodes } = exceptFirstLevel || {};

    if (index + 1 < Levels.length) {
      const newLevels = levels.map((x, ind) =>
        ind === index + 1 ? { nodes: Nodes } : x
      );

      setLevels(newLevels);
    }
  };

  return (
    <FormCell
      iconComponent={<FilterIconIo color={CV_GRAY} />}
      title={decodeTitle}
      {...props}>
      {console.log(levels, 'levels')}
      <SelectorContainer>
        {levels?.map((x, index) => {
          const { ID, Name } = value[index] || {};
          return (
            <>
              {!!normalizedOptions(x) || value[index] ? (
                <SelectContainer>
                  <Select
                    onBlur={() =>
                      index === levels?.length - 1 && save(elementId)
                    }
                    options={normalizedOptions(x)}
                    styles={customStyles}
                    value={{ value: ID, label: decodeBase64(Name) }}
                    placeholder={RVDic.Select}
                    isSearchable={true}
                    onChange={(event, triggeredAction) => {
                      if (triggeredAction.action === 'clear') {
                        const selectedTemp = selectedLevels?.map((x, ind) =>
                          ind === index ? { ID: undefined, Name: undefined } : x
                        );
                        setSelectedLevels(selectedTemp);
                        onAnyFieldChanged(elementId, selectedTemp, type);
                        setLevels(selectedTemp);
                        // Clear happened
                      } else {
                        onLevelSelected(elementId, event, type, index);
                      }
                    }}
                  />
                </SelectContainer>
              ) : null}
            </>
          );
        })}
      </SelectorContainer>
    </FormCell>
  );
};

export default MultiLevelField;

const SelectContainer = styled.div`
  display: flex;
  margin: 0 1rem 0 1rem;
`;
const SelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -1rem 0 -1rem;
`;
const customStyles = {
  option: (
    styles,
    { data, isDisabled, isFocused, isSelected },
    provided,
    state
  ) => ({
    ...provided,
    color: isSelected ? TCV_WARM : CV_GRAY,
    margin: '0.35rem 0.5rem 0.35rem 0.5rem',
    cursor: 'pointer',
    minWidth: '10rem',
  }),
  control: (provided) => ({
    // none of react-select's styles are passed to <Control />
    ...provided,
    borderColor: CV_WHITE,
    backgroundColor: CV_WHITE,
    minWidth: '10rem',

    ':focus': {
      border: 0,
    },
  }),
  singleValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: '#e6f4f1',
      borderRadius: '0.5rem',
      padding: '0.3rem',
      minWidth: '10rem',
    };
  },
  menu: (provided) => ({
    ...provided,
    borderColor: '#e6f4f1',
    minWidth: '10rem',
  }),
};

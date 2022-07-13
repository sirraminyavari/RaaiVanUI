import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import useWindow from 'hooks/useWindowContext';
import FormCell from '../../FormCell';
import TagIcon from 'components/Icons/TagIcon/TagIcon';
import { CV_GRAY, CV_WHITE } from 'constant/CssVariables';
import APIHandler from 'apiHelper/APIHandler';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import styled from 'styled-components';

const ModifyNodeTags = new APIHandler('CNAPI', 'ModifyNodeTags');

type Props = {
  Keywords: {
    Value: { label: string; value: string }[];
    Editable?: boolean;
  };
  NodeID: string;
};

function KeywordField({ Keywords, NodeID }: Props) {
  const [keywords, setKeywords] = useState<Props['Keywords']['Value']>([]);
  const { RVDic } = useWindow();

  useEffect(() => {
    setKeywords(
      Keywords?.Value?.length > 0
        ? Keywords?.Value?.map((x) => {
            return {
              label: decodeBase64(x),
              value: decodeBase64(x),
            };
          })
        : []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSaveKeywords = () => {
    const readyToSaveKeywords = keywords.map((x) => x.value).join('~');
    ModifyNodeTags.fetch(
      { NodeID: NodeID, Tags: encodeBase64(readyToSaveKeywords) },
      (_res) => {
        // alert('saved', {
        //   Timeout: 1000,
        // });
      }
    );
  };

  return (
    <>
      {/*@ts-expect-error */}
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
            isDisabled={!Keywords?.Editable}
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
    </>
  );
}

export default KeywordField;

const CellContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

const customStyles = {
  option: (provided) => ({
    ...provided,
  }),
  menuPortal: (provided) => ({
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
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: '#e6f4f1',
      borderRadius: '0.5rem',
      padding: '0.3rem',
    };
  },
  multiValueRemove: (styles, { isDisabled }) => {
    return {
      ...styles,
      ':hover': {
        color: 'red',
      },
      display: isDisabled && 'none',
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

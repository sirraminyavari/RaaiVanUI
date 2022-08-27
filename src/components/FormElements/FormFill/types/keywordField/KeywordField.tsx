import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import useWindow from 'hooks/useWindowContext';
import FormCell from '../../FormCell';
import TagIcon from 'components/Icons/TagIcon/TagIcon';
import { CV_GRAY, CV_WHITE } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import styled from 'styled-components';
import * as Styles from 'components/FormElements/ElementTypes/formElements.styles';
import OnClickAway from 'components/OnClickAway/OnClickAway';

type Props = {
  Keywords: {
    Value: { label: string; value: string }[];
    Editable?: boolean;
  };
  isEditable?: boolean;
  onSaveKeywords: (keywords: Props['Keywords']['Value']) => void;
};

function KeywordField({ Keywords, onSaveKeywords, isEditable }: Props) {
  const [keywords, setKeywords] = useState<Props['Keywords']['Value']>([]);
  const [isFocused, setIsFocused] = useState(false);
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

  return (
    <>
      {/*@ts-expect-error */}
      <FormCell
        editModeVisible={false}
        title={RVDic.Keywords}
        style={{ display: 'flex', flexGrow: 1 }}
        iconComponent={<TagIcon size="1.25rem" color={CV_GRAY} />}
      >
        <OnClickAway
          style={{}}
          onClick={() => {
            if (isFocused) return;
            setIsFocused(true);
          }}
        >
          <Styles.SelectedFieldItemContainer>
            {isFocused && isEditable ? (
              <CellContainer>
                <CreatableSelect
                  value={keywords}
                  isMulti
                  isDisabled={!Keywords?.Editable}
                  isClearable
                  placeholder={RVDic.Select}
                  onBlur={() => {
                    onSaveKeywords(keywords);
                    setIsFocused(false);
                  }}
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
            ) : keywords.length ? (
              keywords.map((keyword, id) => {
                return (
                  <Styles.SelectedFieldItem key={id}>
                    {keyword.label}
                  </Styles.SelectedFieldItem>
                );
              })
            ) : (
              <Styles.SelectedFieldItem muted>
                {RVDic.Select}
              </Styles.SelectedFieldItem>
            )}
          </Styles.SelectedFieldItemContainer>
        </OnClickAway>
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

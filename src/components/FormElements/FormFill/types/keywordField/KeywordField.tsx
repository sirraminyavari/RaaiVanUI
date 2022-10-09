import React, { useEffect, useState } from 'react';
import useWindow from 'hooks/useWindowContext';
import FormCell from '../../FormCell';
import TagIcon from 'components/Icons/TagIcon/TagIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import styled from 'styled-components';
import * as Styles from 'components/FormElements/ElementTypes/formElements.styles';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import SelectInputField from 'components/FormElements/ElementTypes/Select/SelectInputField';

type Props = {
  Keywords: {
    Value: { label: string; value: string | number }[];
    Editable?: boolean;
  };
  // isEditable?: boolean;
  onSaveKeywords: (keywords: Props['Keywords']['Value']) => void;
};

function KeywordField({ Keywords, onSaveKeywords }: Props) {
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

  if (!Keywords.Editable && keywords.length === 0) return <></>;
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
            <CellContainer>
              <SelectInputField
                options={keywords}
                selectedValue={keywords}
                isFocused={isFocused}
                isMulti
                isCreatable
                isEditable={Keywords?.Editable}
                isClearable
                onBlur={() => {
                  onSaveKeywords(keywords);
                  setIsFocused(false);
                }}
                onChange={(e) => {
                  setKeywords(e as Props['Keywords']['Value']);
                }}
                // styles={customStyles}
                components={{
                  Menu: () => null, // Remove menu
                  MenuList: () => null, // Remove menu list
                  DropdownIndicator: () => null, // Remove dropdown icon
                  IndicatorSeparator: () => null, // Remove separator
                }}
              />
            </CellContainer>
          </Styles.SelectedFieldItemContainer>
        </OnClickAway>
      </FormCell>
    </>
  );
}
KeywordField.displayName = 'KeywordField';

export default KeywordField;

const CellContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

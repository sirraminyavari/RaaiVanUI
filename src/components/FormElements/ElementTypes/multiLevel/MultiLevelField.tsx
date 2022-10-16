import { getChildNodes } from 'apiHelper/apiFunctions';
import {
  CV_FREEZED,
  CV_GRAY,
  CV_WHITE,
  TCV_WARM,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';
import { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { decodeBase64 } from 'helpers/helpers';
import * as Styles from '../formElements.styles';
import useWindow from 'hooks/useWindowContext';
import SelectInputField from '../Select/SelectInputField';

const normalizedOptions = (options) =>
  options?.nodes?.map((x) => {
    return { label: window.Base64.decode(x.Name), value: { ...x } };
  });

export interface IMultiLevelInputField {
  selectedValue?: { label: string; value: string | number }[];
  isEditable?: boolean;
  onAnyFieldChanged?: (
    elementId: string,
    event: { label: string; value: string | number }[],
    type: string,
    lastItem: boolean
  ) => void;
  isFocused?: boolean;
  isMulti?: boolean;
  className?: string;
  classNamePrefix?: string;
}

const MultiLevelInputField = ({
  elementId,
  onAnyFieldChanged,
  value,
  type,
  isEditable,
  isFocused,
  NodeType,
  Levels,
}) => {
  const { RVDic, RV_RTL } = useWindow();

  const [levels, setLevels] = useState<{ nodes: any[] }[]>([]);
  const [selectedLevels, setSelectedLevels] = useState(
    Levels.map(() => {
      return { ID: '', Name: '' };
    })
  );

  useEffect(() => {
    (async () => {
      const firstLevel = await getChildNodes(NodeType?.ID);
      const { Nodes } = firstLevel || {};
      setLevels(Levels.map((x, index) => (index === 0 ? { nodes: Nodes } : x)));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLevelSelected = useCallback(
    async (elementId, event, type, index) => {
      const selectedTemp = selectedLevels?.map((x, ind) =>
        ind === index
          ? { ID: event?.value?.NodeID, Name: event?.label }
          : ind > index
          ? { ID: '', Name: '' }
          : x
      );
      setSelectedLevels(selectedTemp);

      const exceptFirstLevel = await getChildNodes(
        NodeType?.ID,
        event?.value?.NodeID
      );
      const { Nodes } = exceptFirstLevel || {};

      if (index + 1 < Levels.length) {
        setLevels((levels) =>
          levels.map((x, ind) => (ind === index + 1 ? { nodes: Nodes } : x))
        );
      }
      onAnyFieldChanged &&
        onAnyFieldChanged(
          elementId,
          selectedTemp,
          type,
          index === Levels.length - 1
        );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Levels, selectedLevels, value]
  );

  //! RVDic i18n variables
  const RVDicSelect = RVDic.Select;

  return (
    <>
      {isFocused && isEditable ? (
        <SelectorContainer>
          {levels?.map((x, index) => {
            const { ID, Name } = value[index] || {};
            if (
              index === 0 ||
              (index > 0 && value[index - 1] && value[index - 1]?.ID)
            )
              return (
                <>
                  {!!normalizedOptions(x) || value[index] ? (
                    <>
                      <SelectContainer>
                        <SelectInputField
                          isEditable={isEditable as boolean}
                          isFocused={isFocused}
                          options={normalizedOptions(x)}
                          // styles={customStyles}
                          selectedValue={{
                            value: ID,
                            label: decodeBase64(Name),
                          }}
                          isSearchable
                          onChange={(event, triggeredAction) => {
                            if (triggeredAction.action === 'clear') {
                              const selectedTemp = selectedLevels?.map(
                                (x, ind) => {
                                  return ind === index
                                    ? { ID: undefined, Name: undefined }
                                    : x;
                                }
                              );
                              setSelectedLevels(selectedTemp);
                              onAnyFieldChanged &&
                                onAnyFieldChanged(
                                  elementId,
                                  selectedTemp,
                                  type
                                );
                              setLevels(selectedTemp);
                              // Clear happened
                            } else {
                              onLevelSelected(elementId, event, type, index);
                            }
                          }}
                        />
                      </SelectContainer>
                    </>
                  ) : null}
                </>
              );
            return null;
          })}
        </SelectorContainer>
      ) : (
        <Styles.SelectedFieldItemContainer
          muted={
            value.length === 0 ||
            value.length !== value.filter(({ ID }) => !!ID).length
          }
        >
          {value.length === value.filter(({ ID }) => !!ID).length &&
          value.length ? (
            value.map(({ Name, ID }, idx) => {
              return (
                <>
                  {idx !== 0 && (
                    <Styles.SelectedFieldItem chevron key={ID}>
                      <Styles.SelectedFieldChevron
                        dir={RV_RTL ? 'left' : 'right'}
                        small={false}
                      />
                    </Styles.SelectedFieldItem>
                  )}

                  <Styles.SelectedFieldItem key={ID}>
                    {decodeBase64(Name)}
                  </Styles.SelectedFieldItem>
                </>
              );
            })
          ) : (
            <Styles.SelectedFieldItem>{RVDicSelect}</Styles.SelectedFieldItem>
          )}
        </Styles.SelectedFieldItemContainer>
      )}
    </>
  );
};

export default MultiLevelInputField;

const SelectContainer = styled.div<{ noMargin?: boolean }>`
  display: flex;
  ${({ noMargin }) =>
    !noMargin &&
    `
  margin-inline: 1rem;
  `}
  align-items: center;
`;
const SelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -1rem 0 -1rem;
`;

const customStyles = {
  option: (styles, { isFocused, isSelected }, provided) => ({
    ...provided,
    color: isSelected ? TCV_WARM : CV_GRAY,
    margin: '0.35rem 0.5rem 0.35rem 0.5rem',
    cursor: 'pointer',
    // minWidth: '10rem',
    padding: '0.2rem 0.2rem 0.2rem 0.2rem',
    backgroundColor: isFocused && CV_FREEZED,
    maxWidth: '100%',
    overflowX: 'hidden',
    ':hover': {
      color: TCV_WARM,
      backgroundColor: CV_FREEZED,
      padding: '0.2rem 0.2rem 0.2rem 0.2rem',
    },
  }),
  control: (provided) => ({
    // none of react-select's styles are passed to <Control />
    ...provided,
    borderColor: CV_WHITE,
    backgroundColor: CV_WHITE,
    minWidth: '9rem',

    ':focus': {
      border: 0,
    },
  }),
  singleValue: (styles) => {
    return {
      ...styles,
      backgroundColor: TCV_VERY_TRANSPARENT,
      borderRadius: '0.5rem',
      padding: '0.3rem',
      minWidth: '9rem',
    };
  },
  menu: (provided) => ({
    ...provided,
    borderColor: TCV_VERY_TRANSPARENT,
    minWidth: '9rem',
  }),
};

import { getChildNodes } from 'apiHelper/apiFunctions';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { decodeBase64 } from 'helpers/helpers';
import * as Styles from '../formElements.styles';
import useWindow from 'hooks/useWindowContext';
import SelectInputField from '../Select/SelectInputField';

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

  const normalizedOptions = useMemo(
    () =>
      levels.map((level) =>
        level?.nodes?.map((node) => {
          return {
            label: window.Base64.decode(node.Name),
            value: node.ID || node.NodeID,
          };
        })
      ),
    [levels]
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
      console.log({ elementId, event, type, index });
      const selectedTemp = selectedLevels?.map((x, ind) =>
        ind === index
          ? { ID: event?.value, Name: event?.label }
          : ind > index
          ? { ID: '', Name: '' }
          : x
      );
      setSelectedLevels(selectedTemp);

      const exceptFirstLevel = await getChildNodes(NodeType?.ID, event?.value);
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
                  {!!normalizedOptions[index] || value[index] ? (
                    <>
                      <SelectContainer>
                        <SelectInputField
                          isEditable={isEditable as boolean}
                          isFocused={isFocused}
                          options={normalizedOptions[index]}
                          placeholder={`${RVDic.LevelSelect} ${index + 1}`}
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

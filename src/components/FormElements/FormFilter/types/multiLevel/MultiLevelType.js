/**
 * Renders a multi level filter.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { decodeBase64 } from 'helpers/helpers';
import * as Styled from '../types.styles';
import Button from 'components/Buttons/Button';
import Modal from 'components/Modal/Modal';
import MultiLevelInputField from 'components/FormElements/ElementTypes/multiLevel/MultiLevelField';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './MultiLevelType.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a multi level type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const MultiLevelType = ({ onChange, data = {}, value = [[]] }) => {
  const { RVDic, GlobalUtilities } = useWindow();

  const [initialValues, setInitialValues] = useState([[]]);

  useEffect(() => {
    return () => {
      if (value === undefined) setInitialValues([[]]);
    };
  }, [value]);

  const { NodeType, ElementID, Title, Levels } = useMemo(() => {
    const { ElementID, Title, Info } = data;
    const { NodeType, Levels } = GlobalUtilities.to_json(decodeBase64(Info));
    const nodeType = { ID: NodeType?.ID, Name: decodeBase64(NodeType?.Name) };

    return {
      ElementID,
      Title,
      Info,
      NodeType: nodeType,
      Levels,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onAnyFieldChanged = useCallback(
    (id, newValues, type, lastItem) => {
      const allMultilevelValues = initialValues.map((item, idx) => {
        if (idx !== type) return item;
        return newValues;
      });

      if (lastItem) {
        if (allMultilevelValues.length - 1 === type)
          allMultilevelValues[allMultilevelValues.length] = [];

        const normalizeMultilevelValues = allMultilevelValues.map(
          (multilevelItem) => {
            const multilevelItems = multilevelItem.map((item) => item?.Name);
            if (multilevelItems.length !== Levels.length) return '';
            return multilevelItems.filter((item) => item !== '').join(' ~ ');
          }
        );
        const JSONValue = {
          TextItems: normalizeMultilevelValues.filter((item) => item !== ''),
          Exact: true,
          Or: true,
        };
        onChange({
          id: ElementID,
          value: {
            Type: 'multilevel',
            Exact: true,
            Or: true,
            JSONValue: JSONValue,
          },
        });
      }
      setInitialValues(allMultilevelValues);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialValues]
  );

  const handleRemoveRow = (arrayIdx) => {
    setInitialValues((rows) => {
      const newRows = [...rows];
      if (rows.length) if (rows[arrayIdx]) delete newRows[arrayIdx];
      return newRows;
    });
  };

  const [modalStatus, setModalStatus] = useState(false);

  const toggleModalStatus = (inputState) => {
    setModalStatus((prevState) => inputState ?? !prevState);
  };
  return (
    <Styled.FilterContainer>
      <Styled.FilterTitle>{decodeBase64(Title)}</Styled.FilterTitle>
      <Button onClick={toggleModalStatus}>{RVDic?.Add}</Button>

      <Modal
        onClose={() => toggleModalStatus(false)}
        title={decodeBase64(Title)}
        show={modalStatus}
        contentWidth={'clamp(10rem,95%,50rem)'}
      >
        {initialValues.map((multiLevelValues, idx) => {
          return (
            <Styles.MultiLevelRow>
              <Styles.MultiLevelRemoveIcon
                onClick={() => handleRemoveRow(idx)}
                disabled={
                  initialValues.length - 1 === idx || initialValues.length <= 1
                }
              />

              <MultiLevelInputField
                NodeType={NodeType}
                Levels={Levels}
                elementId={ElementID}
                onAnyFieldChanged={onAnyFieldChanged}
                value={
                  multiLevelValues?.length === 0
                    ? Levels.map(() => ({ Name: '', ID: '' }))
                    : multiLevelValues
                }
                type={idx}
                isEditable
                isFocused
              />
            </Styles.MultiLevelRow>
          );
        })}
      </Modal>
    </Styled.FilterContainer>
  );
};

MultiLevelType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

MultiLevelType.displayName = 'FilterMultiLevelComponent';

export default MultiLevelType;

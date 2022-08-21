/**
 * Renders a node filter.
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Styled from '../types.styles';
import { decodeBase64 } from 'helpers/helpers';
import AtSignIcon from 'components/Icons/AtSignIcon/AtSign';
import useWindow from 'hooks/useWindowContext';
import SubjectSelectInputField from 'components/FormElements/ElementTypes/subjectSelect/SubjectSelectInputField';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a node type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const NodeType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title } = data || {}; //! Meta data to feed component.

  const { GlobalUtilities } = useWindow();

  const [items, setItems] = useState([]);
  const [resetValue, setResetValue] = useState(null);

  const handleSelectNodes = (nodes) => {
    setItems(nodes);
  };

  useEffect(() => {
    const id = ElementID;
    const nodeIds = items?.map((node) => node?.ID);
    const JSONValue = { GuidItems: nodeIds };
    //! Send back value to parent on select.
    onChange({
      id,
      value: {
        Type: 'node',
        GuidItems: !items?.length ? undefined : nodeIds.join('|'),
        Data: items,
        JSONValue: !items?.length ? undefined : JSONValue,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    if (value === undefined) {
      setResetValue(GlobalUtilities.random());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Styled.FilterContainer>
      <Styled.NodeTitleWrapper>
        <AtSignIcon />
        <Styled.FilterTitle style={{ margin: '0.5rem' }}>
          {decodeBase64(Title)}
        </Styled.FilterTitle>
      </Styled.NodeTitleWrapper>

      <SubjectSelectInputField
        value={items}
        onChange={handleSelectNodes}
        isEditable
      />
    </Styled.FilterContainer>
  );
};

NodeType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

NodeType.displayName = 'FilterNodeComponent';

export default NodeType;

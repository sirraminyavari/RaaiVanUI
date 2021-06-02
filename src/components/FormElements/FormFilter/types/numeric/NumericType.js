/**
 * Renders a numeric filter.
 */
import { useContext, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Inputs/Input';
import * as Styled from '../types.styles';
import { WindowContext } from 'context/WindowProvider';
import { decodeBase64 } from 'helpers/helpers';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a numeric type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const NumericType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title, Info } = data; //! Meta data to feed component.

  const fromInputRef = useRef();
  const toInputRef = useRef();
  const { RVDic } = useContext(WindowContext);
  const [from, setFrom] = useState(!!value ? value.FloatFrom : null);
  const [to, setTo] = useState(!!value ? value.FloatTo : null);

  //! Set 'from' number on input change.
  const onNumberFrom = (e) => {
    const floatFrom = e.target.value;
    if (!!to && +floatFrom > to) {
      setFrom(to);
      fromInputRef.current.value = to;
    } else {
      setFrom(floatFrom);
      fromInputRef.current.value = floatFrom;
    }
  };

  //! Set 'to' number on input change.
  const onNumberTo = (e) => {
    const floatTo = e.target.value;
    if (!!from && +floatTo < from) {
      setTo(from);
      toInputRef.current.value = from;
    } else {
      setTo(floatTo);
      toInputRef.current.value = floatTo;
    }
  };

  useEffect(() => {
    const id = ElementID;
    const floatFrom = !!from ? +from : null;
    const floatTo = !!to ? +to : null;
    const jsonValue =
      from || to ? { FloatFrom: floatFrom, FloatTo: floatTo } : null;

    //! Send back value to parent.
    onChange({
      id,
      value: {
        Tyep: 'numeric',
        FloatFrom: floatFrom,
        FloatTo: floatTo,
        JSONValue: jsonValue,
      },
    });
  }, [from, to]);

  useEffect(() => {
    if (value === undefined) {
      fromInputRef.current.value = null;
      toInputRef.current.value = null;
    } else {
      fromInputRef.current.value = value.FloatFrom;
      toInputRef.current.value = value.FloatTo;
    }
  }, [value]);

  return (
    <Styled.NumericContainer>
      <Styled.NumericTitle>{decodeBase64(Title)}</Styled.NumericTitle>
      <Styled.NumericWrapper>
        <Styled.NumberSpanTitle>{RVDic.From}</Styled.NumberSpanTitle>
        <Styled.Numeric>
          <Input
            style={{ width: '100%' }}
            onChange={onNumberFrom}
            type="number"
            ref={fromInputRef}
            max={to}
          />
        </Styled.Numeric>
      </Styled.NumericWrapper>
      <Styled.NumericWrapper>
        <Styled.NumberSpanTitle>{RVDic.To}</Styled.NumberSpanTitle>
        <Styled.Numeric>
          <Input
            style={{ width: '100%' }}
            onChange={onNumberTo}
            type="number"
            ref={toInputRef}
            min={from}
          />
        </Styled.Numeric>
      </Styled.NumericWrapper>
    </Styled.NumericContainer>
  );
};

NumericType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

NumericType.displayName = 'FilterNumericComponent';

export default NumericType;

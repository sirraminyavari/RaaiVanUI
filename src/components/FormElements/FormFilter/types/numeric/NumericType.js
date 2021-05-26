import { useRef } from 'react';
import Input from '../../../../Inputs/Input';
import * as Styled from '../types.styles';
import { WindowContext } from 'context/WindowProvider';
import { useContext, useEffect, useState } from 'react';
import { decodeBase64 } from 'helpers/helpers';

const NumericType = (props) => {
  const { RVDic } = useContext(WindowContext);
  const { onChange, data, value } = props;

  const [from, setFrom] = useState(!!value ? value.FloatFrom : null);
  const [to, setTo] = useState(!!value ? value.FloatTo : null);

  const fromInputRef = useRef();
  const toInputRef = useRef();

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
    const id = data.ElementID;
    const FloatFrom = !!from ? +from : null;
    const FloatTo = !!to ? +to : null;

    const JSONValue = from || to ? { FloatFrom, FloatTo } : null;

    onChange({
      id,
      value: { FloatFrom, FloatTo, JSONValue },
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
      <Styled.NumericTitle>{decodeBase64(data.Title)}</Styled.NumericTitle>
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

export default NumericType;

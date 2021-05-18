import Input from '../../../../Inputs/Input';
import * as Styled from '../types.styles';
import { WindowContext } from 'context/WindowProvider';
import { useContext, useEffect, useState } from 'react';

const NumericType = (props) => {
  const { RVDic } = useContext(WindowContext);
  const { onChange, data } = props;

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const onNumberFrom = (e) => {
    setFrom(e.target.value);
  };

  const onNumberTo = (e) => {
    setTo(e.target.value);
  };

  useEffect(() => {
    if (from && to) {
      onChange({
        type: 'Numeric',
        value: {
          FloatFrom: from,
          FloatTo: to,
        },
      });
    } else {
      onChange({
        type: 'Numeric',
        value: null,
      });
    }
  }, [from, to]);

  return (
    <Styled.NumericContainer>
      <Styled.NumericTitle>{data.Title}</Styled.NumericTitle>
      <Styled.NumericWrapper>
        <Styled.NumberSpanTitle>{RVDic.From}</Styled.NumberSpanTitle>
        <Styled.Numeric>
          <Input
            style={{ width: '100%' }}
            onChange={onNumberFrom}
            type="number"
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
          />
        </Styled.Numeric>
      </Styled.NumericWrapper>
    </Styled.NumericContainer>
  );
};

export default NumericType;

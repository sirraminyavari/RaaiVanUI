import * as Styles from '../simpleText/TextTypeMainSettingStyles';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import styled from 'styled-components';
import produce from 'immer';

const SampleState = ({ current, setFormObjects }) => {
  const { Sample } = current?.data?.Info || {};
  const handleSampStateChange = (value) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x?.id === current.id);
        _current.data.Info.Sample = value;
      })
    );
  };
  return (
    <Styles.FieldWrapper>
      <AnimatedInput
        value={Sample}
        onChange={handleSampStateChange}
        placeholder={'عبارت پیش‌فرض کادر پاسخ'}
      />
    </Styles.FieldWrapper>
  );
};
export const FieldWrapper = styled.div`
  max-width: 36rem;
  width: 100%;
`;
FieldWrapper.displayName = 'FieldWrapper';
export default SampleState;

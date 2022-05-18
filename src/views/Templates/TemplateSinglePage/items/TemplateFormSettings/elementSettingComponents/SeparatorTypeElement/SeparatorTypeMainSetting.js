import produce from 'immer';
import * as Styled from './SeparatorStyles';
import AnimatedTextArea from 'components/Inputs/AnimatedTextArea/AnimatedTextArea';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';

const SeparatorTypeMainSetting = ({ current, setFormObjects }) => {
  const { Title } = current?.data || {};
  const { SeparatorType, SeparatorText } = current?.data?.Info || {};

  const handleTitleChangeState = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x?.id === current?.id);
        _current.data.Title = e?.target?.value;
      })
    );
  };

  const handleSeparatorTextChangeState = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x?.id === current?.id);
        _current.data.Info.SeparatorText = encodeBase64(e?.target?.value);
      })
    );
  };

  return (
    <>
      {SeparatorType === 'text' && (
        <Styled.SeparatorTextInfoContainer>
          <Styled.FieldWrapper>
            <Styled.LargeSimpleInput
              placeholder={'عنوان جداکننده خود را اینجا بنویسید'}
              value={Title}
              onChange={handleTitleChangeState}
            />
          </Styled.FieldWrapper>
          <AnimatedTextArea
            autoresize={true}
            placeholder={'متن جداکننده خود را اینجا بنویسید'}
            value={decodeBase64(SeparatorText)}
            onChange={handleSeparatorTextChangeState}
          />
        </Styled.SeparatorTextInfoContainer>
      )}
    </>
  );
};
export default SeparatorTypeMainSetting;

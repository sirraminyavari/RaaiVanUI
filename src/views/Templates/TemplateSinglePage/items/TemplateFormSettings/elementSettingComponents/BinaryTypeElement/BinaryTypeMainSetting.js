import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';
import { FLEX_RCB } from 'constant/StyledCommonCss';
import produce from 'immer';

const BinaryTypeMainSetting = ({ current, setFormObjects }) => {
  const { data } = current || {};
  const { Yes, No } = data?.Info || {};

  const handleYesOption = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.Yes = e?.target?.value;
      })
    );
  };

  const handleNoOption = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.No = e?.target?.value;
      })
    );
  };

  return (
    <OptionContainer>
      <OptionItem>
        <Input value={Yes} onChange={handleYesOption} />
      </OptionItem>
      <Divider></Divider>
      <OptionItem>
        <Input value={No} onChange={handleNoOption} />
      </OptionItem>
    </OptionContainer>
  );
};
const OptionContainer = styled.div`
  max-width: 34rem;
  width: 100%;
  height: 3rem;
  border-radius: 0.7rem;
  border: 0.0625rem solid ${CV_DISTANT};
  ${FLEX_RCB};
  overflow: hidden;
`;

const OptionItem = styled.section`
  flex: 1;
  padding: 0 0.5rem;
`;
const Divider = styled.section`
  width: 0.0625rem;
  background-color: ${CV_DISTANT};
  height: 100%;
`;
const Input = styled.input.attrs({
  type: 'text',
})`
  border: none;
  width: 100%;
  outline: none;
  color: ${CV_GRAY};
`;
export default BinaryTypeMainSetting;

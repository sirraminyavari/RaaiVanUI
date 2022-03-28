import * as Styles from './TextTypeSideBoxSettingStyles';
import produce from 'immer';
import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import ToggleUniqueValueState from '../sharedItems/ToggleUniqueValueState';

const TextTypeSideBoxSetting = ({ current, setFormObjects }) => {
  const { type, data } = current || {};

  const handleMinCharStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x?.id === current?.id);
        _current.data.Info.min = e?.target?.value;
      })
    );
  };

  const handleMaxCharStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x?.id === current?.id);
        _current.data.Info.max = e?.target?.value;
      })
    );
  };

  return (
    <Styles.Container>
      <Styles.Row>
        <ToggleNecessaryState {...{ current, setFormObjects }} />
      </Styles.Row>

      {type !== 'paragraph' && (
        <Styles.Row>
          <ToggleUniqueValueState {...{ current, setFormObjects }} />
        </Styles.Row>
      )}

      {type !== 'email' && type !== 'url' && (
        <>
          <Styles.InputRowContainer>
            <Styles.ToggleRowTitle>
              {'حداقل تعداد کاراکتر'}
            </Styles.ToggleRowTitle>
            <Styles.Input
              value={data?.Info?.min}
              onChange={handleMinCharStateChange}
            />
          </Styles.InputRowContainer>

          <Styles.InputRowContainer>
            <Styles.ToggleRowTitle>
              {'حداکثر تعداد کاراکتر'}
            </Styles.ToggleRowTitle>
            <Styles.Input
              value={data?.Info?.max}
              onChange={handleMaxCharStateChange}
            />
          </Styles.InputRowContainer>
        </>
      )}
    </Styles.Container>
  );
};
export default TextTypeSideBoxSetting;

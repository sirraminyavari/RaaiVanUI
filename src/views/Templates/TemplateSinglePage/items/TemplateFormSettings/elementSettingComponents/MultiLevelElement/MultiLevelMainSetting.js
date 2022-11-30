import styled from 'styled-components';
import * as Styles from '../sharedItems/SharedStyles';
import produce from 'immer';
import Input from 'components/Inputs/Input';

const MultiLevelMainSetting = ({
  current,
  setFormObjects,
  loadMultiLevelChildNodes,
}) => {
  const { data, selectedNodeDepth } = current || {};

  const setMultiLevelNames = (idx) => (fieldName) => {
    console.log({ idx, fieldName });
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        if (idx === 0 || _current.data.Info.Levels[idx - 1])
          _current.data.Info.Levels[idx] = fieldName;
      })
    );
  };

  return (
    <>
      <Container>
        {data.Info.Levels.length === 0 && selectedNodeDepth === undefined ? (
          <TextFieldContainer>کلاسی انتخاب نشده است</TextFieldContainer>
        ) : (
          new Array(selectedNodeDepth || data.Info.Levels.length)
            .fill(null)
            .map((_, idx) => {
              return (
                <Styles.ToggleRow>
                  <Styles.ToggleRowTitle>{`عنوان سطح ${
                    idx + 1
                  }`}</Styles.ToggleRowTitle>
                  <div>
                    <Input
                      key={idx}
                      onChange={(event) =>
                        setMultiLevelNames(idx)(event.target.value)
                      }
                      value={data.Info.Levels[idx] || ''}
                    />
                  </div>
                </Styles.ToggleRow>
              );
            })
        )}
      </Container>
    </>
  );
};
export default MultiLevelMainSetting;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TextFieldContainer = styled.div`
  width: clamp(5rem, 100%, 15rem);
`;

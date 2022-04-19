import * as Styles from '../sharedItems/SharedStyles';
import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import produce from 'immer';
const RatingTypeSideBoxSetting = ({ current, setFormObjects }) => {
  const { type, data } = current || {};
  const { ViewType, min, max } = data?.Info || {};

  const handleMinStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.min = e?.target?.value;
      })
    );
  };

  const handleMaxStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.max = e?.target?.value;
      })
    );
  };

  const handleViewTypeStateChange = (state) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.ViewType = state;
      })
    );
  };

  return (
    <>
      <Styles.Row>
        <ToggleNecessaryState
          {...{ current, setFormObjects }}
        ></ToggleNecessaryState>
      </Styles.Row>

      <Styles.Row>
        <Styles.ToggleRowTitle>{'نوع نمایش'}</Styles.ToggleRowTitle>
        <Styles.OptionSelectorContainer>
          <Styles.OptionItem
            active={ViewType === 'stars'}
            onClick={() => handleViewTypeStateChange('stars')}
          >
            {'ستاره'}
          </Styles.OptionItem>
          <Styles.OptionItem
            active={ViewType === 'numeric'}
            onClick={() => handleViewTypeStateChange('numeric')}
          >
            {'عددی'}
          </Styles.OptionItem>
        </Styles.OptionSelectorContainer>
      </Styles.Row>

      {ViewType === 'numeric' && (
        <>
          <Styles.Row>
            <Styles.InputRowContainer>
              <Styles.ToggleRowTitle>{'کمترین مقدار'}</Styles.ToggleRowTitle>
              <Styles.Input value={min} onChange={handleMinStateChange} />
            </Styles.InputRowContainer>
          </Styles.Row>

          <Styles.Row>
            <Styles.InputRowContainer>
              <Styles.ToggleRowTitle>{'بیشترین مقدار'}</Styles.ToggleRowTitle>
              <Styles.Input value={max} onChange={handleMaxStateChange} />
            </Styles.InputRowContainer>
          </Styles.Row>
        </>
      )}
    </>
  );
};
export default RatingTypeSideBoxSetting;

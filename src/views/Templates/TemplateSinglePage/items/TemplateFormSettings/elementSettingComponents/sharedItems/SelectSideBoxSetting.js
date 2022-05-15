import ToggleNecessaryState from './ToggleNecessaryState';
import * as Styles from './SharedStyles';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import produce from 'immer';
import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import { FLEX_RSB } from 'constant/StyledCommonCss';

const SelectSideBoxSetting = ({ current, setFormObjects }) => {
  const { data } = current || {};
  const { addOption, ViewType } = data?.Info || {};

  const handleOptionStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x?.id === current?.id);
        _current.data.Info.addOption = e;
      })
    );
  };

  const handleViewTypeStateChange = (type) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x?.id === current?.id);
        _current.data.Info.ViewType = type;
      })
    );
  };
  return (
    <>
      <Styles.Row>
        <ToggleNecessaryState {...{ current, setFormObjects }} />
      </Styles.Row>

      <Styles.Row>
        <Styles.ToggleRow>
          <Styles.ToggleRowTitle>{'امکان افزودن گزینه'}</Styles.ToggleRowTitle>
          <ToggleButton value={addOption} onToggle={handleOptionStateChange} />
        </Styles.ToggleRow>
      </Styles.Row>

      <Styles.Row>
        <Styles.ToggleRowTitle>{'نوع نمایش'}</Styles.ToggleRowTitle>
        <OptionSelectorContainer>
          <OptionItem
            active={ViewType === 'sliding'}
            onClick={() => handleViewTypeStateChange('sliding')}
          >
            {'لیست کشویی'}
          </OptionItem>
          <OptionItem
            active={ViewType === 'optional'}
            onClick={() => handleViewTypeStateChange('optional')}
          >
            {'گزینه‌ای'}
          </OptionItem>
        </OptionSelectorContainer>
      </Styles.Row>
    </>
  );
};
const OptionSelectorContainer = styled.div`
  width: 100%;
  border: 0.0625rem solid ${CV_DISTANT};
  overflow: hidden;
  height: 3rem;
  border-radius: 0.8rem;
  ${FLEX_RSB};
  margin-top: 0.625rem;
`;

const OptionItem = styled.div`
  flex: 1;
  background-color: ${({ active }) => (!active ? CV_WHITE : TCV_DEFAULT)};
  color: ${({ active }) => (!active ? CV_GRAY : CV_WHITE)};
  text-align: center;
  line-height: 3rem;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
`;

export default SelectSideBoxSetting;

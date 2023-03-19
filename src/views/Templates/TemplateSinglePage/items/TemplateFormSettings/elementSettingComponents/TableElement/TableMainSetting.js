import { CV_DISTANT } from 'constant/CssVariables';
import * as Styles from '../sharedItems/SharedStyles';
import styled from 'styled-components';

const TableMainSetting = ({ current, setFormObjects, loadTableForms }) => {
  const { data } = current || {};

  return (
    <>
      <Container>
        {data.Info?.FormName ? (
          <Styles.ToggleRow>
            <Styles.ToggleRowTitle>کلاس انتخاب شده</Styles.ToggleRowTitle>

            {data.Info?.FormName}
          </Styles.ToggleRow>
        ) : (
          <Styles.ToggleRow>
            <Styles.ToggleRowTitle>کلاسی انتخاب نشده است</Styles.ToggleRowTitle>
          </Styles.ToggleRow>
        )}
      </Container>
    </>
  );
};
export default TableMainSetting;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TextFieldContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 1rem;
  ${({ muted }) =>
    muted &&
    `
  color: ${CV_DISTANT};
  `}
`;

const TextField = styled.span`
  ${({ muted }) =>
    muted &&
    `
  color: ${CV_DISTANT};
  `}
`;

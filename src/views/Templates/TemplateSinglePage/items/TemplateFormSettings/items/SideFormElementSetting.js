import styled from 'styled-components';
import { FLEX_CCC } from 'constant/StyledCommonCss';
import { CV_DISTANT } from 'constant/CssVariables';

import { getSideFormElementSetting } from '../elementSettingComponents/ComponentsLookupTable';
import { useMemo } from 'react';

const SideFormElementSetting = ({
  focusedObject,
  formObjects,
  setFormObjects,
}) => {
  const component = useMemo(() => {
    const x = formObjects?.find((x) => x?.id === focusedObject) || null;
    return focusedObject !== null ? (
      <Container>
        {getSideFormElementSetting({
          key: x?.type,
          props: { current: x, setFormObjects },
        })}
      </Container>
    ) : (
      <PlaceHolder>{'هنوز فیلدی را انتخاب نکرده‌اید :('}</PlaceHolder>
    );
  }, [focusedObject, formObjects]);
  return <>{component}</>;
};

const Container = styled.div`
  height: 17rem;
  padding: 1.5rem;
`;

const PlaceHolder = styled(Container)`
  ${FLEX_CCC};
  color: ${CV_DISTANT};
  font-width: 300;
`;
export default SideFormElementSetting;

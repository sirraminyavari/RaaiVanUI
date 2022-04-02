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
    if (focusedObject) {
      const el = formObjects?.find((x) => x?.id === focusedObject) || null;
      return (
        <Container>
          {getSideFormElementSetting({ current: el, setFormObjects })}
        </Container>
      );
    }
  }, [focusedObject, formObjects]);

  if (!focusedObject)
    return <PlaceHolder>{'هنوز فیلدی را انتخاب نکرده‌اید :('}</PlaceHolder>;

  return <>{component}</>;
};

const Container = styled.div`
  min-height: 10rem;
  padding: 1.5rem;
`;

const PlaceHolder = styled(Container)`
  ${FLEX_CCC};
  color: ${CV_DISTANT};
  font-width: 300;
`;
export default SideFormElementSetting;

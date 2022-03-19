import styled from 'styled-components';
import { FLEX_CCC } from 'constant/StyledCommonCss';
import { CV_DISTANT } from 'constant/CssVariables';
import { useTemplateFormContext } from '../TemplateFormContext';
import { getSideFormElementSetting } from '../elementSettingComponents/ComponentsLookupTable';

const SideFormElementSetting = () => {
  const { focusedObject, formObjects } = useTemplateFormContext();
  if (focusedObject !== null) {
    const x = formObjects?.find((x) => x?.id === focusedObject);
    const settingComponent = getSideFormElementSetting({
      key: x?.type,
      props: x,
    });
    console.log(settingComponent);
    return <Container>{settingComponent}</Container>;
  }
  return <PlaceHolder>{'هنوز فیلدی را انتخاب نکرده‌اید :('}</PlaceHolder>;
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

import CMTemplateAdvancedSetting from './CMTemplateAdvancedSetting';
import RVTemplateAdvancedSetting from './RVTemplateAdvancedSetting';

const TemplateAdvancedSettings = () => {
  const { RVDic, RV_RTL, RVGlobal } = window;

  return RVGlobal?.SAASBasedMultiTenancy ? (
    <CMTemplateAdvancedSetting />
  ) : (
    <RVTemplateAdvancedSetting />
  );
};
export default TemplateAdvancedSettings;

import CMTemplateAdvancedSetting from './CMTemplate/CMTemplateAdvancedSetting';
import RVTemplateAdvancedSetting from './RVTemplate/RVTemplateAdvancedSetting';

const TemplateAdvancedSettings = () => {
  const { RVDic, RV_RTL, RVGlobal } = window;

  return RVGlobal?.SAASBasedMultiTenancy ? (
    <CMTemplateAdvancedSetting />
  ) : (
    <RVTemplateAdvancedSetting />
  );
};
export default TemplateAdvancedSettings;

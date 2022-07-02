import { TemplateItemProvider } from './TemplateItemProvider';
import TemplateItems from './TemplateItems';

const TemplateItemSettings = () => {
  return (
    <TemplateItemProvider>
      <TemplateItems />
    </TemplateItemProvider>
  );
};
export default TemplateItemSettings;

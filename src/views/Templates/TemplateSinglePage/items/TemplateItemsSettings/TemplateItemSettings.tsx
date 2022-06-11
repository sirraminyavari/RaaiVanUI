import { useEffect } from 'react';
import { useTemplateContext } from '../../TemplateProvider';
import api from 'apiHelper';

const TemplateItemSettings = (): JSX.Element => {
  const context = useTemplateContext();

  useEffect((): void => {
    const fetchData = async () => {};
  }, []);
  console.log(context);

  return <div>template items settings</div>;
};
export default TemplateItemSettings;

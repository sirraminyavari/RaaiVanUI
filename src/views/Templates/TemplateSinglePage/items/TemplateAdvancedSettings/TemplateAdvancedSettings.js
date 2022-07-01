import CMTemplateAdvancedSetting from './CMTemplateAdvancedSetting';
import RVTemplateAdvancedSetting from './RVTemplateAdvancedSetting';
import React, { useEffect, useState } from 'react';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import api from 'apiHelper';
import { useTemplateContext } from '../../TemplateProvider';

export const AdvandcedContenxt = React.createContext({});

const TemplateAdvancedSettings = () => {
  const { RVDic, RV_RTL, RVGlobal } = window;
  const [loading, setLoading] = useState(true);
  const { NodeTypeID } = useTemplateContext();
  const [nodeType, setNodeType] = useState();

  useEffect(() => {
    const loadItem = async () => {
      const item = await api?.CN?.getNodeTypes({
        NodeTypeIDs: [NodeTypeID],
      });
      setNodeType(item);
      setLoading(false);
    };
    loadItem();
  }, []);

  if (loading) return <LogoLoader />;

  return (
    <AdvandcedContenxt.Provider
      value={{
        nodeType,
      }}
    >
      {RVGlobal?.SAASBasedMultiTenancy ? (
        <CMTemplateAdvancedSetting />
      ) : (
        <RVTemplateAdvancedSetting />
      )}
      ;
    </AdvandcedContenxt.Provider>
  );
};
export default TemplateAdvancedSettings;

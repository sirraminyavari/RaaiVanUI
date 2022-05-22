import { useTemplateContext } from '../../../TemplateProvider';
import { useState } from 'react';
import {
  disableExtension,
  enableExtension,
} from '../../../../../../apiHelper/ApiHandlers/CNAPI_ServiceSettings';
import InfoToast from '../../../../../../components/toasts/info-toast/InfoToast';

const useRVSideContentSetting = ({}) => {
  const { RVDic } = window;
  const { NodeTypeID, Extensions, ...rest } = useTemplateContext();

  console.log(Extensions);

  const [Browser, setBrowser] = useState(
    Extensions.some((e) => e.Extension === 'Browser' && !e.Disabled)
  );

  const handleBrowserState = async (state) => {
    setBrowser(state);
    const result = await toggleExtension(state, 'Wiki');
    if (!result) setBrowser(!state);
  };

  const toggleExtension = async (state, Name) => {
    if (state) {
      const { ErrorText } = await enableExtension({
        NodeTypeID,
        Name,
      });

      if (ErrorText) {
        InfoToast({
          type: 'error',
          autoClose: true,
          message: RVDic?.MSG[ErrorText] || ErrorText,
        });
        return false;
      }
    } else {
      const { ErrorText } = await disableExtension({
        NodeTypeID,
        Name,
      });
      if (ErrorText) {
        InfoToast({
          type: 'error',
          autoClose: true,
          message: RVDic?.MSG[ErrorText] || ErrorText,
        });
        return false;
      }
    }
    return true;
  };

  return {
    Extensions,
    Browser,
    handleBrowserState,
  };
};
export default useRVSideContentSetting;

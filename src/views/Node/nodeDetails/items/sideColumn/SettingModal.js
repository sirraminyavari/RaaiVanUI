/**
 * Renders setting modal content for node page side.
 */
import { useState, useContext } from 'react';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import Toggle from 'components/Toggle/Toggle';
import { C_GRAY_DARK } from 'constant/Colors';
import { SideContext } from './SideColumn';
import { setNodeSearchability } from 'apiHelper/apiFunctions';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import useWindow from 'hooks/useWindowContext';

const Setting = () => {
  const { RVDic } = useWindow();
  const { nodeDetails, getNodeDetails } = useContext(SideContext);
  const { Searchable, NodeID } = nodeDetails || {};

  const [isSearchable, setIsSearchable] = useState(Searchable?.Value);
  const [accessLink, setAccessLink] = useState(false);

  /**
   * Make an info toast.
   * @param {string} message -Toast message
   * @param {('info' | 'error')} type -Toast type
   * @returns
   */
  const makeInfoToast = (message, type) => {
    return InfoToast({
      autoClose: true,
      type,
      message,
      toastId: `node-page-info-${NodeID}`,
    });
  };

  //! Toggle show on search option.
  const handleShowOnSearch = (toggleValue) => {
    setIsSearchable(toggleValue);
    setNodeSearchability(NodeID, toggleValue)
      .then((response) => {
        //! Update the node details object if operation was successfull.
        if (response?.Succeed) {
          getNodeDetails();
        }

        //! Let user know if there was some error.
        if (response?.ErrorText) {
          setIsSearchable((searchable) => !searchable);
          //! Dispatch error toast.
          const errorMSG =
            RVDic.MSG[response?.ErrorText] || response?.ErrorText;
          makeInfoToast(errorMSG, 'error');
        }
      })
      .catch((error) => {
        setIsSearchable((searchable) => !searchable);
        //! Dispatch error toast.
        makeInfoToast(error?.message, 'error');
      });
  };

  //! Toggle access link option.
  const handleAccessLink = (toggleValue) => {
    setAccessLink(toggleValue);
  };

  return (
    <Styled.SettingContainer>
      <Toggle
        disable={!Searchable?.Editable}
        onToggle={handleShowOnSearch}
        isChecked={isSearchable}
        title="نمایش آیتم در نتایج جستجو"
        titleClass={`${C_GRAY_DARK} side-setting-toggle`}
      />
      <Toggle
        disable={true}
        onToggle={handleAccessLink}
        isChecked={accessLink}
        title="ایجاد لینک دسترسی عمومی به آیتم (به زودی)"
        titleClass={`${C_GRAY_DARK} side-setting-toggle`}
      />
    </Styled.SettingContainer>
  );
};

export default Setting;

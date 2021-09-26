import { useState } from 'react';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import Toggle from 'components/Toggle/Toggle';
import { C_GRAY_DARK } from 'constant/Colors';

const Setting = () => {
  const [showOnSearch, setShowOnSearch] = useState(false);
  const [accessLink, setAccessLink] = useState(false);

  const handleShowOnSearch = (toggleValue) => {
    setShowOnSearch(toggleValue);
  };

  const handleAccessLink = (toggleValue) => {
    setAccessLink(toggleValue);
  };

  return (
    <Styled.SettingContainer>
      <Toggle
        onToggle={handleShowOnSearch}
        isChecked={showOnSearch}
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

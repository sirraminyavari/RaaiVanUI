/**
 * Renders setting section for node page side.
 */
import { useContext } from 'react';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import DocItemHeader from './DocItemHeader';
import { SideContext } from './SideColumn';

const { RVDic } = window;
const SideSetting = () => {
  const { setSideModal } = useContext(SideContext);

  //! Show setting modal on click.
  const handleSettingClick = () => {
    setSideModal((prev) => ({
      ...prev,
      isShown: true,
      title: RVDic.PublishSettings,
      content: 'setting',
    }));
  };

  return (
    <Styled.DocSettingContainer onClick={handleSettingClick}>
      <DocItemHeader title={RVDic.PublishSettings} />
      <Styled.DocSettingTitle>{RVDic.Published}</Styled.DocSettingTitle>
    </Styled.DocSettingContainer>
  );
};

export default SideSetting;

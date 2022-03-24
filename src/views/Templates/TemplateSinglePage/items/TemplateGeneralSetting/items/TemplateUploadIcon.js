import * as Styles from './TemplateUploadIconStyles';
import ImageIcon from 'components/Icons/ImageIcon/ImageIcon';
import { CV_RED, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import PencilIcon from 'components/Icons/EditIcons/Pencil';
import TabView from 'components/TabView/TabView';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { useState } from 'react';
import Uploader from './Uploader';
import EmojiPicker from 'components/EmojiPicker/EmojiPicker';
import { TabViewContentWrapper } from './TemplateUploadIconStyles';

const TemplateUploadIcon = () => {
  const { RV_RTL } = window;
  const [openState, setOpenState] = useState(false);

  const open = () => setOpenState(true);

  const close = () => setOpenState(false);

  return (
    <Styles.Container>
      <Styles.Icon>
        <ImageIcon size={54} />

        <Styles.AddButton rtl={RV_RTL} onClick={open}>
          <PencilIcon color={CV_WHITE} size={18} />
        </Styles.AddButton>

        {openState && (
          <Styles.UploaderLayout>
            <TabView>
              <TabView.Item label={'اموجی'}>
                <Styles.TabViewContentWrapper>
                  <EmojiPicker />
                </Styles.TabViewContentWrapper>
              </TabView.Item>
              <TabView.Item label={'بارگذاری تصویر'}>
                <Styles.TabViewContentWrapper>
                  <Uploader />
                </Styles.TabViewContentWrapper>
              </TabView.Item>

              <TabView.Action>
                <Styles.CloseButton onClick={close}>
                  <CloseIcon outline={true} size={20} />
                </Styles.CloseButton>
              </TabView.Action>
            </TabView>
          </Styles.UploaderLayout>
        )}
      </Styles.Icon>
    </Styles.Container>
  );
};

export default TemplateUploadIcon;

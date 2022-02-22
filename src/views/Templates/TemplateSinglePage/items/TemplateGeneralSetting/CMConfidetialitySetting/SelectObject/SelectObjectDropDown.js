import TabView from 'components/TabView/TabView';
import {
  Button,
  CloseButton,
  DropDown,
  ResizeButton,
} from './SelectObjectStyle';
import ResizeIcon from 'components/Icons/ResizeIcon/ResizeIcon';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { createRef, useState } from 'react';
import useOutsideClick from 'hooks/useOutsideClick';

const SelectObjectDropDown = ({}) => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [selectedTab, setSelectedTab] = useState('members');
  const dropDownEl = createRef();

  useOutsideClick(() => {
    setOpenDropDown(false);
  }, dropDownEl);

  return (
    <>
      <Button onClick={() => setOpenDropDown(true)}>{'انتخاب اعضا'}</Button>

      {openDropDown && (
        <DropDown ref={dropDownEl}>
          <TabView onSelect={(key) => setSelectedTab(key)}>
            <TabView.Item label={'اعضا'} key="members">
              <div>{'members'}</div>
            </TabView.Item>

            <TabView.Item label={'گروه‌ها'} key="groups">
              <div>{'groups'}</div>
            </TabView.Item>

            <TabView.Action>
              <ResizeButton onClick={() => setOpenDropDown(false)}>
                <ResizeIcon size={17} />
              </ResizeButton>

              <CloseButton onClick={() => setOpenDropDown(false)}>
                <CloseIcon outline={true} size={22} />
              </CloseButton>
            </TabView.Action>
          </TabView>
        </DropDown>
      )}
    </>
  );
};
export default SelectObjectDropDown;

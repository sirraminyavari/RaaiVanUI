import {
  Button,
  Container,
  DropDown,
  CloseButton,
  ResizeButton,
} from './SelectObjectStyle';
import { createRef, useState } from 'react';
import TabView from 'components/TabView/TabView';
import useOutsideClick from 'hooks/useOutsideClick';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import ResizeIcon from 'components/Icons/ResizeIcon/ResizeIcon';

export const SelectObject = () => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const ref = createRef();

  useOutsideClick(() => {
    setOpenDropDown(false);
  }, ref);

  return (
    <Container>
      <Button onClick={() => setOpenDropDown(true)}>{'انتخاب اعضا'}</Button>

      {openDropDown && (
        <DropDown ref={ref}>
          <TabView>
            <TabView.Item label={'اعضا'}>
              <div>{'members'}</div>
            </TabView.Item>

            <TabView.Item label={'گروه‌ها'}>
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
    </Container>
  );
};
export default SelectObject;

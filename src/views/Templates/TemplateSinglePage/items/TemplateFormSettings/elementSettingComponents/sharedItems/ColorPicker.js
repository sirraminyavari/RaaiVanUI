import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import { IoAdd } from 'react-icons/io5';
import { FLEX_CCC } from 'constant/StyledCommonCss';
import { useEffect, useState } from 'react';
import TabView from 'components/TabView/TabView';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

const ColorPicker = ({ color, onSelect }) => {
  const [open, setOpen] = useState(false);
  const colors = [
    '#FF0000',
    '#DF234F',
    '#DF237A',
    '#DF2394',
    '#DF23A8',
    '#DF23B9',
    '#DF23D9',
    '#C623DF',
    '#B423DF',
    '#23C5DF',
    '#23BBDF',
    '#23ADDF',
    '#23A1DF',
    '#2388DF',
    '#236EDF',
    '#2331DF',
    '#6223DF',
    '#8623DF',
    '#23DFDF',
    '#23DFD9',
    '#23DFC0',
    '#23DFA7',
    '#23DF87',
    '#23DF69',
    '#23DF49',
    '#23DF36',
    '#4FDF23',
    '#FAFAF8',
    '#FFFFDC',
    '#FFFF7C',
    '#EDF34D',
    '#F5FF00',
    '#E7EE1B',
    '#D8DF23',
    '#DFC023',
    '#B9DF23',
  ];

  const handleColorSelect = (e, color) => {
    e?.stopPropagation();
    onSelect && onSelect(color);
    setOpen(false);
  };

  const close = (e) => {
    e?.stopPropagation();
    setOpen(false);
  };

  return (
    <Container color={color} onClick={() => setOpen(true)}>
      {color === '' && <IoAdd size={24} />}
      {open && (
        <PickerLayout>
          <TabView height={2.5}>
            <TabView.Item label="رنگ">
              <ColorsGrid>
                {colors.map((c, i) => {
                  return (
                    <ColorItem
                      key={i}
                      color={c}
                      onClick={(e) => handleColorSelect(e, c)}
                    />
                  );
                })}
              </ColorsGrid>
            </TabView.Item>

            <TabView.Action>
              <CloseButton onClick={(e) => close(e)}>
                <CloseIcon outline={true} size={20} />
              </CloseButton>
            </TabView.Action>
          </TabView>
        </PickerLayout>
      )}
    </Container>
  );
};
const Container = styled.div`
  position: relative;
  ${FLEX_CCC};
  height: 2rem;
  width: 2rem;
  border-radius: 100%;
  border: solid 0.0625rem ${CV_DISTANT};
  cursor: pointer;
  color: ${TCV_DEFAULT};
  background-color: ${({ color }) => (color !== '' ? color : 'transparent')};
`;

const PickerLayout = styled.div`
  position: absolute;
  left: 0.25rem;
  bottom: 0.5rem;
  background-color: ${CV_WHITE};
  border-radius: 0.8rem;
  box-shadow: 1px 5px 20px #0000001f;
  width: 19.5rem;
  z-index: 1;
`;

const ColorsGrid = styled.div`
  direction: ltr;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-gap: 0.5rem;
`;

const ColorItem = styled.div`
  background-color: ${({ color }) => color};
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
  cursor: pointer;
`;

const CloseButton = styled.button`
  ${FLEX_CCC};
  height: 2.5rem;
  width: 2.5rem;
  color: ${CV_RED};
  border: none;
  outline: none;
  cursor: pointer;
`;
export default ColorPicker;

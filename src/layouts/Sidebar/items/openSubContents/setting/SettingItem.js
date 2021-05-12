import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import * as Styled from '../../../Sidebar.styles';
import iconList from './iconList';

const SettingItem = ({ item }) => {
  const dispatch = useDispatch();
  const { setSidebarContent } = themeSlice.actions;

  //! Change sidebar content on click.
  const onSettingItemClick = useCallback(() => {
    dispatch(setSidebarContent({ current: item.icon, prev: 'setting' }));
  }, []);

  return (
    <Styled.SettingItemWrapper onClick={onSettingItemClick}>
      {iconList[item.icon]({ size: 20 })}
      <Styled.SettingItemTitle>{item.title}</Styled.SettingItemTitle>
    </Styled.SettingItemWrapper>
  );
};

export default SettingItem;

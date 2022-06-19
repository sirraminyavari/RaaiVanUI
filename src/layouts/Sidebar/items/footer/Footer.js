/**
 * Renders footer component for sidebar.
 */
import { memo } from 'react';
import { useSelector } from 'react-redux';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import ManageButton from './ManageButton';
import { MAIN_CONTENT } from 'constant/constants';
import { selectTheme } from 'store/slice/theme/selectors';

const SidebarFooter = () => {
  const { sidebarContent } = useSelector(selectTheme);

  const isMainContent = sidebarContent.current === MAIN_CONTENT;

  return (
    <>
      {isMainContent && (
        <Styled.SidebarFooter>
          <ManageButton />
        </Styled.SidebarFooter>
      )}
    </>
  );
};

export default memo(SidebarFooter);

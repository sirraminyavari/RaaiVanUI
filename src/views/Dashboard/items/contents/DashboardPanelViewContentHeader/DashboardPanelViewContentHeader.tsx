import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import SearchInput from 'components/Inputs/SearchInput';
import * as Styles from './DashboardPanelViewContentHeader.styles';

export interface IDashboardPanelViewContentHeader {
  title?: string;
}

const DashboardPanelViewContentHeader = ({
  title,
}: IDashboardPanelViewContentHeader): JSX.Element => {
  const breadcrumbItems = [
    {
      id: '1',
      title: 'کارتابل',
      linkTo: '/dashboard',
    },
    {
      id: '2',
      title: 'پروژه',
      linkTo: '/dashboard',
    },
    {
      id: '3',
      title: 'انجام شده',
      linkTo: '/dashboard',
    },
  ];

  return (
    <>
      <Styles.DashboardPanelViewContentHeaderContainer>
        <Breadcrumb items={breadcrumbItems} />
        <Styles.DashboardPanelViewContentHeaderTitleContainer>
          <Styles.DashboardPanelViewContentHeaderTitleImage src="/images/Preview.png" />
          <Styles.DashboardPanelViewContentHeaderTitle>
            {title}
          </Styles.DashboardPanelViewContentHeaderTitle>
          <Styles.DashboardPanelViewContentHeaderItemsCount>
            89 مورد
          </Styles.DashboardPanelViewContentHeaderItemsCount>
        </Styles.DashboardPanelViewContentHeaderTitleContainer>
        <Styles.DashboardPanelViewContentHeaderSearchContainer>
          {/* @ts-expect-error */}
          <SearchInput placeholder="جستجو در اقدام‌های انجام شده پروژه" />
        </Styles.DashboardPanelViewContentHeaderSearchContainer>
      </Styles.DashboardPanelViewContentHeaderContainer>
    </>
  );
};

DashboardPanelViewContentHeader.displayName = 'DashboardPanelViewContentHeader';

export default DashboardPanelViewContentHeader;

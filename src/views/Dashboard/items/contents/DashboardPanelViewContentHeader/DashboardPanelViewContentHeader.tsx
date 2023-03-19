import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import SearchInput from 'components/Inputs/SearchInput';
import useWindowContext from 'hooks/useWindowContext';
import { useMemo } from 'react';
import * as Styles from './DashboardPanelViewContentHeader.styles';

export interface IDashboardPanelViewContentHeader {
  title?: string;
  imageURL?: string;
  count?: number;
  type: 'membershipRequest' | 'toBeDone' | 'done';
}

const DashboardPanelViewContentHeader = ({
  title = '',
  type,
  count = 0,
  imageURL,
}: IDashboardPanelViewContentHeader): JSX.Element => {
  const { RVDic } = useWindowContext();

  //TODO RVDic initialization !!
  const RVDicDone = RVDic.Done;
  const RVDicMembershipRequest = RVDic.MembershipRequest;
  const RVDicDashboard = RVDic.Dashboard;
  const RVDicNItems = RVDic.NItems;
  const breadcrumbItems = useMemo(() => {
    const breadcrumbTemp: {
      id: string;
      title: string;
      linkTo?: string;
    }[] = [
      {
        id: '1',
        title: RVDicDashboard,
        linkTo: '/dashboard',
      },
    ];

    switch (type) {
      case 'toBeDone':
        breadcrumbTemp.push(
          {
            id: '2',
            title: title,
            linkTo: '/dashboard',
          },
          {
            id: '3',
            title: 'انجام دادنی',
          }
        );
        break;
      case 'done':
        breadcrumbTemp.push(
          {
            id: '2',
            title: title,
            linkTo: '/dashboard',
          },
          {
            id: '3',
            title: RVDicDone,
          }
        );
        break;
      default:
        breadcrumbTemp.push({
          id: '2',
          title: RVDicMembershipRequest,
        });
        break;
    }
    return breadcrumbTemp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, title]);

  return (
    <>
      <Styles.DashboardPanelViewContentHeaderContainer>
        <Breadcrumb items={breadcrumbItems} />
        <Styles.DashboardPanelViewContentHeaderTitleContainer>
          {imageURL && (
            <Styles.DashboardPanelViewContentHeaderTitleImage src={imageURL} />
          )}
          <Styles.DashboardPanelViewContentHeaderTitle>
            {title}
          </Styles.DashboardPanelViewContentHeaderTitle>
          <Styles.DashboardPanelViewContentHeaderItemsCount>
            {RVDicNItems.replace('[n]', count)}
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

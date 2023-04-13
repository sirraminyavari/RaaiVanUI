/**
 * here we make the top bar for NodeDetails
 */
import APIHandler from 'apiHelper/APIHandler';
// import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Button from 'components/Buttons/Button';
import OutLineBookmarkIcon from 'components/Icons/BookmarkIcon/OutlineBookmark';
import DocIcon from 'components/Icons/DocIcon';
import Eye from 'components/Icons/Eye';
import { CV_DISTANT } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import TopBarLoadingSkelton from '../TopBarLoadingSkelton';
import Creators from './Creators';
import * as Styles from './TopBar.style';
import { useThemeSlice } from 'store/slice/theme';
import { selectTheme } from 'store/slice/theme/selectors';
import useWindow from 'hooks/useWindowContext';
import {
  ArrowCircleSvg,
  BookmarkSvg,
  ChatBubbleSvg,
  ReaderSvg,
  RowItem,
  RVSizeProp,
  RVVariantProp,
  Typography,
  Breadcrumb,
  FileTrayFullSvg,
} from '@cliqmind/rv-components';
import ShadowButton from 'components/Buttons/ShadowButton';

const likeNode = new APIHandler('CNAPI', 'Like');
const unlikeNode = new APIHandler('CNAPI', 'Unlike');

export type ITopBar = {
  nodeDetails: {
    VisitsCount: number;
    LikeStatue?: boolean;
    [key: string]: any;
  };
  // nodeType;
  // onApplyNodeType: () => void;
  onSideColumnClicked: (sideColumnStatus: boolean | undefined) => void;
  sideColumn?: boolean;
  hierarchy?: any;
  newNode?: boolean;
  contribution?: boolean;
};

const TopBar = ({
  nodeDetails,
  onSideColumnClicked,
  sideColumn,
  hierarchy,
  newNode,
  contribution,
}: ITopBar) => {
  const {
    actions: { toggleSidebar },
  } = useThemeSlice();

  const { VisitsCount } = nodeDetails || {};

  const isTabletOrMobile = DimensionHelper().isTabletOrMobile;
  const [sideDetailsHover, setSideDetailsHover] = useState(false);
  const [bookmarkStatus, setBookmarkStatus] = useState(
    nodeDetails?.LikeStatue ? 'liked' : 'disLiked'
  );

  const { RVDic } = useWindow();

  const dispatch = useDispatch();

  const { selectedTeam: selectedApp } = useSelector(selectTheme);
  const teamName = selectedApp?.name;

  //TODO RVDic !
  const RVDicBookmarkToastMsg = '.این آیتم به لیست آیتم‌های نشان‌شده اضافه شد';

  const extendedHierarchy = hierarchy?.map((level) => ({
    id: level?.NodeTypeID,
    title: decodeBase64(level?.TypeName),
    linkTo: `/classes/${level?.NodeTypeID}`,
  }));

  const { NodeType, Name } = nodeDetails || {};

  const breadcrumbItems = [
    { id: selectedApp?.id, title: teamName, linkTo: '/classes' },

    {
      title: decodeBase64(
        newNode ? nodeDetails?.Title : NodeType?.Value[0]?.Name
      ),
      linkTo: `/classes/${
        newNode ? nodeDetails?.NodeID : NodeType?.Value[0]?.ID
      }`,
    },
    ...(!newNode
      ? [
          {
            title: decodeBase64(Name?.Value),
            linkTo: `/node/${nodeDetails?.NodeID}`,
          },
        ]
      : []),
    ...extendedHierarchy,
  ];

  const onSideDetailsClick = () => {
    setSideDetailsHover(!sideDetailsHover);
    onSideColumnClicked(!sideColumn);
    dispatch(toggleSidebar(false));
  };

  const onBookmarkPressed = () => {
    if (bookmarkStatus === 'liked') {
      unlikeNode.fetch({ NodeID: nodeDetails?.NodeID }, (response) => {
        if (
          response?.Succeed &&
          response.Succeed === 'OperationCompletedSuccessfully'
        ) {
          setBookmarkStatus('disLiked');
        }
      });
    } else if (bookmarkStatus === 'disLiked') {
      likeNode.fetch({ NodeID: nodeDetails?.NodeID }, (response) => {
        if (
          response?.Succeed &&
          response.Succeed === 'OperationCompletedSuccessfully'
        ) {
          setBookmarkStatus('liked');
          //@ts-ignore
          alert(RVDicBookmarkToastMsg, { type: 'success' });
        }
      });
    }
  };

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      {nodeDetails ? (
        <Styles.NodeTopBarContainer>
          <Styles.NodeTopBarTopRow isTabletOrMobile={isTabletOrMobile}>
            <Styles.NodeTopBarBreadcrumbWrapper>
              {/* <Breadcrumb items={breadcrumbItems} /> */}
              <Breadcrumb
                Icon={FileTrayFullSvg}
                variant={RVVariantProp.white}
                size={RVSizeProp.medium}
                routeLinks={[
                  { label: 'Citations', path: '' },
                  {
                    label: 'NodePage',
                    path: '',
                    adjacentPaths: [
                      { label: 'Citations', path: '' },
                      { label: 'Citations', path: '' },
                      { label: 'Citations', path: '' },
                    ],
                  },
                ]}
              />
            </Styles.NodeTopBarBreadcrumbWrapper>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '1rem',
              }}
            ></div>
            <Styles.NodeTopBarCounterBookmarkContainer>
              {!newNode && (
                <>
                  <RowItem
                    size={RVSizeProp.small}
                    ActionsComponent={
                      <div
                        style={{
                          display: 'flex',
                          columnGap: '.5rem',
                        }}
                      >
                        <Button variant={RVVariantProp.white}>back</Button>
                        <Button fullWidth noWrap style={{ width: 200 }}>
                          <ArrowCircleSvg
                            width="1.3em"
                            height="1.3em"
                            direction="up"
                          />
                          publish
                        </Button>
                      </div>
                    }
                  >
                    <Typography type="H1">
                      CliqMind UX writing improvement and other correction
                    </Typography>
                  </RowItem>
                  {!newNode && (
                    <ShadowButton
                      onMouseEnter={() => setSideDetailsHover(true)}
                      onMouseLeave={() => setSideDetailsHover(false)}
                      onClick={onSideDetailsClick}
                      active={sideColumn}
                      size={RVSizeProp.medium}
                      rounded="half"
                    >
                      <DocIcon size="1.5rem" />
                    </ShadowButton>
                  )}
                  <ShadowButton
                    // onClick={onSideDetailsClick}
                    active={sideColumn}
                    size={RVSizeProp.medium}
                    rounded="half"
                    style={{ fontSize: '1.4rem' }}
                  >
                    <ChatBubbleSvg />
                  </ShadowButton>
                  <ShadowButton
                    onClick={onBookmarkPressed}
                    active={sideColumn}
                    size={RVSizeProp.medium}
                    rounded="half"
                    style={{ fontSize: '1.4rem' }}
                  >
                    <BookmarkSvg outline={bookmarkStatus !== 'liked'} />
                  </ShadowButton>
                </>
              )}
              {contribution && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <Creators
                    creatorsList={nodeDetails?.Contributors?.Value || []}
                    nodeDetails={nodeDetails}
                  />
                </div>
              )}

              <Styles.NodeTopBarViewCount>
                <Eye
                  className="rv-default"
                  color={CV_DISTANT}
                  style={{ margin: '0 0.5rem 0 0.5rem' }}
                />
                {VisitsCount}
              </Styles.NodeTopBarViewCount>
            </Styles.NodeTopBarCounterBookmarkContainer>
          </Styles.NodeTopBarTopRow>
        </Styles.NodeTopBarContainer>
      ) : (
        <TopBarLoadingSkelton />
      )}
    </div>
  );
};
export default TopBar;

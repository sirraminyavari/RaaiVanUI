/**
 * here we make the top bar for NodeDetails
 */
import APIHandler from 'apiHelper/APIHandler';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Button from 'components/Buttons/Button';
import FilledBookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import OutLineBookmarkIcon from 'components/Icons/BookmarkIcon/OutlineBookmark';
import DocIcon from 'components/Icons/DocIcon';
import Eye from 'components/Icons/Eye';
import { CV_DISTANT } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import { decode } from 'js-base64';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import LastTopicsTabs from 'views/Profile/items/main/items/LastTopicsTabs';
import TopBarLoadingSkelton from '../TopBarLoadingSkelton';
import Creators from './Creators';
import * as Styles from './TopBar.style';

const { RVDic, RVAPI, RV_RTL, RVGlobal } = window || {};

const getNodeInfoAPI = new APIHandler('CNAPI', 'GetRelatedNodesAbstract');
const likeNode = new APIHandler('CNAPI', 'Like');
const unlikeNode = new APIHandler('CNAPI', 'Unlike');

const TopBar = ({
  nodeDetails,
  nodeType,
  onApplyNodeType = () => {},
  onSideColumnClicked,
  sideColumn,
  hierarchy,
}) => {
  const { VisitsCount, Contributors } = nodeDetails || {};

  const isTabletOrMobile = DimensionHelper().isTabletOrMobile;
  const [relatedNodes, setRelatedNodes] = useState(null);
  const [sideDetailsHover, setSideDetailsHover] = useState(false);
  const [bookmarkStatus, setBookmarkStatus] = useState(
    nodeDetails?.LikeStatue ? 'liked' : 'disLiked'
  );
  useEffect(() => {
    getRelatedNodes();
  }, []);
  const getRelatedNodes = () => {
    getNodeInfoAPI.fetch(
      {
        NodeID: RVGlobal?.CurrentUser?.UserID,
        In: true,
        Out: true,
        InTags: true,
        OutTags: true,
        ParseResults: true,
      },
      (response) => {
        if (response && response.NodeTypes) {
          setRelatedNodes(response);
        }
      }
    );
  };

  const { teamName, onboardingName, selectedApp, newDocMenu } = useSelector(
    (state) => ({
      teamName: state?.theme?.selectedTeam?.name,
      onboardingName: state?.onboarding?.name,
      newDocMenu: state?.onboarding?.newDocMenu,
      selectedApp: state?.selectedTeam,
    })
  );
  const extendedHierarchy = hierarchy?.map((level) => ({
    id: level?.NodeTypeID,
    title: decodeBase64(level?.TypeName),
    linkTo: `/classes/${level?.NodeTypeID}`,
  }));
  const { NodeType, Name } = nodeDetails || {};

  const breadcrumbItems = [
    { id: selectedApp?.id, title: teamName, linkTo: '/classes' },
    {
      title: decodeBase64(NodeType?.Value[0]?.Name),
      linkTo: `/classes/${NodeType?.Value[0]?.ID}`,
    },
    {
      title: decodeBase64(Name?.Value),
      linkTo: `/node/${nodeDetails?.NodeID}`,
    },
    ...extendedHierarchy,
  ];

  const getTypeName = () => {
    return nodeType?.TypeName
      ? decode(nodeType?.TypeName)
      : teamName
      ? teamName
      : '';
  };
  const onSideDetailsClick = () => {
    setSideDetailsHover(!sideDetailsHover);
    onSideColumnClicked(!sideColumn);
  };
  const onBookmarkPressed = (e) => {
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
        }
      });
    }
  };
  const { RVGlobal } = window;
  const avatar = RVGlobal?.CurrentUser?.ProfileImageURL;

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      {relatedNodes ? (
        <Styles.NodeTopBarContainer>
          <Styles.NodeTopBarTopRow isTabletOrMobile={isTabletOrMobile}>
            <Styles.NodeTopBarBreadcrumbWrapper>
              <Breadcrumb items={breadcrumbItems} />
            </Styles.NodeTopBarBreadcrumbWrapper>

            <Styles.NodeTopBarCounterBookmarkContainer>
              <Styles.NodeTopBarViewCount>
                <Eye
                  className="rv-default"
                  color={CV_DISTANT}
                  style={{ margin: '0 0.5rem 0 0.5rem' }}
                />
                {VisitsCount}
              </Styles.NodeTopBarViewCount>
              <Button
                onClick={onBookmarkPressed}
                style={{
                  borderRadius: '10rem',
                  height: '2rem',
                  whiteSpace: 'nowrap',
                }}
                type={bookmarkStatus === 'liked' ? 'primary' : 'primary-o'}
              >
                {bookmarkStatus === 'liked' ? (
                  <>
                    <FilledBookmarkIcon className={'rv-default rv-white'} />
                    {RVDic.Bookmark}
                  </>
                ) : (
                  <>
                    <OutLineBookmarkIcon className={'rv-default'} />
                    {RVDic.Bookmark}
                  </>
                )}
              </Button>
            </Styles.NodeTopBarCounterBookmarkContainer>
          </Styles.NodeTopBarTopRow>

          <Styles.NodeTopBarBottomRow mobileView={isTabletOrMobile}>
            {relatedNodes?.TotalRelationsCount > 0 && (
              <Styles.NodeTopBarRelatedTopicsContainer>
                <Styles.NodeTopBarRelatedTopicsTitle>
                  {RVDic.RelatedNode}
                </Styles.NodeTopBarRelatedTopicsTitle>
                <LastTopicsTabs
                  floatBox
                  provideNodes={onApplyNodeType && onApplyNodeType}
                  relatedNodes={relatedNodes}
                />
              </Styles.NodeTopBarRelatedTopicsContainer>
            )}
            <Styles.NodeTopBarSpace />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Styles.NodeTopBarShadowButton
                onMouseEnter={() => setSideDetailsHover(true)}
                onMouseLeave={() => setSideDetailsHover(false)}
                onClick={onSideDetailsClick}
                $isEnabled={sideColumn || sideDetailsHover}
                className={
                  sideColumn
                    ? 'rv-border-distant rv-default'
                    : sideDetailsHover
                    ? 'rv-border-distant rv-default'
                    : 'rv-border-white rv-distant'
                }
              >
                <DocIcon
                  size={'1.5rem'}
                  className={
                    sideColumn
                      ? 'rv-default'
                      : sideDetailsHover
                      ? 'rv-default'
                      : 'rv-distant'
                  }
                />
              </Styles.NodeTopBarShadowButton>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  ...(RV_RTL && { marginRight: '2rem' }),
                  ...(!RV_RTL && { marginLeft: '2rem' }),
                }}
              >
                <Creators
                  creatorsList={nodeDetails?.Contributors?.Value}
                  nodeDetails={nodeDetails}
                />
              </div>
            </div>
          </Styles.NodeTopBarBottomRow>
        </Styles.NodeTopBarContainer>
      ) : (
        <TopBarLoadingSkelton />
      )}
    </div>
  );
};
export default TopBar;

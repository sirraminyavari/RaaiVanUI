/**
 * 'SubjectItem' for the time that the screen is small/medium.
 */
import { decode } from 'js-base64';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import SubjectCheckBox from '../items/SubjectCheckBox';
import SubjectClassName from '../items/SubjectClassName';
import SubjectCreator from '../items/SubjectCreator';
import SubjectDate from '../items/SubjectDate';
import SubjectIcon from '../items/SubjectIcon';
import SubjectTitle from '../items/SubjectTitle';
import SubjectTools from '../items/SubjectTools';
import SubjectViewCount from '../items/SubjectViewCount';
import { Container, Divider, IconContent, Root } from './SubjectItem.style';

const { RV_RTL, RVAPI } = window;

/**
 *
 * @param {Object} item - An object comes from server.
 * @param {Boolean} selectMode - If True, items can be selected with checkBox.
 * @callback onChecked -  By changing the checkbox state,
   checkbox state and the selected item will pass to up.
 */
const SubjectItemMobileView = ({
  item,
  selectMode,
  onChecked,
  onReload,
  parentNodeType,
  onBookmark,
  onClickItem,
}) => {
  const {
    Name,
    IconURL,
    CreationDate,
    NodeType,
    AdditionalID,
    UserStatus,
    Creator,
    NodeID,
    NodeTypeID,
    LikeStatus,
    VisitsCount,
  } = item;

  const isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;
  const history = useHistory();
  // /**
  //  * By clicking on the item will fire.
  //  */

  const [isChecked, setIsChecked] = useState(false);

  const checkHandler = (value) => {
    onChecked(value, item);
    setIsChecked(value);
  };

  const onClick = () => {
    if (!!onClickItem) {
      onClickItem(item);
    } else {
      history.push(RVAPI.NodePageURL({ NodeID: NodeID }));
    }
  };
  return (
    <Root>
      <Container
        $isChecked={isChecked}
        to={RVAPI.NodePageURL({ NodeID: NodeID })}
        className="rv-border-freezed"
        onClick={onClick}>
        <IconContent>
          {/* <div> */}
          <SubjectIcon iconUrl={IconURL} />
          {parentNodeType !== NodeTypeID && (
            <SubjectClassName className={decode(NodeType)} />
          )}
          {/* </div> */}
          <div>
            <SubjectViewCount count={VisitsCount} />
            <SubjectDate date={CreationDate} />
          </div>
        </IconContent>
        <Divider className="rv-bg-color-freezed" />
        <MainContent>
          <Main>
            <SubjectTitle title={decode(Name)} additionalID={AdditionalID} />
          </Main>
          <Maintainer>
            <SubjectCreator
              userProfile={Creator?.ProfileImageURL}
              firstName={decode(Creator.FirstName)}
              lastName={decode(Creator.LastName)}
            />
            {isSaas && (
              <SubjectTools
                editable={UserStatus.Editable}
                removable={UserStatus.Removable}
                isLiked={LikeStatus}
                nodeId={NodeID}
                reload={onReload}
                onBookmarLocally={onBookmark && onBookmark}
                isHover={true}
              />
            )}
          </Maintainer>
          {/* {isSaas && <SubjectStatus style={{ marginTop: '2rem' }} />} */}
        </MainContent>
        <SubjectCheckBox selectMode={selectMode} onChecked={checkHandler} />
      </Container>
    </Root>
  );
};

export default SubjectItemMobileView;

const MainContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 13rem;
`;
const Main = styled.div`
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
  padding: ${() => (RV_RTL ? '0 0.75rem 0 0' : '0 0 0 0.75rem')};
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;
`;

const Maintainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  flex-grow: 1;
  width: 100%;
  margin: 1rem 3px 0.8rem 3px;
  padding: ${() => (RV_RTL ? '0 1rem 0 0' : '0 0 0 1rem')};
`;

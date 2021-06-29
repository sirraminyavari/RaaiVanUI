/**
 * 'SubjectItem' for the time that the screen is big.
 */
import { getURL } from 'helpers/helpers';
import { decode } from 'js-base64';
import React, { useState } from 'react';
import styled from 'styled-components';
import SubjectCheckBox from '../items/SubjectCheckBox';
import SubjectClassName from '../items/SubjectClassName';
import SubjectCreator from '../items/SubjectCreator';
import SubjectDate from '../items/SubjectDate';
import SubjectIcon from '../items/SubjectIcon';
import SubjectStatus from '../items/SubjectStatus';
import SubjectTitle from '../items/SubjectTitle';
import SubjectTools from '../items/SubjectTools';
import SubjectViewCount from '../items/SubjectViewCount';
import { Container, Divider, IconContent, Root } from './SubjectItem.style';

/**
 *
 * @param {Object} item - An object comes from server.
 * @param {Boolean} selectMode - If True, items can be selected with checkBox.
 * @callback onChecked -  By changing the checkbox state,
   checkbox state and the selected item will pass to up.
 */

const { RV_RTL, RVAPI } = window;

const SubjectItemDesktop = ({
  item,
  selectMode,
  onChecked,
  parentNodeType,
  onReload,
  onBookmark,
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
  } = item;
  const [isHover, setIsHover] = useState(false);
  const isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;

  // /**
  //  * By clicking on the item will fire.
  //  */
  const onClick = () => {
    console.log('clicked');
    window.open(RVAPI.NodePageURL({ NodeID: NodeID }));
  };

  return (
    <Root>
      <SubjectCheckBox
        selectMode={selectMode}
        onChecked={(value) => onChecked(value, item)}
      />
      {/* {console.log(item, 'item')} */}
      <Container
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        href={RVAPI.NodePageURL({ NodeID: NodeID })}
        className="rv-border-freezed">
        <IconContent>
          <SubjectIcon iconUrl={IconURL} />
          <SubjectDate date={CreationDate} />
        </IconContent>
        <Divider className="rv-bg-color-freezed" />
        <MainContent>
          <Main>
            <SubjectTitle title={decode(Name)} additionalID={AdditionalID} />
            {isSaas && (
              <Details>
                {parentNodeType !== NodeTypeID && (
                  <SubjectClassName className={decode(NodeType)} />
                )}
                {!isSaas && <SubjectViewCount count={UserStatus.VisitsCount} />}

                {/* <div
                  style={{
                    display: 'flex',
                    flexGrow: 1,
                  }}
                /> */}
              </Details>
            )}
          </Main>
          {isSaas && (
            <>
              <SubjectTools
                isHover={isHover}
                editable={UserStatus.Editable}
                removable={UserStatus.Removable}
                isLiked={LikeStatus}
                nodeId={NodeID}
                reload={onReload}
                onBookmarLocally={onBookmark && onBookmark}
              />

              {/* <SubjectStatus style={{ width: '16.1rem' }} /> */}
            </>
          )}
          <SubjectCreator
            style={{ padding: RV_RTL ? '0 0rem 0 2rem' : '0 2rem 0 0 ' }}
            userProfile={Creator?.ProfileImageURL}
            firstName={decode(Creator.FirstName)}
            lastName={decode(Creator.LastName)}
          />
        </MainContent>
      </Container>
    </Root>
  );
};

export default SubjectItemDesktop;

const MainContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  padding: 0 0.5rem 0 0.5rem;
`;
const Main = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
  align-items: flex-start;
  justify-content: center;
  margin: ${() => (RV_RTL ? '0 1.75rem 0 0' : '0 0 0 1.75rem')};
`;

const Details = styled.div`
  display: flex;
  flex-direction: row;
  /* margin-top: 1rem; */
`;

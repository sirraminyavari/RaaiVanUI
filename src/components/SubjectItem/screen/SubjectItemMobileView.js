/**
 * 'SubjectItem' for the time that the screen is small/medium.
 */
import { decode } from 'js-base64';
import React, { useState } from 'react';
import styled from 'styled-components';
import SubjectClassName from '../items/SubjectClassName';
import SubjectCreator from '../items/SubjectCreator';
import SubjectDate from '../items/SubjectDate';
import SubjectIcon from '../items/SubjectIcon';
import SubjectStatus from '../items/SubjectStatus';
import SubjectTitle from '../items/SubjectTitle';
import SubjectTools from '../items/SubjectTools';
import SubjectViewCount from '../items/SubjectViewCount';
import SubjectCheckBox from '../items/SubjectCheckBox';

import { Container, RightSide, Divider, Root } from './SubjectItem.style';

/**
 *
 * @param {Object} item - An object comes from server.
 * @param {Boolean} selectMode - If True, items can be selected with checkBox.
 * @callback onChecked -  By changing the checkbox state,
   checkbox state and the selected item will pass to up.
 */
const SubjectItemMobileView = ({ item, selectMode, onChecked }) => {
  const {
    Name,
    IconURL,
    CreationDate,
    NodeType,
    AdditionalID,
    UserStatus,
    Creator,
  } = item;

  const isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;
  /**
   * By clicking on the item will fire.
   */
  const onClick = () => {};

  return (
    <Root>
      <SubjectCheckBox
        selectMode={selectMode}
        onChecked={(value) => onChecked(value, item)}
      />
      <Container onClick={onClick}>
        <RightSide>
          <div>
            <SubjectIcon iconUrl={IconURL} />
            <SubjectClassName className={decode(NodeType)} />
          </div>
          <div>
            <SubjectViewCount count={UserStatus.VisitsCount} />
            <SubjectDate date={CreationDate} />
          </div>
        </RightSide>
        <Divider />
        <LeftSide>
          <Main>
            <SubjectTitle title={decode(Name)} additionalID={AdditionalID} />
          </Main>
          <Maintainer>
            <SubjectCreator
              userProfile={Creator.ProfileImageURL}
              firstName={decode(Creator.FirstName)}
              lastName={decode(Creator.LastName)}
            />
            {!isSaas && (
              <SubjectTools
                editable={UserStatus.Editable}
                removable={UserStatus.Removable}
              />
            )}
          </Maintainer>
          {isSaas && <SubjectStatus style={{ marginTop: '2rem' }} />}
        </LeftSide>
      </Container>
    </Root>
  );
};

export default SubjectItemMobileView;

const LeftSide = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: flex-start;
`;
const Main = styled.div`
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
  padding-right: 0.75rem;
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;
`;

const Maintainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  width: 100%;
  margin: 1rem 3px 0 3px;
  padding-right: 1rem;
`;
/**
 * 'SubjectItem' for the time that the screen is big.
 */
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
import { Container, Divider, RightSide, Root } from './SubjectItem.style';

/**
 *
 * @param {Object} item - An object comes from server.
 * @param {Boolean} selectMode - If True, items can be selected with checkBox.
 * @callback onChecked -  By changing the checkbox state,
   checkbox state and the selected item will pass to up.
 */

const { RV_RTL } = window;

const SubjectItemDesktop = ({ item, selectMode, onChecked }) => {
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

      <Container className="rv-border-distant" onClick={onClick}>
        <RightSide>
          <SubjectIcon iconUrl={IconURL} />
          <SubjectDate date={CreationDate} />
        </RightSide>
        <Divider className="rv-bg-color-distant" />
        <LeftSide>
          <Main>
            <SubjectTitle title={decode(Name)} additionalID={AdditionalID} />

            {isSaas && (
              <Details>
                <SubjectClassName className={decode(NodeType)} />
                <SubjectViewCount count={UserStatus.VisitsCount} />

                <div
                  style={{
                    display: 'flex',
                    flexGrow: 1,
                  }}
                />
              </Details>
            )}
          </Main>
          {isSaas && (
            <>
              <SubjectTools
                editable={UserStatus.Editable}
                removable={UserStatus.Removable}
              />

              {/* <SubjectStatus style={{ width: '16.1rem' }} /> */}
            </>
          )}
          <SubjectCreator
            userProfile={Creator.ProfileImageURL}
            firstName={decode(Creator.FirstName)}
            lastName={decode(Creator.LastName)}
          />
        </LeftSide>
      </Container>
    </Root>
  );
};

export default SubjectItemDesktop;

const LeftSide = styled.div`
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
  justify-content: space-evenly;
  margin: ${() => (RV_RTL ? '0 1.75rem 0 0' : '0 0 0 1.75rem')};
  max-width: 70%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 1rem;
`;

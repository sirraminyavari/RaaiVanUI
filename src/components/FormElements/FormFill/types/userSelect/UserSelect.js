import AddIcon from 'components/Icons/AddIcon/AddIcon';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import UserIconIo from 'components/Icons/UserIconIo';
import PeoplePicker from 'components/PeoplePicker/PeoplePicker';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_RED,
  TCV_DEFAULT,
  TCV_WARM,
} from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import React, { useState } from 'react';
import styled from 'styled-components';
import FormCell from '../../FormCell';

const { RVDic, GlobalUtilities } = window;
const { to_json } = GlobalUtilities || {};

const UserSelect = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  save,
  ...props
}) => {
  const [editMode, setEditMode] = useState(false);
  const normalizeValue =
    value.length > 0
      ? value?.map((x) => {
          const temp = {
            id: x.ID,
          };
          return temp;
        })
      : [];
  const title =
    value && value?.length === 1
      ? decodeBase64(value[0].Name)
      : value?.length > 0
      ? value.map((x) => {
          return (
            <SelectedUser>
              <div></div>
              {decodeBase64(x.Name)}
            </SelectedUser>
          );
        })
      : RVDic.UserSelect;

  const multiSelect = to_json(decodeInfo)?.MultiSelect;

  const onSave = () => {
    save(elementId);
    setEditMode(!editMode);
  };

  return (
    <Container>
      <FormCell
        editMode={editMode}
        editModeVisible={true}
        onEdit={() => setEditMode(!editMode)}
        onSave={onSave}
        style={{ display: 'flex', flexGrow: 1 }}
        iconComponent={<UserIconIo color={CV_GRAY} size={'1.25rem'} />}
        title={decodeTitle}
        {...props}>
        <Maintainer>
          {value?.length > 0 && (
            <Select>
              {value.map((x) => {
                return (
                  <SelectedUser>
                    <Avatar src={x?.IconURL} />
                    <UserName>{decodeBase64(x.Name)}</UserName>
                    {editMode && (
                      <CustomCloseIcon
                        onClick={() => {
                          onAnyFieldChanged(
                            elementId,
                            {
                              id: x.ID,
                              name: x.Name,
                              IconURL: x?.IconURL,
                              multiSelect: multiSelect,
                            },
                            type
                          );
                        }}
                        size={'1rem'}
                      />
                    )}
                  </SelectedUser>
                );
              })}
            </Select>
          )}
          <PeoplePicker
            onByMe={() => {}}
            onBlur={() => save && save(elementId)}
            onByPeople={(event) => {
              onAnyFieldChanged(
                elementId,
                { ...event, multiSelect: multiSelect },
                type
              );
            }}
            isByMe={false}
            pickedPeople={normalizeValue}
            onVisible={() => {}}
            multi={multiSelect}
            buttonComponent={
              <AddIcon
                style={{
                  margin: '0 1rem 0 1rem',
                  display: !editMode && 'none',
                }}
                size={'2rem'}
                color={TCV_DEFAULT}
              />
            }
          />
        </Maintainer>
      </FormCell>
    </Container>
  );
};
export default UserSelect;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;
const Select = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
`;

const Maintainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;
const SelectedUser = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-style: solid;
  border-width: 0.03rem;
  border-radius: 0.5rem;
  border-color: ${CV_DISTANT};
  margin: 0 0.25rem 0 0.25rem;

  height: 3rem;
`;
const UserName = styled.div`
  margin: 0 0.5rem 0 0.5rem;
  color: ${TCV_WARM};
`;
const CustomCloseIcon = styled(CloseIcon)`
  color: ${CV_DISTANT};
  :hover {
    color: ${CV_RED};
  }
`;
const Avatar = styled.img`
  width: 2rem;
  aspect-ratio: 1;
  height: 2rem;
  border-radius: 2rem;
  background-color: ${CV_GRAY};
  margin: 0.3rem;
  align-items: center;
  justify-content: center;
`;

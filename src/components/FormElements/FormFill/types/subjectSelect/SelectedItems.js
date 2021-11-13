import Heading from 'components/Heading/Heading';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { TC_WARM } from 'constant/Colors';
import {
  CV_BLACK,
  CV_FREEZED,
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_RED,
} from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import React from 'react';
import styled from 'styled-components';

const SelectedItem = ({ item, onRemove, editMode }) => {
  const { Name, IconURL } = item || {};

  return (
    <Maintainer className={'rv-border-radius-half'}>
      <Icon src={IconURL} />

      <Title>{decodeBase64(Name)}</Title>
      {editMode && <CustomCloseIcon onClick={() => onRemove(item)} />}
    </Maintainer>
  );
};
export default SelectedItem;

const Maintainer = styled.div`
  width: 70%;
  height: 3rem;
  border-style: solid;
  border-color: #e6f4f1;
  border-width: 0.1rem;
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 0.25rem 1rem 0.25rem 1rem;
`;
const Icon = styled.img`
  height: 2.2rem;
  width: 2.2rem;
  border-radius: 1rem;
  margin: 0.5rem;
  background-color: ${CV_GRAY};
`;
const CustomCloseIcon = styled(CloseIcon)`
  margin: 1rem;
  color: ${CV_FREEZED};
  :hover {
    color: ${CV_RED};
  }
`;
const Title = styled.div`
  color: ${TC_WARM};
  display: flex;
  flex-grow: 1;
  margin: 0 1rem 0 1rem;
`;

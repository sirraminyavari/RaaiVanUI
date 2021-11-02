import styled from 'styled-components';
import { BO_DISTANT } from 'constant/Colors';
import { BO_RADIUS_CIRCLE, BO_RADIUS_QUARTER } from 'constant/constants';
import {
  FLEX_CCC,
  FLEX_CSA,
  FLEX_RCB,
  FLEX_RCC,
  FLEX_RCS,
  FLEX_REB,
} from 'constant/StyledCommonCss';
import {
  CV_DISTANT,
  CV_RED,
  TCV_DEFAULT,
  TCV_VERYWARM,
  TCV_WARM,
} from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';

const { RV_Float, RV_RevFloat } = window;

export const UsersCellContainer = styled.div`
  width: 100%;
  ${FLEX_CSA}
  gap: 0.5rem;

  .table-user-cell-select-button {
    background-color: inherit;
    color: ${TCV_DEFAULT};
    width: auto;
    margin: 0 1rem;
    height: 1.8rem;
    border-radius: 1rem;
  }
`;

export const UsersListWrapper = styled.div`
  width: 100%;
  ${FLEX_CCC}
  gap: 0.2rem;
`;

export const UserCellContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER} ${BO_DISTANT}`,
})`
  width: 100%;
  height: 2.5rem;
  padding: 0 0.5rem;
  ${FLEX_RCB}
`;

export const UserInfoWrapper = styled.div`
  width: ${({ editable }) => (editable ? '88%' : '100%')};
  min-width: ${({ editable }) => (editable ? '88%' : '100%')};
  height: 90%;
  margin-${RV_RevFloat}: 0.2rem;
  ${FLEX_RCS}

  .table-user-avatar {
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    min-height: 2rem;
    border: none;
  }
`;

export const UserLinkHeading = styled(Heading)`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 0.3rem;
  margin-${RV_Float}: 0.3rem;
  text-align: ${RV_Float};

  a{
    color: ${TCV_VERYWARM};
  }

  a:active {
    color: ${TCV_DEFAULT};
  }
`;

export const CloseIconWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  cursor: pointer;
  padding: 0.2rem;
  ${FLEX_CCC}

  &:hover svg {
    color: ${CV_RED} !important;
  }
`;

export const AddNewUser = styled.div`
  ${FLEX_RCC}
  gap: 0.5rem;
  cursor: pointer;
`;

export const EmptyCellView = styled.div`
  color: ${CV_DISTANT};
  width: 100%;
  height: 2rem;
  text-align: start;
  padding-${RV_Float}: 0.7rem;
`;

export const ItemSelectionButton = styled.div`
  ${FLEX_RCC}
  gap: 0.5rem;
`;

export const ItemSelectionHeading = styled(Heading)`
  color: ${TCV_DEFAULT};
`;

export const UsersWrapper = styled.div`
  width: 100%;
  ${FLEX_REB}
  gap: 0.5rem;

  .table-user-cell-save-button {
    background-color: inherit;
    padding: 0.3rem;
    height: 1.7rem;
    width: 7rem;
    border-radius: 1rem;
  }
`;

export const SaveButtonHeading = styled(Heading)`
  color: ${TCV_DEFAULT};
`;

export const UserListWrapper = styled.div`
  width: ${({ isEditMode }) => (isEditMode ? '70%' : '100%')};
  max-width: ${({ isEditMode }) => (isEditMode ? '70%' : '100%')};
  min-width: ${({ isEditMode }) => (isEditMode ? '70%' : '100%')};
  ${FLEX_CCC}
  gap: 0.2rem;
`;

export const PeoplePickerWrapper = styled.div`
  width: 100%;
`;

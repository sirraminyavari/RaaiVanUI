import { getProfilePageUrl } from 'apiHelper/getPageUrl';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import PeoplePicker from 'components/PeoplePicker/PeoplePicker';
import { TCV_DEFAULT } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import { Link } from 'react-router-dom';
import * as Styles from './UserSelectInputField.styles';
import * as GlobalStyles from 'components/FormElements/ElementTypes/formElements.styles';
import useWindow from 'hooks/useWindowContext';

export interface IUserSelectInputField {
  value: {
    FullName: string;
    ID: string;
    IconURL: string;
    Name: string;
    UserID: string;
    UserName: string;
    [key: string]: any;
  }[];
  onChange: ({
    id,
    name,
    IconURL,
    multiSelect,
  }: {
    id: string;
    name: string;
    IconURL: string;
    multiSelect: boolean;
  }) => void;
  onRemove: ({
    id,
    name,
    IconURL,
    multiSelect,
  }: {
    id: string;
    name: string;
    IconURL: string;
    multiSelect: boolean;
  }) => void;
  save: () => void;
  isEditable?: boolean;
  isMulti?: boolean;
}

const UserSelectInputField = ({
  value = [],
  onChange,
  onRemove,
  save,
  isEditable,
  isMulti = false,
}: IUserSelectInputField) => {
  const { RVDic } = useWindow();

  const normalizeValue =
    value.length > 0
      ? value?.map((x) => {
          const temp = {
            id: x.ID,
          };
          return temp;
        })
      : [];

  return (
    <>
      <Styles.UserSelectInputFieldMaintainer>
        {value?.length > 0 ? (
          <Styles.UserSelectInputFieldSelect>
            {value.map((x) => {
              return (
                <Styles.UserSelectInputFieldSelectedUser>
                  <Link to={getProfilePageUrl(x.ID)} target="_blank" key={x.ID}>
                    <Styles.UserSelectInputFieldAvatar src={x?.IconURL} />
                    <Styles.UserSelectInputFieldUserName>
                      {decodeBase64(x.Name)}
                    </Styles.UserSelectInputFieldUserName>
                  </Link>
                  {isEditable && (
                    <Styles.UserSelectInputFieldCustomCloseIcon
                      onClick={() => {
                        onRemove({
                          id: x.ID,
                          name: x.Name,
                          IconURL: x?.IconURL,
                          multiSelect: isMulti && isMulti,
                        });
                      }}
                      size={'1rem'}
                    />
                  )}
                </Styles.UserSelectInputFieldSelectedUser>
              );
            })}
          </Styles.UserSelectInputFieldSelect>
        ) : (
          <GlobalStyles.SelectedFieldItemContainer>
            <GlobalStyles.SelectedFieldItem muted>
              {RVDic.Select}
            </GlobalStyles.SelectedFieldItem>
          </GlobalStyles.SelectedFieldItemContainer>
        )}
        <PeoplePicker
          onByMe={() => {}}
          onBlur={() => save && save()}
          onByPeople={(event) => {
            onChange({ ...event, multiSelect: isMulti });
          }}
          isByMe={false}
          pickedPeople={normalizeValue}
          onVisible={() => {}}
          multi={isMulti}
          buttonComponent={
            <AddIcon
              style={{
                margin: '0 1rem 0 1rem',
                display: !isEditable && 'none',
              }}
              size={'2rem'}
              color={TCV_DEFAULT}
            />
          }
        />
      </Styles.UserSelectInputFieldMaintainer>
    </>
  );
};
UserSelectInputField.displayName = 'UserSelectInputField';
export default UserSelectInputField;

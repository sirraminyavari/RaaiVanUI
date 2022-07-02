import RVCheckbox from 'components/Inputs/RVCheckbox/RVCheckbox';
import MembersPreview from 'components/MembersPreview/MembersPreview';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import { useContext, useMemo } from 'react';
import { UserGroupSelectContext } from '../UserGroupSelect';
import * as Styles from '../UserGroupSelectStyles';

const GroupSelect = () => {
  const { RVDic } = window;
  const { groups, handleGroupCheck, selectedGroups } = useContext(
    UserGroupSelectContext
  );

  const items = useMemo(
    () =>
      groups?.map((x) => {
        const { NodeID, Members, Name } = x;
        const members = Members?.map((x) => ({
          id: x?.NodeID,
          title: x?.FullName,
          src: x?.ProfileImageURL,
        }));
        return (
          <Styles.ObjectItemContainer key={NodeID}>
            <RVCheckbox
              checked={selectedGroups?.includes(NodeID)}
              value={NodeID}
              onChange={(e) => {
                const { value, checked } = e?.target;
                handleGroupCheck && handleGroupCheck(x, checked);
              }}
            >
              {Name}
            </RVCheckbox>
            <MembersPreview
              members={members}
              maxItems={2}
              size={2}
              showMore={false}
            />
          </Styles.ObjectItemContainer>
        );
      }),
    [groups, selectedGroups]
  );
  return (
    <ScrollBarProvider>
      <Styles.ObjectListWrapper>{items}</Styles.ObjectListWrapper>
    </ScrollBarProvider>
  );
};
export default GroupSelect;

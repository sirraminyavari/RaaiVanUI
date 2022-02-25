import { usePrivacyProvider } from '../../PrivacyContext';
import RVCheckbox from 'components/Inputs/RVCheckbox/RVCheckbox';
import MembersPreview from 'components/MembersPreview/MembersPreview';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import {
  ObjectItemContainer,
  ObjectListWrapper,
} from './SelectObjectItemStyle';
import { useMemo } from 'react';

const SelectGroups = ({ type }) => {
  const { groups, selectedGroups, handleGroupSelect } = usePrivacyProvider();
  const _groups = [...selectedGroups].find((x) => x.type === type)?.items;

  const items = useMemo(
    () =>
      [...groups].map((x) => {
        const { NodeID, Members, Name } = x;
        const members = [...Members].map((x) => ({
          title: x?.FullName,
          src: x?.ProfileImageURL,
        }));
        return (
          <ObjectItemContainer key={NodeID}>
            <RVCheckbox
              checked={[..._groups].includes(NodeID)}
              value={NodeID}
              onChange={(e) => {
                const { value, checked } = e?.target;
                handleGroupSelect(value, checked, type);
              }}
            >
              {Name}
            </RVCheckbox>
            <MembersPreview members={members} size={2} showMore />
          </ObjectItemContainer>
        );
      }),
    [_groups]
  );

  return (
    <ScrollBarProvider>
      <ObjectListWrapper>{items}</ObjectListWrapper>
    </ScrollBarProvider>
  );
};
export default SelectGroups;

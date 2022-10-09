import API from 'apiHelper';
import { decodeBase64 } from 'helpers/helpers';

export const fetchDashboards = async () => {
  const { Items, ...restDashboardProps } =
    await API.Notifications.GetDashboardsCount();

  const ItemSubs: typeof Items = [];
  let ItemMembershipSubs: typeof Items[number] = {
    ToBeDone: 0,
    Sub: [],
  } as unknown as typeof Items[number];

  Items.forEach(({ Sub }) => {
    Sub.forEach((item) => {
      if (item.Type === 'MembershipRequest')
        ItemMembershipSubs = {
          ...item,
          IconURL: '/images/Preview.png',
          NodeType: window.RVDic.MembershipRequest,
          ToBeDone: item.ToBeDone + ItemMembershipSubs.ToBeDone,
          Sub: [...item.Sub, ...ItemMembershipSubs.Sub],
        };
      else
        ItemSubs.push({
          ...item,
          IconURL: '/images/Preview.png',
          NodeType: decodeBase64(item?.NodeType),
          NodeTypeID: item?.NodeTypeID,
        });
    });
  });

  return {
    ...restDashboardProps,
    Items,
    ItemSubs: [...ItemSubs, ItemMembershipSubs],
  };
};

export const fetchDashboardItem = async ({
  NodeTypeID,
  Type,
  Done = false,
  LowerBoundary = 1,
  Count = 20,
  SubType,
  SubTypeTitle,
  DistinctItems,
  InWorkFlow,
}: {
  NodeTypeID?: string;
  Type?: 'Knowledge' | 'MembershipRequest' | 'WorkFlow';
  Done?: boolean;
  LowerBoundary?: number;
  Count?: number;
  SubType?: string;
  SubTypeTitle?: string;
  DistinctItems?: boolean;
  InWorkFlow?: boolean;
}) => {
  const data = await API.Notifications.GetDashboards({
    NodeTypeID,
    Type,
    Done,
    LowerBoundary,
    Count,
    SubType,
    SubTypeTitle,
    DistinctItems,
    InWorkFlow,
  });
  const parsedItems = data.Items.map((itemProperties) => ({
    ...itemProperties,
    Info: JSON.parse(decodeBase64(itemProperties?.Info) || '{}'),
    NodeAdditionalID: decodeBase64(itemProperties?.NodeAdditionalID),
    NodeName: decodeBase64(itemProperties?.NodeName || itemProperties?.Name),
    NodeType: decodeBase64(itemProperties?.NodeType),
  }));
  console.log({ parsedItems });
  return { ...data, Items: parsedItems };
};

export const getPendingMembers = async ({ NodeID }: { NodeID: string }) => {
  const response = await API.CN.GetPendingMembers({
    Count: 1_000_000,
    LowerBoundary: 1,
    NodeID,
  });
  const Members = response.Members.map((member) => ({
    ...member,
    FirstName: decodeBase64(member?.FirstName),
    LastName: decodeBase64(member?.LastName),
    UserName: decodeBase64(member?.UserName),
  }));
  return { ...response, Members };
};

////RemoveMember
///AcceptMember

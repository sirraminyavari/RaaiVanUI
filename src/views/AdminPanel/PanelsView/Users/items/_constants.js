/**
 *
 * @param dic
 * @return {[{width: number, title: *}, {width: number, title: *}, {width: number, title: (boolean|*)}, {width: number, title: *, centralized: boolean}, {width: number, title: *, centralized: boolean}, null]}
 * @constructor
 */
export const SaasUserListHeaders = (dic) => {
  return [
    {
      title: dic?.FullName,
      width: 25,
    },
    {
      title: dic?.Email,
      width: 25,
    },
    {
      title: dic?.LastActivityTime,
      width: 17,
    },
    {
      title: dic?.Admin,
      width: 8,
      centralized: true,
    },
    {
      title: dic?.Groups,
      width: 8,
      centralized: true,
    },
    {
      title: '',
      width: 17,
    },
  ];
};

export const SaasInvitedUsersList = (dic) => {
  return [
    {
      title: dic?.FullName,
      width: 25,
    },
    {
      title: dic?.Email,
      width: 25,
    },
    {
      title: dic?.InvitationDate,
      width: 33,
    },
    {
      title: '',
      width: 17,
    },
  ];
};
export const NoneSaasUserListHeaders = (dic) => [
  {
    title: dic?.FullName,
    width: 25,
  },
  {
    title: dic?.UserName,
    width: 25,
  },
  {
    title: dic?.LastActivityTime,
    width: 20,
  },
  {
    title: dic.ResetPassword,
    width: 15,
    centralized: true,
  },
  {
    title: `${dic.Active}/${dic.Inactive}`,
    width: 15,
    centralized: true,
  },
];

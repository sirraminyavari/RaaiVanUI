import useWindowContext from '../../../../hooks/useWindowContext';

const UseUsers = (props) => {
  const { RV_RTL: rtl, RVDic } = useWindowContext();

  /**
   * @description items array to feed breadcrumbs component
   * @type {[{title: string}, {title: string}]}
   */
  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: 'مدیریت کاربران',
      linkTo: '',
    },
    {
      id: 3,
      title: 'اعضای تیم',
      linkTo: '',
    },
  ];

  return {
    rtl,
    RVDic,
  };
};
export default UseUsers;

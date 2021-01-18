import { getURL } from "../../helpers";

const optionsList = [
  {
    title: window.RVDic.Profile,
    icon: "fa-user-circle",
    // imageURL: ((window.RVGlobal || {}).CurrentUser || {}).ImageURL,
    linkTo: getURL("User",{
      UserID: ((window.RVGlobal || {}).CurrentUser || {}).UserID,
      Tab: "resume",
    }),
  },
  {
    title: window.RVDic.Management,
    icon: "fa-wrench",
    linkTo: getURL("AdminPanel"),
    hide: false,
    name: "sysAdmin",
  },
  {
    title: window.RVDic.Reports,
    icon: "fa-bar-chart",
    linkTo: getURL("Reports"),
    hide: false,
    name: "reports",
  },
  {
    title: window.RVDic.Settings,
    icon: "fa-cog",
    onClickButton: () => console.log('setting clicked')
  },
  {
    title: window.RVDic.Help,
    icon: "fa-question",
    linkTo: getURL("Help")
  },
  {
    title: window.RVDic.Logout,
    icon: "fa-power-off",
    onClickButton: () => console.log('logout clicked')
  }
];

export default optionsList;

import {getURL} from "helpers";

const {
  ApplicationID: appId,
  SAASBasedMultiTenancy: isSaas,
  Modules: modules,
} = window.RVGlobal;

const RVDic = window.RVDic;

export const Menu = {
    isMenu: true,
    dontHide: true,
    icon: "fa-user-circle",
    title: RVDic.WorkTable,
    name: "worktableButton",
}

export const SearchOptions = {
    Advanced: {
        icon: "fa-filter",
        title: RVDic.Advanced,
        linkTo: getURL('Classes')
    },
    Users: {
        title: RVDic.KnowledgeWorkers,
        icon: "fa-address-card-o"
    },
    Normal: {
        title: RVDic.Search
    }
}

export const NavbarList = [
    (!appId ? null : {
        icon: "fa-home",
        title: RVDic.Home,
        dontHide: true,
        hideForLarge: true,
        fontSize: "1.2rem",
        linkTo: getURL('Home')
      }),
      (!isSaas ? null : {
          icon: "fa-users",
          title: RVDic.Teams,
          linkTo: getURL('Applications')
      }),
      (!appId || !modules.MSG ? null : {
          icon: "fa-envelope",
          title: RVDic.Messages,
          linkTo: getURL('Messages')
      }),
      (!appId ? null : {
          icon: "fa-inbox",
          title: RVDic.Dashboard,
          linkTo: getURL('Dashboard')
      }),
      (!appId ? null : {
          icon: "fa-bell-o",
          title: RVDic.Notifications
      })
  ].filter((btn) => !!btn);
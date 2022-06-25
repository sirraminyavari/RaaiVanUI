const { GlobalUtilities } = window;

export interface IAuthState {
  orgDomains: string[];
  selectedDomain?: string;
  email?: string;
  emailError?: string;
  password?: string;
  passwordError?: string;
  orgDomainsError?: string;
  objects: {
    invitationId?: string;
  };
  options: {
    returnUrl?: string;
    useCaptcha: boolean;
    reloadAfterLogin: boolean;
  };
  authUser?: any;

  //must decide
  isAuthenticated?: boolean;
  lastLogins: any[];
  loginMessage?: string;
  resetPasswordAddress: {
    email?: string;
    phone?: string;
  };
  isFetching?: boolean;
  fetchingFiles?: boolean;
  routeHistory?: any;
  passwordPolicy?: any;
  showLastLoginsModal?: boolean;
  captchaToken?: any;
  //end of must decide
}

export const EmptyAuthState: IAuthState = {
  orgDomains: [],
  selectedDomain: undefined,
  email: undefined,
  emailError: undefined,
  password: undefined,
  passwordError: undefined,
  orgDomainsError: undefined,
  objects: {
    invitationId: GlobalUtilities?.request_params().get_value('inv'),
  },
  options: {
    returnUrl: undefined,
    useCaptcha: false,
    reloadAfterLogin: false,
  },
  authUser: window.RVGlobal?.CurrentUser,

  //must decide
  isAuthenticated: window.IsAuthenticated,
  lastLogins: [],
  loginMessage: undefined,
  resetPasswordAddress: {},
  //end of: must decide
};

interface ILoginRequest {
  Username: string;
  Password: string;
  InvitationID?: string;
}

export type { ILoginRequest };

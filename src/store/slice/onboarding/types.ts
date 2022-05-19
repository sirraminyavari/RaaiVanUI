export interface IOnboardingState {
  name: string;
  newDocMenu: string;
  fromStep: number;
  active: boolean;
  teamName?: string;
  templates: any[];
}

export const EmptyOnboardingState: IOnboardingState = {
  name: '',
  newDocMenu: '',
  fromStep: 0,
  active: false,
  teamName: undefined,
  templates: [],
};

import { IApplicationState } from 'store/slice/application/types';
import { IOnboardingState } from 'store/slice/onboarding/types';
import { IThemeState } from 'store/slice/theme/types';

export interface RootState {
  theme: IThemeState;
  application: IApplicationState;
  onboarding: IOnboardingState;
}

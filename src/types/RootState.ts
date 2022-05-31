import { IApplicationState } from 'store/slice/applications/types';
import { IMonitoringState } from 'store/slice/monitoring/types';
import { INotificationState } from 'store/slice/notification/types';
import { IOnboardingState } from 'store/slice/onboarding/types';
import { ISidebarState } from 'store/slice/sidebar/types';
import { IThemeState } from 'store/slice/theme/types';

export interface RootState {
  theme: IThemeState;
  applications: IApplicationState;
  onboarding: IOnboardingState;
  notifications: INotificationState;
  sidebarItems: ISidebarState;
  monitoring: IMonitoringState;
}

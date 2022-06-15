import React, { createContext, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { devConsole } from 'helpers/helpers';

import { ONBOARDING_TEMPLATE_PATH } from './constants';
import { useOnboardingSlice } from 'store/slice/onboarding';
import { useDispatch, useSelector } from 'react-redux';
import { selectOnboarding } from 'store/slice/onboarding/selectors';
import {
  EmptyOnboardingState,
  IOnboardingState,
} from 'store/slice/onboarding/types';

export const OnboardingTeamStepContext =
  createContext<IOnboardingState>(EmptyOnboardingState);

export function OnboardingTeamStepContextProvider({ children }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const onboardingState = useSelector(selectOnboarding);
  const { actions: onboardingActions } = useOnboardingSlice();

  useEffect(() => {
    devConsole({ onboardingState });
    if (onboardingState.completed) {
      dispatch(onboardingActions.teamTemplateSelection());
      history.push(ONBOARDING_TEMPLATE_PATH);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingState]);

  return (
    <OnboardingTeamStepContext.Provider value={onboardingState}>
      {children}
    </OnboardingTeamStepContext.Provider>
  );
}

export const useOnboardingTeamContent = () =>
  useContext(OnboardingTeamStepContext);

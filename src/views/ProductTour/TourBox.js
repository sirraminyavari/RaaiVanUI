import { SAVE_USER_SETTINGS_ITEM, USERS_API } from 'constant/apiConstants';
import { API_Provider, decodeBase64 } from 'helpers/helpers';
import useWindowContext from 'hooks/useWindowContext';
import React, { useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useOnboardingSlice } from 'store/slice/onboarding';
import * as Style from './styled';

const saveUserSettingsItem = API_Provider(USERS_API, SAVE_USER_SETTINGS_ITEM);

const TourBox = ({ goTo, current, total, guidance }) => {
  const { RVDic, RVGlobal } = useWindowContext();
  const dispatch = useDispatch();

  const {
    actions: { onboardingName, setNewDocMenu },
  } = useOnboardingSlice();

  useEffect(() => {
    if (current === 2) {
      saveUserSettingsItem.fetch(
        {
          Name: 'tour_intro',
          Value: true,
        },
        (response) => {}
      );
    }
  }, [current]);

  useEffect(() => {
    dispatch(onboardingName('intro'));
  }, []);

  const next = () => {
    if (current === 2) {
      window.scrollTo(0, 0);
      dispatch(setNewDocMenu('opened'));
    }
    goTo(current + 1);
  };

  const letsGo = () => {
    window.location.reload();
  };

  return (
    <Fragment>
      {current === 0 && (
        <Style.Wellcoming>
          <Style.WellcomingTitle>
            {RVDic.WelcomeToRaaiVan.replace(
              '[RaaiVan]',
              decodeBase64(RVGlobal.SystemName)
            )}{' '}
          </Style.WellcomingTitle>
          <Style.WellcomingContent>
            {RVDic.X.ProductTours.Intro.WelcomeMessage}
          </Style.WellcomingContent>
          <Style.WellcomingContent>
            {' '}
            {RVDic.X.ProductTours.Intro.WelcomeConfirm.replace(
              '[RaaiVan]',
              decodeBase64(RVGlobal.SystemName)
            )}{' '}
          </Style.WellcomingContent>

          <Style.WellcomingActionWrapper>
            <Style.NextButton onClick={() => next()}>
              {`${RVDic.Yes}! ${RVDic.WithPleasure}!`}
            </Style.NextButton>
          </Style.WellcomingActionWrapper>
        </Style.Wellcoming>
      )}

      {current !== 0 && (
        <Style.TourWapper>
          <Style.TourDescription> {guidance} </Style.TourDescription>

          <Style.TourActionBar>
            <Style.TourBarBlock>
              {current !== 1 && (
                <Style.PrevButton onClick={() => goTo(current - 1)}>
                  {' '}
                  {RVDic.Previous}{' '}
                </Style.PrevButton>
              )}
            </Style.TourBarBlock>

            <Style.TourBarBlock>
              <span>{current}</span>
              <span>{RVDic.Of}</span>
              <span>{total}</span>
            </Style.TourBarBlock>

            <Style.TourBarBlock>
              {current !== total && (
                <Style.NextButton onClick={() => next()}>
                  {' '}
                  {RVDic.Next}{' '}
                </Style.NextButton>
              )}

              {current === total && (
                <Style.NextButton onClick={() => letsGo()}>
                  {' '}
                  {`${RVDic.Great_exclamation}! ${RVDic.LetsGo}`}{' '}
                </Style.NextButton>
              )}
            </Style.TourBarBlock>
          </Style.TourActionBar>
        </Style.TourWapper>
      )}
    </Fragment>
  );
};
export default TourBox;

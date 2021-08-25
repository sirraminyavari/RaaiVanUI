import { SAVE_USER_SETTINGS_ITEM, USERS_API } from 'constant/apiConstants';
import { API_Provider } from 'helpers/helpers';
import React, { useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import {
  onboardingName,
  setNewDocMenu,
  toggleActivation,
} from 'store/reducers/onboardingReducer';
import * as Style from './styled';

const saveUserSettingsItem = API_Provider(USERS_API, SAVE_USER_SETTINGS_ITEM);

const TourBox = ({ goTo, current, total, guidance }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (current === 2) {
      // saveUserSettingsItem.fetch(
      //   {
      //     Name: 'tour_intro',
      //     Value: true,
      //   },
      //   (response) => {}
      // );
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
            به کلیک مایند خوش اومدی{' '}
          </Style.WellcomingTitle>
          <Style.WellcomingContent>
            اینجا فضای اختصاصی تیمته که با کمک اون قراره حسابی به تیمت کمک کنیم
            حافظه قوی‌تری داشته‌باشه
          </Style.WellcomingContent>
          <Style.WellcomingContent>
            {' '}
            آماده‌ای یه گشت‌و‌گذار کوچولو توی کلیک‌مایندِ خودت بزنی؟{' '}
          </Style.WellcomingContent>

          <Style.WellcomingActionWrapper>
            <Style.NextButton onClick={() => next()}>
              آره! با کمال میل!
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
                  قبلی{' '}
                </Style.PrevButton>
              )}
            </Style.TourBarBlock>

            <Style.TourBarBlock>
              <span>{current}</span>
              <span>از</span>
              <span>{total}</span>
            </Style.TourBarBlock>

            <Style.TourBarBlock>
              {current !== total && (
                <Style.NextButton onClick={() => next()}>
                  {' '}
                  بعدی{' '}
                </Style.NextButton>
              )}

              {current === total && (
                <Style.NextButton onClick={() => letsGo()}>
                  {' '}
                  عالیه! بزن بریم{' '}
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

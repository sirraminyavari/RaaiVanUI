import React, { useEffect, Fragment } from 'react';
import * as Style from './styled';

const TourBox = ({ goTo, current, total, guidance }) => {
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
            <Style.NextButton onClick={() => goTo(current + 1)}>
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
                <Style.NextButton onClick={() => goTo(current + 1)}>
                  {' '}
                  بعدی{' '}
                </Style.NextButton>
              )}

              {current === total && (
                <Style.NextButton onClick={() => goTo(current)}>
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
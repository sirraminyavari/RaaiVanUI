import Heading from 'components/Heading/Heading';
import useWindow from 'hooks/useWindowContext';
import React from 'react';
import * as Styled from '../../../Teams.styles';
import Button from 'components/Buttons/Button';
import UsersIcon from 'components/Icons/UsersIcon/Users';
import CloudIcon from 'components/Icons/CloudIcon/CloudIcon';

const WorkspaceSubscription = ({ sectionTitle }) => {
  const { RVDic } = useWindow();
  return (
    <>
      <Styled.WorkspaceAccountSubscriptionContainer>
        <Heading type="h2" className="sectionTitle">
          اشتراک‌های جاری
        </Heading>

        <Styled.WorkspaceAccountSubscriptionItem>
          <div>
            <Styled.WorkspaceAccountSubscriptionItemTitleContainer>
              <Styled.WorkspacePlanImage>
                <UsersIcon />
              </Styled.WorkspacePlanImage>
              <Styled.WorkspaceAccountSubscriptionItemTitle>
                <Styled.WorkspacePrimaryText>
                  رایگان
                </Styled.WorkspacePrimaryText>
                <Styled.WorkspaceSecondaryText>
                  همیشه - 1400/01/09
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemTitle>
            </Styled.WorkspaceAccountSubscriptionItemTitleContainer>
            <Styled.WorkspaceAccountSubscriptionItemIconWrapper>
              <Styled.WorkspaceAccountSubscriptionItemIcon>
                <UsersIcon />
                <Styled.WorkspaceSecondaryText>
                  5 کاربر
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemIcon>
              <Styled.WorkspaceAccountSubscriptionItemIcon>
                <CloudIcon />
                <Styled.WorkspaceSecondaryText>
                  5 گیگابایت
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemIcon>
            </Styled.WorkspaceAccountSubscriptionItemIconWrapper>
          </div>
          <div>
            <Button>ارتقای طرح</Button>
            <div style={{ width: '10rem' }}>
              <Styled.WorkspaceSecondaryText>
                بی‌نهایت روز مانده
              </Styled.WorkspaceSecondaryText>

              <Styled.WorkspaceAccountSubscriptionProgressBar progressPercentage="80" />
            </div>
          </div>
        </Styled.WorkspaceAccountSubscriptionItem>
      </Styled.WorkspaceAccountSubscriptionContainer>

      <Styled.WorkspaceAccountSubscriptionContainer>
        <Heading type="h2" className="sectionTitle">
          اشتراک‌های گذشته
        </Heading>

        <Styled.WorkspaceAccountSubscriptionItem>
          <div>
            <Styled.WorkspaceAccountSubscriptionItemTitleContainer>
              <Styled.WorkspacePlanImage muted>
                <UsersIcon />
              </Styled.WorkspacePlanImage>
              <Styled.WorkspaceAccountSubscriptionItemTitle>
                <Styled.WorkspacePrimaryText>
                  رایگان
                </Styled.WorkspacePrimaryText>
                <Styled.WorkspaceSecondaryText>
                  همیشه - 1400/01/09
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemTitle>
            </Styled.WorkspaceAccountSubscriptionItemTitleContainer>
            <Styled.WorkspaceAccountSubscriptionItemIconWrapper>
              <Styled.WorkspaceAccountSubscriptionItemIcon>
                <UsersIcon />
                <Styled.WorkspaceSecondaryText>
                  5 کاربر
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemIcon>
              <Styled.WorkspaceAccountSubscriptionItemIcon>
                <CloudIcon />
                <Styled.WorkspaceSecondaryText>
                  5 گیگابایت
                </Styled.WorkspaceSecondaryText>
              </Styled.WorkspaceAccountSubscriptionItemIcon>
            </Styled.WorkspaceAccountSubscriptionItemIconWrapper>
          </div>
          <div>
            <Button type="primary-o">دریافت فاکتور</Button>
            <div style={{ width: '10rem' }}>
              {/* <Styled.WorkspaceDeleteBadge>
                اشتراک پایان یافته
              </Styled.WorkspaceDeleteBadge> */}
              <Styled.WorkspaceDefaultBadge>
                اشتراک پایان یافته
              </Styled.WorkspaceDefaultBadge>
            </div>
          </div>
        </Styled.WorkspaceAccountSubscriptionItem>
      </Styled.WorkspaceAccountSubscriptionContainer>
    </>
  );
};

export default WorkspaceSubscription;

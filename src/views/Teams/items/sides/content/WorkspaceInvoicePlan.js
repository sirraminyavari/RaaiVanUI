import WelcomeLayout from 'layouts/WelcomeLayout';
import useWindow from 'hooks/useWindowContext';
import React, { useState } from 'react';
import * as Styled from './../../../Teams.styles';
import EditIcon from 'components/Icons/EditIcons/Pencil';
import UsersIcon from 'components/Icons/UsersIcon/Users';
import Button from 'components/Buttons/Button';
import { useHistory, useParams } from 'react-router-dom';
import { WORKSPACE_PLANS_PATH } from '../../others/constants';

const WorkspaceInvoicePlan = () => {
  const { RVDic } = useWindow();
  const history = useHistory();
  const { id: WorkspaceID } = useParams();

  const [isYearlyPrices, setIsYearlyPrices] = useState(false);

  //! RVDic i18n variables
  const RVDicDiscountCode = RVDic.DiscountCode;
  const RVDicServiceFee = RVDic.ServiceFee;
  const RVDicCurrencyToman = RVDic.CRNCY.IRT;

  const handleReturnToPlansView = () =>
    history.push(`${WORKSPACE_PLANS_PATH}/${WorkspaceID}`);

  return (
    <WelcomeLayout noOutline>
      <div
        className="rv-border-radius-1 "
        style={{
          boxShadow: '1px 5px 15px #0000001f',
        }}>
        <Styled.WorkspaceInvoicePlanHeader>
          <span>{'انتخاب طرح'}</span>
          <EditIcon onClick={handleReturnToPlansView} />
        </Styled.WorkspaceInvoicePlanHeader>
        <Styled.WorkspacePlansContainer rowItemsCount="1" columnWidth={'100%'}>
          <Styled.WorkspacePlanItem className={`${isYearlyPrices && 'active'}`}>
            <Styled.WorkspacePlanContent>
              <Styled.WorkspacePlanImage
                pop
                size="5rem"
                className={'planImage'}>
                <UsersIcon />
              </Styled.WorkspacePlanImage>
              <Styled.WorkspacePrimaryText>حرفه ای</Styled.WorkspacePrimaryText>
              <Styled.WorkspaceSecondaryText>
                مناسب کسب‌وکارهای کوچک و متوسط
              </Styled.WorkspaceSecondaryText>

              <Styled.WorkspaceInvoicePlanDetailsContainer>
                <Styled.WorkspaceSecondaryText>
                  <strong>{RVDicServiceFee}</strong>
                </Styled.WorkspaceSecondaryText>
                <Styled.WorkspaceInvoicePlanDetailsPrice>
                  290,000{RVDicCurrencyToman}
                </Styled.WorkspaceInvoicePlanDetailsPrice>
              </Styled.WorkspaceInvoicePlanDetailsContainer>

              <Styled.WorkspaceInvoicePlanDetailsContainer>
                <Styled.WorkspaceSecondaryText>
                  <strong>{'هزینه فضای اضافی'}</strong>
                </Styled.WorkspaceSecondaryText>
                <Styled.WorkspaceInvoicePlanDetailsPrice>
                  290,000{RVDicCurrencyToman}
                </Styled.WorkspaceInvoicePlanDetailsPrice>
              </Styled.WorkspaceInvoicePlanDetailsContainer>

              <Styled.WorkspaceInvoicePlanDetailsContainer>
                <Styled.WorkspaceInvoicePlanDetailsCoupon>
                  {RVDicDiscountCode}
                </Styled.WorkspaceInvoicePlanDetailsCoupon>
                <Styled.WorkspaceInvoicePlanDetailsCoupon>
                  290,000{RVDicCurrencyToman}
                </Styled.WorkspaceInvoicePlanDetailsCoupon>
              </Styled.WorkspaceInvoicePlanDetailsContainer>
            </Styled.WorkspacePlanContent>
          </Styled.WorkspacePlanItem>
        </Styled.WorkspacePlansContainer>

        <Styled.WorkspacePlansContainer rowItemsCount="1" columnWidth={'100%'}>
          <div>
            <Styled.WorkspaceInvoicePlanDetailsContainer noSeparator>
              <Styled.WorkspaceSecondaryText>
                {'مبلغ نهایی قابل پرداخت'}
              </Styled.WorkspaceSecondaryText>
              <Styled.WorkspaceInvoicePlanDetailsPrice>
                290,000{RVDicCurrencyToman}
              </Styled.WorkspaceInvoicePlanDetailsPrice>
            </Styled.WorkspaceInvoicePlanDetailsContainer>
            <div>
              <Button type="primary">تایید و پرداخت</Button>
            </div>
          </div>
        </Styled.WorkspacePlansContainer>
      </div>
    </WelcomeLayout>
  );
};

export default WorkspaceInvoicePlan;

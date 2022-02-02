import WelcomeLayout from 'layouts/WelcomeLayout';
import useWindow from 'hooks/useWindowContext';
import React, { useState } from 'react';
import * as Styled from './../../../Teams.styles';
import styled from 'styled-components';
import WorkspaceInvoiceBanner from './../welcome/WorkspaceInvoiceWelcome';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import { selectStyles } from '../../others/select/Select.styles';
import NumberInput from 'components/Inputs/Number/NumberInput';
import CheckIcon from 'components/Icons/CheckIcons/Check';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const purchaseDurations = [
  { value: '1', label: 'یک ساله (30% تخفیف)' },
  { value: '2', label: 'یک ساله (50% تخفیف)' },
  { value: '3', label: 'یک ساله (60% تخفیف)' },
];
const WorkspaceInvoicePlanForm = () => {
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [coupon, setCoupon] = useState('');

  const isTabletOrMobile = DimensionHelper().isTabletOrMobile;
  const { RVDic } = useWindow();

  //! RVDic i18n variables
  const RVDicGigaBytes = RVDic.GigaBytes;
  const RVDicDuration = RVDic.Duration;
  const RVDicDiscountCode = RVDic.DiscountCode;
  const RVDicPaymentGateway = RVDic.PaymentGateway;

  return (
    <CustomWelcomeLayout noOutline singleColumn={isTabletOrMobile}>
      <div>
        <Styled.WorkspaceInvoicePlanFormDetailsContainer noSeparator>
          <span>{RVDicDuration}</span>
          <CustomSelect
            options={purchaseDurations}
            defaultValue={purchaseDurations[2]}
            onChange={(e) => alert(e.label)}
            styles={selectStyles}
          />
          <span />
        </Styled.WorkspaceInvoicePlanFormDetailsContainer>
        <Styled.WorkspaceInvoicePlanFormDetailsContainer noSeparator>
          <span>فضای ذخیره‌سازی اضافی</span>
          <NumberInput step={5} defaultValue={1} />
          <Styled.WorkspaceSecondaryText>
            {RVDicGigaBytes}
          </Styled.WorkspaceSecondaryText>
        </Styled.WorkspaceInvoicePlanFormDetailsContainer>
        <Styled.WorkspaceInvoicePlanFormDetailsContainer noSeparator>
          <span>تعداد اعضای تیم</span>
          <NumberInput step={10} defaultValue={0} />
          <Styled.WorkspaceSecondaryText>کاربر</Styled.WorkspaceSecondaryText>
        </Styled.WorkspaceInvoicePlanFormDetailsContainer>
        <Styled.WorkspaceInvoicePlanFormDetailsContainer noSeparator>
          <span>{RVDicDiscountCode} </span>
          <AnimatedInput
            value={coupon}
            onChange={setCoupon}
            placeholder={RVDicDiscountCode}
          />
          <Styled.WorkspaceInvoiceCouponIconWrapper>
            {Boolean(coupon.length) && <CheckIcon />}
          </Styled.WorkspaceInvoiceCouponIconWrapper>
        </Styled.WorkspaceInvoicePlanFormDetailsContainer>

        <Styled.WorkspaceInvoicePaymentGatewayContainer>
          <strong>{RVDicPaymentGateway}</strong>
          <Styled.WorkspaceInvoicePaymentGatewayChoicesContainer>
            {new Array(3).fill().map((_, idx) => (
              <Styled.WorkspaceInvoicePaymentGatewayChoice
                active={idx === paymentMethod}
                onClick={() => setPaymentMethod(idx)}>
                <img src="https://via.placeholder.com/96" />
              </Styled.WorkspaceInvoicePaymentGatewayChoice>
            ))}
          </Styled.WorkspaceInvoicePaymentGatewayChoicesContainer>
        </Styled.WorkspaceInvoicePaymentGatewayContainer>
      </div>
      <WorkspaceInvoiceBanner />
    </CustomWelcomeLayout>
  );
};

export default WorkspaceInvoicePlanForm;

const CustomWelcomeLayout = styled(WelcomeLayout)`
  min-height: auto;
  > div:last-of-type {
    width: 50%;
  }
`;

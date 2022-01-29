import useWindow from 'hooks/useWindowContext';
import React from 'react';
import * as Styled from './../../../Teams.styles';
import Button from 'components/Buttons/Button';
import UsersIcon from 'components/Icons/UsersIcon/Users';
import { AiOutlineLeftCircle } from 'react-icons/ai';
import { useHistory, useParams } from 'react-router-dom';
import { WORKSPACE_INVOICE_PATH } from '../../others/constants';

const WorkspacePlanItem = ({ isYearlyPrices }) => {
  const { RVDic } = useWindow();
  const history = useHistory();
  const { id: WorkspaceID } = useParams();

  const handlePlanSelection = () => {
    history.push(`${WORKSPACE_INVOICE_PATH}/${WorkspaceID}`);
  };

  return (
    <Styled.WorkspacePlanItem className={`${isYearlyPrices && 'active'}`}>
      <Styled.WorkspacePlanContent>
        <Styled.WorkspacePlanImage pop size="5rem">
          <UsersIcon />
        </Styled.WorkspacePlanImage>

        <div className="planPrice">
          {isYearlyPrices ? (
            <span className="noPriceTag">رایگان </span>
          ) : (
            <>
              <span className="offPrice">۲۷٫۰۰۰</span>
              <span className="price">۲۷٫۰۰۰</span>
              <span className="currency">تومان</span>
            </>
          )}
        </div>
        <Styled.WorkspaceSecondaryText>
          برای هر کاربر در ماه
        </Styled.WorkspaceSecondaryText>
        <Styled.WorkspacePrimaryText>حرفه ای</Styled.WorkspacePrimaryText>
        <Styled.WorkspaceSecondaryText>
          مناسب کسب‌وکارهای کوچک و متوسط
        </Styled.WorkspaceSecondaryText>
        {new Array(3).fill(undefined).map(() => {
          return (
            <div className="planDescription">
              <AiOutlineLeftCircle />
              ده گیگابایت فضای ذخیره‌سازی
            </div>
          );
        })}
        <div className="planActionButton">
          <Button type="primary" onClick={handlePlanSelection}>
            انتحاب طرح
          </Button>
        </div>
      </Styled.WorkspacePlanContent>
    </Styled.WorkspacePlanItem>
  );
};

export default WorkspacePlanItem;

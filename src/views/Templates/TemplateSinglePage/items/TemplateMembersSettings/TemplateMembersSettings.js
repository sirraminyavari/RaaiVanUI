import TemplateMembersOtherSettingBlock from './items/TemplateMembersOtherSettingBlock';
import TemplateMembersUsersBlock from './items/TemplateMembersUsersBlock';
import * as Styled from './TemplateMembersSettingStyles';
import { useState, useEffect } from 'react';
import { decodeBase64 } from 'helpers/helpers';
import { useTemplateContext } from '../../TemplateProvider';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import api from 'apiHelper';

const TemplateMembersSettings = () => {
  const { RVDic, RV_RTL: rtl } = window;
  const { title } = useTemplateContext();

  const breadItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: RVDic?.TemplateManagement,
      linkTo: '',
    },
    {
      id: 3,
      title: `قالب ${decodeBase64(title)}`,
      linkTo: '',
    },
    {
      id: 4,
      title: RVDic?.Members,
      linkTo: '',
    },
  ];

  return (
    <>
      <Styled.MemberBlock>
        <Breadcrumb items={breadItems} />
        <Styled.ReturnButton rtl={rtl}>{RVDic?.Return}</Styled.ReturnButton>
        <TemplateMembersUsersBlock />
      </Styled.MemberBlock>

      <Styled.MemberBlock>
        <TemplateMembersOtherSettingBlock />
      </Styled.MemberBlock>
    </>
  );
};
export default TemplateMembersSettings;

import TemplateMembersOtherSettingBlock from './items/TemplateMembersOtherSettingBlock';
import TemplateMembersUsersBlock from './items/TemplateMembersUsersBlock';
import * as Styled from './TemplateMembersSettingStyles';
import { useState, useEffect } from 'react';
import { decodeBase64 } from 'helpers/helpers';
import { useTemplateContext } from '../../TemplateProvider';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import api from 'apiHelper';
import {
  TEAM_SETTINGS_PATH,
  TEMPLATES_SETTING_PATH,
  TEMPLATES_SETTING_SINGLE_PATH,
} from 'constant/constants';
import ReturnButton from 'components/Buttons/ReturnButton';
import { useHistory } from 'react-router-dom';

const TemplateMembersSettings = () => {
  const { RVDic, RV_RTL: rtl } = window;
  const { Title, NodeTypeID } = useTemplateContext();
  const history = useHistory();

  const returnToTemplates = () =>
    history.push(TEMPLATES_SETTING_SINGLE_PATH.replace(':id', NodeTypeID));

  const breadItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      // linkTo: TEAM_SETTINGS_PATH.replace(':id', NodeTypeID),
    },
    {
      id: 2,
      title: RVDic?.TemplateManagement,
      linkTo: TEMPLATES_SETTING_PATH,
    },
    {
      id: 3,
      title: `قالب ${decodeBase64(Title)}`,
      linkTo: TEMPLATES_SETTING_SINGLE_PATH.replace(':id', NodeTypeID),
    },
    {
      id: 4,
      title: RVDic?.Members,
    },
  ];

  return (
    <>
      <Styled.MemberBlock>
        <Styled.HeaderContainer>
          <Breadcrumb items={breadItems} />

          <ReturnButton onClick={returnToTemplates} />
        </Styled.HeaderContainer>
        <TemplateMembersUsersBlock />
      </Styled.MemberBlock>

      <Styled.MemberBlock>
        <TemplateMembersOtherSettingBlock />
      </Styled.MemberBlock>
    </>
  );
};
export default TemplateMembersSettings;

import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useEffect, useState } from 'react';
import * as Styled from './monitoring.styles';
import { USER_PATH, USER_SECURITY_PATH } from '../../constant/constants';
import useWindow from 'hooks/useWindowContext';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import FilterBar from 'components/AdvancedSearch/items/FilterBar/FilterBar';
import { advancedSearchButtonRef } from 'components/AdvancedSearch/items/FilterBar/FilterBar';
import Heading from 'components/Heading/Heading';
import {
  AdvancedFilterDialog,
  TopFilter,
} from '../../components/AdvancedSearch/AdvancedSearch.style';
import APIHandler from '../../apiHelper/APIHandler';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import AdvanceSearchDesktop from '../../components/AdvancedSearch/AdvancedSearchDesktop';
import AutoSuggestInput from 'components/Inputs/AutoSuggestInput/AutoSuggestInput';
import AdvancedSearch from 'views/Classes/Classes-old';
import AdvancedSearchView from 'views/Classes/Classes';

/**
 * According to screen dimension returns the suitable component.
 * @param {any} -  the all component props.
 */

const MonitoringView = ({ ...props }) => {
  const breadcrumbItems = [
    { id: 1, title: 'پنل مدیریت', linkTo: USER_PATH },
    {
      id: 2,
      title: 'گزارشات',
      linkTo: USER_SECURITY_PATH,
    },
    {
      id: 2,
      title: 'گزارش تیم ها',
      linkTo: USER_SECURITY_PATH,
    },
  ];

  const InputContainer = styled.div`
    position: relative;
    width: 100%;
  `;

  return (
    <Styled.Container>
      <Breadcrumb items={breadcrumbItems} />
      <Styled.Title>
        <Heading className="" type={'h1'}>
          {'تیم ها '}
        </Heading>
      </Styled.Title>
      <AnimatedInput name="search" label="search" />
    </Styled.Container>
  );
};

export default MonitoringView;

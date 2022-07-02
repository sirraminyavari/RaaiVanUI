import * as Styles from './TemplateItemSettingStyles';
import { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import icon from 'assets/images/marketing.png';
import { HiLightningBolt } from 'react-icons/hi';
import TemplateItemSettingExcelRegister from './items/TemplateItemSettingExcelRegister';
import TemplateItemSettingXMlRegister from './items/TemplateItemSettingXmlRegister';
import ArchiveIcon from 'components/Icons/ArchiveIcon/ArchiveIcon';
import TemplateItemSettingListItem from './items/TemplateItemSettingListItem';
import TemplateItemSettingAddNew from './items/TemplateItemSettingAddNode';
import TemplateItemSettingListTree from './items/TemplateItemSettingListTree';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import { IoGitBranchOutline } from 'react-icons/io5';
import { useTemplateItemContext } from './TemplateItemProvider';

const TemplateItems = () => {
  const { RVDic, RV_RTL } = window;

  const {
    nodes,
    isTree,
    createNewNode,
    setCreateNewNode,
    toggleView,
    breadItems,
    scrollOptions,
    toggleArchiveState,
    totalNodes,
    nodesQuery,
    setNodesQuery,
  } = useTemplateItemContext();

  const list = useMemo(() => {
    if (!isTree || nodesQuery?.Archive || nodesQuery?.searchText !== '') {
      return (
        <Styles.ListWrapper>
          <ScrollBarProvider
            direction={RV_RTL ? 'right' : 'left'}
            scrollEndOptions={scrollOptions}
          >
            <Styles.ListContainer>
              {createNewNode && (
                <Styles.AddNewItemWapper>
                  <TemplateItemSettingAddNew
                    onClose={() => setCreateNewNode(false)}
                  />
                </Styles.AddNewItemWapper>
              )}
              {nodes?.map((i) => {
                const { NodeID } = i;
                return <TemplateItemSettingListItem key={NodeID} {...i} />;
              })}
            </Styles.ListContainer>
          </ScrollBarProvider>
        </Styles.ListWrapper>
      );
    } else {
      return (
        <>
          <Styles.TreeHeading>
            <Styles.TilteHeading>{'نام آیتم'}</Styles.TilteHeading>
            <Styles.CodeTitleHaeading>{'کد آبتم'}</Styles.CodeTitleHaeading>
            <Styles.CreationDateHeading>
              {'تاریخ ایجاد'}
            </Styles.CreationDateHeading>
            <Styles.ThumbnailHeading></Styles.ThumbnailHeading>
          </Styles.TreeHeading>
          <Styles.TreeWrapper>
            <ScrollBarProvider
              direction={RV_RTL ? 'right' : 'left'}
              scrollEndOptions={scrollOptions}
            >
              <Styles.ListContainer>
                {createNewNode && (
                  <Styles.TreeAddNewItemWapper>
                    <TemplateItemSettingAddNew
                      onClose={() => setCreateNewNode(false)}
                    />
                  </Styles.TreeAddNewItemWapper>
                )}
                <TemplateItemSettingListTree nodes={nodes} />
              </Styles.ListContainer>
            </ScrollBarProvider>
          </Styles.TreeWrapper>
        </>
      );
    }
  }, [nodes, isTree, createNewNode]);

  return (
    <>
      <Styles.TemplateItemContainer>
        <Breadcrumb items={breadItems} />
        <Styles.TemplateItemRowSection>
          <Styles.TitleIcon src={icon} />

          <Styles.Title>{'اسناد مارکتینگ'}</Styles.Title>

          <Styles.NodeCounts>{`${totalNodes} مورد`}</Styles.NodeCounts>

          <Styles.Spacer />

          {!nodesQuery?.Archive && (
            <Styles.CreateNodeButton onClick={() => setCreateNewNode(true)}>
              <HiLightningBolt size={20} />
              <div>{'سند مارکتینگ جدید'}</div>
            </Styles.CreateNodeButton>
          )}

          {nodesQuery?.Archive && (
            <Styles.ReturnButton onClick={toggleArchiveState}>
              {RVDic?.Return}
            </Styles.ReturnButton>
          )}
        </Styles.TemplateItemRowSection>

        <Styles.TemplateItemRowSection>
          <Styles.SeachBox
            delayTime={1000}
            value={nodesQuery?.searchText}
            onChange={(e) => {
              setNodesQuery({ ...nodesQuery, searchText: e?.target?.value });
            }}
          />

          <Styles.Spacer />

          {!nodesQuery.Archive && (
            <>
              <Styles.TreeButton onClick={toggleView}>
                <IoGitBranchOutline size={24} />
              </Styles.TreeButton>

              <Styles.ArchiveButton onClick={toggleArchiveState}>
                <ArchiveIcon size={16} />
                <div>{RVDic?.Archive}</div>
              </Styles.ArchiveButton>

              <TemplateItemSettingXMlRegister />

              <TemplateItemSettingExcelRegister />
            </>
          )}
        </Styles.TemplateItemRowSection>

        {list}
      </Styles.TemplateItemContainer>
    </>
  );
};
export default TemplateItems;

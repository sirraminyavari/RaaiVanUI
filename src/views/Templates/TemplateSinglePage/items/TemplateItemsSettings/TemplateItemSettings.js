import * as Styles from './TemplateItemSettingStyles';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useTemplateContext } from '../../TemplateProvider';
import api from 'apiHelper';
import { decodeBase64 } from 'helpers/helpers';
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

const TemplateItemSettings = () => {
  const { RVDic, RV_RTL } = window;
  const { NodeTypeID, title, IsTree } = useTemplateContext();
  const [nodes, setNodes] = useState([]);
  const [totalNodes, setTotalNodes] = useState();
  const [nextPageIsLoading, setNextPageIsLoading] = useState(false);
  const [isTree, setIsTree] = useState(IsTree);

  const breadItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: 'مدیریت قالب ها',
      linkTo: '',
    },
    {
      id: 3,
      title: `قالب ${decodeBase64(title)}`,
      linkTo: '',
    },
    {
      id: 4,
      title: 'تنظیمات پیشرفته',
      linkTo: '',
    },
  ];

  const [nodesQuery, setNodesQuery] = useState({
    searchText: '',
    LowerBoundary: 1,
    Count: 10,
  });

  const [createNewNode, setCreateNewNode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { TotalCount, Nodes } = await api?.CN?.getNodes({
        LowerBoundary: nodesQuery?.LowerBoundary,
        Archive: nodesQuery?.Archive,
        SearchText: nodesQuery?.searchText,
      });
      setNodes([...nodes, ...Nodes]);
      setNextPageIsLoading(false);
      setTotalNodes(TotalCount);
    };

    fetchData();
  }, [nodesQuery]);

  const toggleArchiveState = () => {
    setNodes([]);
    setNodesQuery({
      ...nodesQuery,
      LowerBoundary: 1,
      Archive: !nodesQuery?.Archive,
    });
  };

  const scrollOptions = {
    offset: 200,
    onEndReach: () => {
      if (!nextPageIsLoading) {
        setNextPageIsLoading(true);
        loadMore();
      }
    },
  };

  const loadMore = () => {
    if (nodes.length >= totalNodes) return;
    const lowerBoundary = nodes?.length + 1;
    setNodesQuery({ ...nodesQuery, LowerBoundary: lowerBoundary });
  };

  const list = useMemo(() => {
    if (!isTree || nodesQuery?.Archive) {
      return (
        <Styles.ListWrapper>
          <ScrollBarProvider
            direction={RV_RTL ? 'right' : 'left'}
            scrollEndOptions={scrollOptions}
          >
            {createNewNode && !nodesQuery?.Archive && (
              <Styles.AddNewItemWapper>
                <TemplateItemSettingAddNew onClose={setCreateNewNode(false)} />
              </Styles.AddNewItemWapper>
            )}
            {nodes?.map((i) => {
              const { NodeID } = i;
              return <TemplateItemSettingListItem key={NodeID} {...i} />;
            })}
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
              <TemplateItemSettingListTree nodes={nodes} />
            </ScrollBarProvider>
          </Styles.TreeWrapper>
        </>
      );
    }
  }, [nodes, isTree]);

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
              <Styles.TreeButton onClick={() => setIsTree(!isTree)}>
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
export default TemplateItemSettings;

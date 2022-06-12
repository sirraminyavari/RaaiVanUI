import * as Styles from './TemplateItemSettingStyles';
import { useState, useEffect, useMemo } from 'react';
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
import { ScrollProvider } from 'views/Node/nodeDetails/NodeDetails.style';
import TemplateItemSettingAddNew from './items/TemplateItemSettingAddNode';
import { StyledAnimatedInput } from 'views/AdminPanel/PanelsView/Users/items/invitation/InvitaionStyle';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

const TemplateItemSettings = () => {
  const { RVDic } = window;
  const { NodeTypeID, title, ...context } = useTemplateContext();
  const [nodes, setNodes] = useState([]);
  const [totalNodes, setTotalNodes] = useState();
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
  const [createNewNode, setCreateNewNode] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { TotalCount, Nodes, ...rest } = await api?.CN?.getNodes({
        LowerBoundary: nodesQuery?.LowerBoundary,
        Archive: nodesQuery?.Archive,
        SearchText: nodesQuery?.searchText,
      });
      console.log(TotalCount, Nodes, rest);
      const _nodes = nodes.concat(Nodes);
      setNodes(_nodes);
      setTotalNodes(TotalCount);
    };

    fetchData();
  }, [nodesQuery]);

  const toggleArchiveState = () => {
    setNodes([]);
    setNodesQuery({ ...nodesQuery, Archive: !nodesQuery?.Archive });
  };

  const list = useMemo(() => {
    return nodes.map((i) => {
      const { NodeID } = i;
      return <TemplateItemSettingListItem key={NodeID} {...i} />;
    });
  }, [nodes]);

  const loadMore = () => {
    if (nodes.length >= totalNodes) return;

    const lowerBoundary = nodesQuery?.LowerBoundary + 1;
    setNodesQuery({ ...nodesQuery, LowerBoundary: lowerBoundary });
  };

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
            <Styles.CreateNodeButton>
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
              console.log(e);
              setNodesQuery({ ...nodesQuery, searchText: e?.target?.value });
            }}
          />

          <Styles.Spacer />

          {!nodesQuery.Archive && (
            <>
              <Styles.ArchiveButton onClick={toggleArchiveState}>
                <ArchiveIcon size={16} />
                <div>{RVDic?.Archive}</div>
              </Styles.ArchiveButton>

              <TemplateItemSettingXMlRegister />

              <TemplateItemSettingExcelRegister />
            </>
          )}
        </Styles.TemplateItemRowSection>

        {createNewNode && (
          <TemplateItemSettingAddNew>
            <Styles.AddNewNodeActionRow>
              <Styles.SaveNewNodeButton>{RVDic?.Save}</Styles.SaveNewNodeButton>

              <Styles.SaveAndAddNewNodeButton>
                {'ذخیره و ایجاد بعدی'}
              </Styles.SaveAndAddNewNodeButton>

              <Styles.CancelNodeCreateButton>
                <CloseIcon outline={true} size={20} />
              </Styles.CancelNodeCreateButton>
            </Styles.AddNewNodeActionRow>
          </TemplateItemSettingAddNew>
        )}
        <div>{list}</div>
      </Styles.TemplateItemContainer>
    </>
  );
};
export default TemplateItemSettings;

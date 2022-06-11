import * as Styles from './TemplateItemSettingStyles';
import { useState, useEffect } from 'react';
import { useTemplateContext } from '../../TemplateProvider';
import api from 'apiHelper';
import { decodeBase64 } from 'helpers/helpers';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';

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
    Count: 12,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { TotalCount, Nodes, ...rest } = await api?.CN?.getNodes({
        NodeTypeIDs: [],
        LowerBoundary: 2,
      });
      console.log(rest);
      setNodes(Nodes);
      setTotalNodes(TotalCount);
    };

    fetchData();
  }, [nodesQuery]);

  return (
    <>
      <Styles.TemplateItemContainer>
        <Breadcrumb items={breadItems} />
      </Styles.TemplateItemContainer>
    </>
  );
};
export default TemplateItemSettings;

import API from 'apiHelper';
import { createFormInstance } from 'apiHelper/apiFunctions';
import APIHandler from 'apiHelper/APIHandler';
import useWindow from 'hooks/useWindowContext';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Collector from '../nodeDetails/items/Collector';

const ownerForm = new APIHandler('FGAPI', 'GetOwnerForm');

export const PropsContext = React.createContext();

const NodeDetails = (props) => {
  const { route } = props || {};
  const { id: NodeTypeID } = useParams();
  const [FormInstance, setFormInstance] = useState();
  const [InstanceID, setInstanceID] = useState();
  const { RVGlobal } = useWindow();

  useEffect(() => {
    ownerForm?.fetch({ OwnerID: NodeTypeID }, async (result) => {
      const formId = result?.FormID;
      const {
        Instance: { InstanceID },
      } = await createFormInstance(formId, NodeTypeID, true);

      const formInstance = await API.FG.getFormInstance({
        InstanceID,
        LimitOwnerID: null,
        ShowAllIfNoLimit: true,
      });
      setInstanceID(InstanceID);
      setFormInstance({
        ...formInstance,
        Editable: true,
        Name: { Editable: true, Value: '' },
        Description: { Editable: true, Value: '' },
        Keywords: { Editable: true, Value: [] },
        Contributors: { Value: [{ ...RVGlobal.CurrentUser, Share: 100 }] },
        NodeID: NodeTypeID,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PropsContext.Provider value={props}>
      {FormInstance && (
        <Collector
          newNode
          nodeId={NodeTypeID}
          nodeDetails={FormInstance}
          InstanceID={InstanceID}
          hierarchy={route?.Hierarchy || []}
          {...props}
        />
      )}
    </PropsContext.Provider>
  );
};
export default NodeDetails;

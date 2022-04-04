import { useState, useEffect } from 'react';
import Legacy from './Legacy';
import Block from './Block';
import styled from 'styled-components';
import APIHandler from 'apiHelper/APIHandler';
import Button from 'components/Buttons/Button';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';

const nodeTypeId = 'A993A152-A04D-488F-AF62-88943E225BCE';

const Editor = () => {
  const [blockEditorPage, setBlockEditorPage] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [adding, setAdding] = useState(false);
  const { Base64, RVDic, RV_RTL, GlobalUtilities } = window;

  useEffect(() => {
    new APIHandler('CNAPI', 'GetNodes').fetch(
      { NodeTypeID: nodeTypeId, Count: 1000 },
      (result) => {
        setNodes((result || {}).Nodes || []);
      }
    );
  }, []);

  const addNode = () => {
    setAdding(true);

    new APIHandler('CNAPI', 'AddNode').fetch(
      {
        NodeTypeID: nodeTypeId,
        Name: Base64.encode('شماره ' + (nodes.length + 1)),
      },
      (result) => {
        setAdding(false);
        if ((result || {}).Node) setNodes([result.Node].concat(nodes));
      }
    );
  };

  const changeLanguage = () => {
    GlobalUtilities.set_cookie('rv_lang', RV_RTL ? 'en' : 'fa');
    window.location.href = window.location.href;
  };

  return (
    <MainWrapper>
      <Wrapper>
        <Items>
          <Button
            type="negative-o"
            style={{ marginBottom: '1rem' }}
            loading={adding}
            onClick={addNode}
          >
            {'+ ' + RVDic.Add}
          </Button>
          {nodes.map((nd) => (
            <Button
              key={nd.NodeID}
              type={selectedId === nd.NodeID ? 'primary-o' : 'primary'}
              onClick={() => setSelectedId(nd.NodeID)}
              style={{ marginBottom: '0.5rem' }}
            >
              {Base64.decode(nd.Name)}
            </Button>
          ))}
        </Items>
        <ContentPanel>
          <Settings>
            <div style={{ flex: '0 0 auto' }}>
              <Button type="secondary-o" onClick={changeLanguage}>
                {RV_RTL ? 'تغییر زبان به انگلیسی' : 'change language to Farsi'}
              </Button>
            </div>
            <div style={{ flex: '1 1 auto' }}></div>
            <div style={{ flex: '0 0 auto' }}>
              <Button
                type="secondary-o"
                onClick={() => setBlockEditorPage(!blockEditorPage)}
              >
                <ArrowIcon
                  dir={RV_RTL ? 'right' : 'left'}
                  style={{ marginInlineEnd: '0.5rem' }}
                ></ArrowIcon>
                {RV_RTL
                  ? blockEditorPage
                    ? 'ویرایشگر قدیمی'
                    : 'ویرایشگر بلوکی'
                  : blockEditorPage
                  ? 'legacy editor'
                  : 'block editor'}
              </Button>
            </div>
          </Settings>
          <EditorContainer>
            {blockEditorPage ? (
              <Block
                nodeId={selectedId}
                lang={RV_RTL ? 'fa' : 'en'}
                dir={RV_RTL ? 'rtl' : 'ltr'}
              />
            ) : (
              <Legacy nodeId={selectedId} />
            )}
          </EditorContainer>
        </ContentPanel>
      </Wrapper>
    </MainWrapper>
  );
};

export default Editor;

const MainWrapper = styled.div`
  background-color: rgb(246, 246, 247);
  padding: 2rem 10vw;
`;

const Wrapper = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 1rem;
  min-height: calc(100vh - 4rem);
  box-shadow: 0px 0px 5px rgba(23, 24, 24, 0.05),
    0px 1px 2px rgba(0, 0, 0, 0.15);

  display: flex;
  flex-flow: row;
`;

const Items = styled.div`
  flex: 0 0 auto;
  width: 10rem;
  border-inline-end: 2px solid rgba(0, 0, 0, 0.1);
  padding-inline-end: 1rem;
`;

const ContentPanel = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-flow: column;
  padding-inline-start: 1rem;
`;

const Settings = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-flow: row;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
`;

const EditorContainer = styled.div`
  flex: 1 1 auto;
  padding-top: 1rem;
`;

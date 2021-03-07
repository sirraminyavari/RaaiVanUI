import useScript from 'hooks/useScript';

const GraphView = () => {
  useScript('pageLoadScripts/LoadGraph/LoadGraph.js', 'LoadGraph.js', () => {
    window.loadGraph();
  });
  return <div id="graphContainer"></div>;
};

export default GraphView;

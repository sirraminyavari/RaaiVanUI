import { useState, useEffect } from 'react';

const Block = ({ nodeId, lang }) => {
  const [blocks, setBlocks] = useState([]);
  useEffect(() => getBlocks(), [nodeId]);

  const getBlocks = () => {
    setBlocks([]);

    //call get blocks api
  };

  return <div>Block Editor</div>;
};

export default Block;

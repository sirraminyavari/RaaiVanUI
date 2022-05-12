import { useEffect, useRef, useState } from 'react';
import { EditorState, BlockMap } from 'draft-js';

export default function useAutoSave(editorState, onAutoSave, interval = 5000) {
  const [isHot, setIsHot] = useState(false);
  const lastEditorState = useRef(editorState);
  const timer = useRef(null);

  function setTimer() {
    clearInterval(timer.current);
    timer.current = setTimeout(() => {
      setIsHot(true);
    }, interval);
  }

  useEffect(() => {
    setTimer();
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    if (!isHot) return;
    const { hasChanged, changes, hasResorted, sort } = detectChanges(
      lastEditorState,
      editorState
    );
    if (!hasChanged) return;
    onAutoSave(toArr(changes), hasResorted ? sort : null);
    lastEditorState.current = editorState;
    setIsHot(false);
    setTimer();
  }, [editorState, isHot]);
}

function detectChanges(lastEditorState, editorState) {
  const lastBlockMap = lastEditorState.current
    .getCurrentContent()
    .getBlockMap();
  const newBlockMap = editorState.getCurrentContent().getBlockMap();

  const updatedBlocks = newBlockMap.filter((block, key) => {
    const oldBlock = lastBlockMap.get(key);
    if (!oldBlock) return false;
    return !block.equals(oldBlock);
  });
  const removedBlocks = lastBlockMap.filter((_, key) => !newBlockMap.get(key));
  const createdBlocks = newBlockMap.filter((_, key) => !lastBlockMap.get(key));

  const lastSort = lastBlockMap
    .map((b) => ({ key: b.getKey(), depth: b.getDepth() }))
    .toArray();
  const newSort = newBlockMap
    .map((b) => ({ key: b.getKey(), depth: b.getDepth() }))
    .toArray();
  const hasResorted = (() => {
    let i = 0,
      j = 0;
    while (i < newSort.length) {
      const item = newSort[i];
      const peer = lastSort[j];
      if (!peer) return true;
      if (item.key === peer.key) {
        if (item.depth === peer.depth) {
          i++;
          j++;
          continue;
        } else return true;
      } else {
        j++;
        continue;
      }
    }
    return false;
  })();

  return {
    hasChanged: updatedBlocks.size || removedBlocks.size || createdBlocks.size,
    changes: { updatedBlocks, removedBlocks, createdBlocks },
    hasResorted,
    sort: newSort,
  };
}

function toArr(obj) {
  const o = {};
  for (const key in obj) {
    o[key] = obj[key].toArray().map((b) => b.toObject());
  }
  return o;
}

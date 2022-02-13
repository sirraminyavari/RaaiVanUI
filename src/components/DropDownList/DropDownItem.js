/**
 * A component for rendering the drop-down item.
 */
import React from 'react';
import { Label, Maintainer } from './AnimatedDropDownList.style';

/**
 *
 * @param {object} item - Raw data is needed for rendering every single item.
 * {
 *  icon: Component,
 *  label: String,
 *  value: any,
 *  color: hex|rgb,
 * }
 * @param {CSSProperties} itemStyle - Styling the every item.
 * @callback onSelectItem - will fire by clicking on the item.
 * @returns - Renders item in the drop-down
 */
const DropDownItem = ({ item, onSelectItem, itemStyle, $dropedDown }) => {
  const { icon, label, colorClass, hidden } = item;

  return (
    <>
      {!hidden && (
        <Maintainer
          $dropedDown={$dropedDown}
          style={{ ...itemStyle }}
          onClick={onSelectItem}>
          {
            <div
              style={{
                alignContent: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {icon}
            </div>
          }
          <Label className={colorClass}>{label}</Label>
        </Maintainer>
      )}
    </>
  );
};

export default DropDownItem;

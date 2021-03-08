export const fontSizeOptions = [9, 11, 13, 'default', 17, 19, 21];
export const fontFamilyOptions = [
  'default',
  'Ubuntu, Arial, sans-serif',
  'Ubuntu Mono, Courier New, Courier, monospace',
  'Courier New, Courier, monospace',
  'Georgia, serif',
  'Lucida Sans Unicode, Lucida Grande, sans-serif',
  'Tahoma, Geneva, sans-serif',
  'Times New Roman, Times, serif',
  'Trebuchet MS, Helvetica, sans-serif',
  'Verdana, Geneva, sans-serif',
];

const colorOptions = () => {
  const column = 9;
  const row = 13;
  let colorsArray = [];
  let hue = 0;
  let saturation = 0;
  let light = 0;

  for (let i = 0; i < column * row; i++) {
    colorsArray.push({
      color: `hsl(${hue}, ${saturation}%, ${light}%)`,
      label: `hsl(${hue}, ${saturation}%, ${light}%)`,
      hasBorder: true,
    });

    if ((i + 1) % column === 0) {
      saturation = 100;
      light = 10;
      if (i > column) {
        hue = hue + 30;
      }
    } else {
      if (i < column) {
        light = light + 12.5;
      } else {
        light = light + 10;
      }
    }
  }
  return colorsArray;
};

export const fontBgColors = colorOptions();

import EditableCell from 'components/CustomTable/EditableCell';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import AcceptIcon from 'components/Icons/CheckIcons/Check';
import RejectIcon from 'components/Icons/CloseIcon/CloseIcon';
import Input from 'components/Inputs/Input';

const getCell = (type) => {
  switch (type) {
    case 'string':
      return { Cell: EditableCell };

    case 'date':
      return {
        Cell: (row) => (
          <CustomDatePicker
            label="انتخاب تاریخ"
            mode="input"
            type="jalali"
            range={false}
            size="small"
            value={row.value}
            style={{ color: 'white' }}
            inputStyle={{ color: 'inherit' }}
          />
        ),
      };

    default:
      return;
  }
};

const getFooter = (type) => {
  switch (type) {
    case 'string':
      return {
        Footer: (
          <Input style={{ width: '100%', borderColor: '#333' }} type="text" />
        ),
      };
    case 'integer':
      return {
        Footer: (
          <Input style={{ width: '100%', borderColor: '#333' }} type="number" />
        ),
      };

    case 'date':
      return {
        Footer: () => (
          <CustomDatePicker
            label="انتخاب تاریخ"
            mode="input"
            type="jalali"
            range={false}
            size="small"
            value={null}
            style={{ color: 'white' }}
            inputStyle={{ color: 'inherit' }}
          />
        ),
      };

    default:
      return {
        Footer: type,
      };
  }
};

const footer = [
  {
    icon: <AcceptIcon size={25} color="green" style={{ cursor: 'pointer' }} />,
  },
  {
    icon: <RejectIcon size={20} color="red" style={{ cursor: 'pointer' }} />,
  },
];

const makeColumns = (headers, actions) => {
  let actionColumns = [];
  if (actions && Object.keys(actions).length !== 0) {
    Object.keys(actions).forEach((action, index) => {
      const customColumn = {
        id: `${action}-row`,
        index,
        dataType: 'actions',
        Footer: (row) => {
          return footer[index].icon;
        },
        Cell: () => actions[action](),
        width: 40,
        maxWidth: 40,
      };
      actionColumns.push(customColumn);
    });
  }
  // console.log(headers, 'make columns');
  const dataCulomns = headers.map((header) => {
    return {
      Header: Object.values(header)[0],
      accessor: Object.keys(header)[0],
      ...getFooter(header.dataType),
      ...getCell(header.dataType),
    };
  });

  return actionColumns.concat(dataCulomns);
};

export default makeColumns;

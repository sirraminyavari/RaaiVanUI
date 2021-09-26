import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';

const securityOptions = [
  { label: 'غیرمحرمانه', value: 'غیرمحرمانه' },
  { label: 'محرمانه', value: 'محرمانه' },
  { label: 'محرمانه پیشرفته', value: 'محرمانه پیشرفته' },
];

const showItemOptions = [
  { label: 'برای همه اعضای تیم', value: 'برای همه اعضای تیم' },
  { label: 'برای مدیران و اعضای معتمد', value: 'برای مدیران و اعضای معتمد' },
  { label: 'انتخاب از لیست اعضای تیم', value: 'انتخاب از لیست اعضای تیم' },
  { label: 'فقط مدیران تیم', value: 'فقط مدیران تیم' },
];

const Security = () => {
  const handleSecurityChange = () => {};
  const handleShowItemChange = () => {};
  const handleEditItemChange = () => {};

  return (
    <div>
      <Styled.SecuritySelectWrapper>
        <div style={{ width: '10rem' }}>تنظیمات محرمانگی</div>
        <CustomSelect
          defaultValue={{ label: 'محرمانه', value: 'محرمانه' }}
          isMulti={false}
          closeMenuOnSelect={true}
          isClearable={false}
          isSearchable={false}
          placeholder="انتخاب کنید"
          selectName="security"
          selectOptions={securityOptions}
          onChange={handleSecurityChange}
        />
      </Styled.SecuritySelectWrapper>
      <Styled.SecuritySelectWrapper>
        <div style={{ width: '10rem' }}>نمایش آیتم</div>
        <CustomSelect
          defaultValue={{ label: 'فقط مدیران تیم', value: 'فقط مدیران تیم' }}
          isMulti={false}
          closeMenuOnSelect={true}
          isClearable={false}
          isSearchable={false}
          selectName="show-item"
          selectOptions={showItemOptions}
          onChange={handleShowItemChange}
        />
      </Styled.SecuritySelectWrapper>
      <Styled.SecuritySelectWrapper>
        <div style={{ width: '10rem' }}>ویرایش آیتم</div>
        <CustomSelect
          defaultValue={{
            label: 'انتخاب از لیست اعضای تیم',
            value: 'انتخاب از لیست اعضای تیم',
          }}
          isMulti={false}
          closeMenuOnSelect={true}
          isClearable={false}
          isSearchable={false}
          selectName="security"
          selectOptions={showItemOptions}
          onChange={handleEditItemChange}
        />
      </Styled.SecuritySelectWrapper>
    </div>
  );
};

export default Security;

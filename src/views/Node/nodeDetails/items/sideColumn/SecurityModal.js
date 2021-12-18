/**
 * Renders security modal content for node page side.
 */
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';

const { RVDic, RVGlobal } = window;
const securityOptions = [
  { label: '*#*غیرمحرمانه', value: 'غیرمحرمانه' },
  { label: '*#*محرمانه', value: 'محرمانه' },
  { label: '*#*محرمانه پیشرفته', value: 'محرمانه پیشرفته' },
];

const showItemOptions = [
  { label: '*#*برای همه اعضای تیم', value: 'برای همه اعضای تیم' },
  { label: '*#*برای مدیران و اعضای معتمد', value: 'برای مدیران و اعضای معتمد' },
  { label: '*#*انتخاب از لیست اعضای تیم', value: 'انتخاب از لیست اعضای تیم' },
  { label: '*#*فقط مدیران تیم', value: 'فقط مدیران تیم' },
];

const Security = () => {
  //! Keep track of security select.
  const handleSecurityChange = () => {};
  //! Keep track of show item show select.
  const handleShowItemChange = () => {};
  //! Keep track of item edition select.
  const handleEditItemChange = () => {};

  return (
    <div>
      <Styled.SecuritySelectWrapper>
        <div style={{ width: '10rem' }}>تنظیمات محرمانگی</div>
        <CustomSelect
          defaultValue={securityOptions[0]}
          isMulti={false}
          closeMenuOnSelect={true}
          isClearable={false}
          isSearchable={false}
          placeholder={RVDic.Select}
          selectName="security"
          options={securityOptions}
          onChange={handleSecurityChange}
        />
      </Styled.SecuritySelectWrapper>
      <Styled.SecuritySelectWrapper>
        <div style={{ width: '10rem' }}>نمایش آیتم</div>
        <CustomSelect
          defaultValue={showItemOptions[0]}
          isMulti={false}
          closeMenuOnSelect={true}
          isClearable={false}
          isSearchable={false}
          selectName="show-item"
          options={showItemOptions}
          onChange={handleShowItemChange}
        />
      </Styled.SecuritySelectWrapper>
      <Styled.SecuritySelectWrapper>
        <div style={{ width: '10rem' }}>ویرایش آیتم</div>
        <CustomSelect
          defaultValue={showItemOptions[0]}
          isMulti={false}
          closeMenuOnSelect={true}
          isClearable={false}
          isSearchable={false}
          selectName="security"
          options={showItemOptions}
          onChange={handleEditItemChange}
        />
      </Styled.SecuritySelectWrapper>
    </div>
  );
};

export default Security;

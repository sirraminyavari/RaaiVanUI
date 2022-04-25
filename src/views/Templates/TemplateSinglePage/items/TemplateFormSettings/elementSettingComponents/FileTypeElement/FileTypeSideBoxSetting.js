import * as Styles from '../sharedItems/SharedStyles';
import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import produce from 'immer';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import ExtensionSelectInput from '../sharedItems/ExtensionSelectInput';

const FileTypeSideBoxSetting = ({ current, setFormObjects }) => {
  const { MaxCount, MaxSize, TotalSize, ImageOnly, AllowedExtensions } =
    current?.data?.Info || {};

  const handleMaxCountStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.MaxCount = e?.target?.value;
      })
    );
  };

  const handleMaxSizeStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.MaxSize = e?.target?.value;
      })
    );
  };

  const handleTotalSizeStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.TotalSize = e?.target?.value;
      })
    );
  };

  const handleImageOnlyStateChange = (state) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.ImageOnly = state;
      })
    );
  };

  const handleAddAllowedExtensionsStateChange = (ext) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.AllowedExtensions.push(ext);
      })
    );
  };

  const handleRemoveAllowedExtensionsStateChange = (ext) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.AllowedExtensions =
          _current.data.Info.AllowedExtensions.filter((x) => x !== ext);
      })
    );
  };

  const handleRemoveLastAllowedExtension = () => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.AllowedExtensions.pop();
      })
    );
  };

  return (
    <>
      <Styles.Row>
        <ToggleNecessaryState {...{ current, setFormObjects }} />
      </Styles.Row>

      <Styles.Row>
        <Styles.InputRowContainer>
          <Styles.ToggleRowTitle>{'حداکثر تعداد'}</Styles.ToggleRowTitle>
          <Styles.Input value={MaxCount} onChange={handleMaxCountStateChange} />
        </Styles.InputRowContainer>
      </Styles.Row>

      <Styles.Row>
        <Styles.InputRowContainer>
          <Styles.ToggleRowTitle>
            {'(MB) حداکثر حجم فایل'}
          </Styles.ToggleRowTitle>
          <Styles.Input value={MaxSize} onChange={handleMaxSizeStateChange} />
        </Styles.InputRowContainer>
      </Styles.Row>

      <Styles.Row>
        <Styles.InputRowContainer>
          <Styles.ToggleRowTitle>
            {'(MB) حداکثر حجم آپلود'}
          </Styles.ToggleRowTitle>
          <Styles.Input
            value={TotalSize}
            onChange={handleTotalSizeStateChange}
          />
        </Styles.InputRowContainer>
      </Styles.Row>

      <Styles.ToggleRow>
        <Styles.ToggleRowTitle>{'فقط تصویر'}</Styles.ToggleRowTitle>
        <ToggleButton value={ImageOnly} onToggle={handleImageOnlyStateChange} />
      </Styles.ToggleRow>

      <ExtensionSelectInput
        {...{
          AllowedExtensions,
          ImageOnly,
          handleAddAllowedExtensionsStateChange,
          handleRemoveAllowedExtensionsStateChange,
          handleRemoveLastAllowedExtension,
        }}
      />
    </>
  );
};
export default FileTypeSideBoxSetting;

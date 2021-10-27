import TextArea from 'components/Inputs/TextArea/TextArea';
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';

const RaminView = () => {
  return (
    <>
      <div style={{ textAlign: 'center', fontSize: '2rem' }}>
        Ramin's window
      </div>
      <div style={{ padding: '2rem', direction: 'ltr', textAlign: 'left' }}>
        {[
          'primary',
          'primary-o',
          'secondary-o',
          'negative',
          'negative-o',
          'negative-secondary-o',
        ].map((name) => (
          <>
            <div
              style={{
                display: 'flex',
                flexFlow: 'row',
                alignItems: 'center',
                padding: '1rem 0',
              }}>
              <div style={{ flex: '0 0 auto', width: '10rem' }}>{name}</div>
              {[
                {},
                { $circleEdges: true },
                { disable: true },
                { loading: true },
              ].map((options) => (
                <div
                  style={{
                    flex: '0 0 auto',
                    width: '10rem',
                    padding: '0 1rem',
                  }}>
                  <Button
                    type={name}
                    disable={options.disable}
                    loading={options.loading}
                    $circleEdges={options.$circleEdges}>
                    button
                  </Button>
                </div>
              ))}
            </div>
          </>
        ))}
      </div>
      <div style={{ padding: '2rem', direction: 'ltr', textAlign: 'left' }}>
        {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((name) => (
          <>
            <div
              style={{
                display: 'flex',
                flexFlow: 'row',
                alignItems: 'center',
                padding: '1rem 0',
              }}>
              <div style={{ flex: '0 0 auto', width: '4rem' }}>{name}</div>
              <Heading type={name}>این یک هدینگ است</Heading>
            </div>
          </>
        ))}
      </div>
      <div
        class={'small-12 medium-12 large-12 row'}
        style={{ padding: '2rem', direction: 'ltr', textAlign: 'left' }}>
        {[
          ['rv-border-radius-1'],
          ['rv-border-radius-half'],
          ['rv-border-radius-quarter'],
          ['rv-circle'],
          ['rv-border-radius-1', 'rv-ignore-top-radius'],
          ['rv-border-radius-1', 'rv-ignore-left-radius'],
          ['rv-border-radius-1', 'rv-ignore-bottom-radius'],
          ['rv-border-radius-1', 'rv-ignore-right-radius'],
          ['rv-border-radius-1', 'rv-ignore-top-right-radius'],
          ['rv-border-radius-1', 'rv-ignore-bottom-right-radius'],
          ['rv-border-radius-1', 'rv-ignore-top-left-radius'],
          ['rv-border-radius-1', 'rv-ignore-bottom-left-radius'],
        ].map((name) => (
          <>
            <div
              class={'small-12 medium-6 large-4'}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0',
              }}>
              <div
                class={name.join(' ')}
                style={{
                  flex: '0 0 auto',
                  width: '25rem',
                  height: '2rem',
                  backgroundColor: 'var(--rv-color)',
                  display: 'flex',
                  color: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {name.map((nm) => (
                  <span style={{ margin: '0 1rem' }}>{nm}</span>
                ))}
              </div>
            </div>
          </>
        ))}
      </div>
      <div style={{ padding: '5rem 0' }}></div>
      <TextArea></TextArea>
    </>
  );
};

export default RaminView;

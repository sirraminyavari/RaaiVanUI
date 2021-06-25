import { useEffect } from 'react';
import './TourBox.css';

const TourBox = ({ goTo, current, total, guidance }) => {
  useEffect(() => {
    console.log(current);
    console.log(total);
    console.log(guidance);
  }, []);
  return (
    <div>
      {current === 0 && (
        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
            به کلیک مایند خوش اومدی
          </div>
          <p style={{ fontSize: '12px' }}>
            اینجا فضای اختصاصی تیمته که با کمک اون قراره حسابی به تیمت کمک کنیم
            حافظه قوی‌تری داشته‌باشه
          </p>
          <p style={{ fontSize: '12px' }}>
            آماده‌ای یه گشت‌و‌گذار کوچولو توی کلیک‌مایندِ خودت بزنی؟
          </p>
        </div>
      )}
      {current !== 0 && (
        <p
          style={{ fontSize: '12px', textAlign: 'justify', padding: '15px 0' }}>
          {guidance}
        </p>
      )}

      {current === 0 && (
        <div style={{ textAlign: 'center', marginTop: '45px' }}>
          <button
            style={{
              outline: 'none',
              border: 'none',
              backgroundColor: '#1565c0',
              color: 'white',
              borderRadius: '8px',
              height: '32px',
              fontSize: '15px',
              fontWeight: 'bold',
              padding: '0 20px',
              cursor: 'pointer',
            }}
            onClick={() => goTo(current + 1)}>
            آره! با کمال میل!
          </button>
        </div>
      )}

      {current !== 0 && (
        <div className="action-nav">
          <div>
            {current !== 1 && (
              <button
                style={{
                  outline: 'none',
                  border: 'none',
                  backgroundColor: '#ef6c00',
                  color: 'white',
                  borderRadius: '8px',
                  height: '32px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  padding: '0 20px',
                  cursor: 'pointer',
                }}
                onClick={() => goTo(current - 1)}>
                قبلی
              </button>
            )}
          </div>

          <div className="step-counter">
            <span>{current}</span>

            <span>از</span>

            <span>{total}</span>
          </div>

          <div>
            {current !== total && (
              <button
                style={{
                  outline: 'none',
                  border: 'none',
                  backgroundColor: '#1565c0',
                  color: 'white',
                  borderRadius: '8px',
                  height: '32px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  padding: '0 20px',
                  cursor: 'pointer',
                }}
                onClick={() => goTo(current + 1)}>
                بعدی
              </button>
            )}

            {current === total && (
              <button
                style={{
                  outline: 'none',
                  border: 'none',
                  backgroundColor: '#1565c0',
                  color: 'white',
                  borderRadius: '8px',
                  height: '32px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  padding: '0 20px',
                  cursor: 'pointer',
                }}
                onClick={() => goTo(current)}>
                عالیه! بزن بریم
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default TourBox;

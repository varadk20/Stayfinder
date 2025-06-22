import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Status() {
  const [paymentStatus, setPaymentStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('payment');

    if (status === 'success') {
      setPaymentStatus('successful');
    } else if (status === 'cancel') {
      setPaymentStatus('cancelled');
    } else {
      setPaymentStatus('unknown');
    }
  }, []);

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
      <h2>
        Payment was{' '}
        <span style={{ color: paymentStatus === 'successful' ? 'green' : 'red' }}>
          {paymentStatus}
        </span>
      </h2>
      <button
        onClick={handleGoHome}
        className="btn mt-3"
        style={{ backgroundColor: '#E30B5C', color: 'white' }}
      >
        Go to Home
      </button>
    </div>
  );
}

export default Status;

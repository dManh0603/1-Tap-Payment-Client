import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const _404 = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      navigate('/');
    }
  }, [countdown, navigate]);

  return (
    <Box>
      <div>404 Not found</div>
      <div>Return to "Dashboard" in {countdown} seconds</div>
    </Box>
  );
};

export default _404;

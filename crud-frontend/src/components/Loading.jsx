import React, { useEffect, useState } from 'react';

const Loading = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev >= 3 ? 0 : prev + 1));
    }, 300);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return <div>Loading{".".repeat(dots)}</div>;
};

export default Loading;

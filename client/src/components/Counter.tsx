// a counter componetn that just show number, every 1 sec

import { useEffect, useState } from "react";

const Counter = () => {
  const [number, setNumber] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setNumber((n) => n + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>{number}</div>;
};

export default Counter;

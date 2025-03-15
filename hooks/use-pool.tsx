import { useState } from "react";


export default function usePool() {
  const [poolAmount, setPoolAmount] = useState<number>(0);
  const [isFetching, setIsFetching] = useState(false);

  const fetchPoolAmount = async () => {
    setIsFetching(true);
    const response = await fetch("/api/pool");
    const data = await response.json();
    setPoolAmount(data.funds);
    setIsFetching(false);
    return data.funds;
  };

  return {
    poolAmount,
    fetchPoolAmount,
    isFetching,
  };
}

import { useState } from "react";

const useMultiData = () => {
  const [dataOne, setDataOne] = useState(null);
  const [dataTwo, setDataTwo] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const getMultiData = async (urls) => {
    try {
      const [result1, result2] = await Promise.all(
        urls.map((url) => fetch(url).then((res) => res.json()))
      );

      setIsPending(false);
      setDataOne(result1);
      setDataTwo(result2);
    } catch {
      setIsPending(false);
      setError("Error : Sorry! Try to refresh or come back later");
    }
  };

  return { dataOne, dataTwo, getMultiData, isPending, error };
};

export default useMultiData;

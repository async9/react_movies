import { useState } from "react";

const useData = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);

  const getData = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw Error(error);
      }

      const data = await response.json();
      setData(data);
      setIsPending(false);
      setError(null);
    } catch (err) {
      setIsPending(false);
      setError("Error : Sorry! Try to refresh or come back later");
    }
  };

  return { data, getData, isPending, error };
};

export default useData;

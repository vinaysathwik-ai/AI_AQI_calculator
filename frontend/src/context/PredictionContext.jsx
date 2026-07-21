import { createContext, useContext, useState } from "react";

const PredictionContext = createContext();

export function PredictionProvider({ children }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <PredictionContext.Provider
      value={{
        prediction,
        setPrediction,
        loading,
        setLoading,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  return useContext(PredictionContext);
}
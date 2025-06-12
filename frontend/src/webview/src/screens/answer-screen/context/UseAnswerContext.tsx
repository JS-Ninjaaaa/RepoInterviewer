import { useContext } from "react";
import { createContext } from "react";
import type { AnswerContextType } from "@/types/create-context";

export const AnswerContext = createContext<AnswerContextType | null>(null);

export const useAnswerContext = () => {
  const context = useContext(AnswerContext);
  if (!context)
    throw new Error(
      "useAnswerContext must be used within AnswerContextProvider"
    );
  return context;
};

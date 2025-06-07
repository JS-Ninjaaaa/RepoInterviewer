import { createContext } from "react";
import type { AnswerContextType } from "@/types/create-context";

export const AnswerContext = createContext<AnswerContextType | null>(null);

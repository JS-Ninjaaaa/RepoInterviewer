import { Character } from "@/types/character";
import { ChatMessage } from "@/types/chat-message";

export interface AnswerContextType {
  currentCharacter: Character;
  interviewId: string;
  chatHistory: ChatMessage[];
  chatInput: string;
  questionId: number;
  buttonDisplay: string;
  displayEnterBox: boolean;
  interruptModalOpen: boolean;
  skipModalOpen: boolean;
  scrollTop: boolean;
  fetchFeedback: () => void;
  fetchNextQuestion: () => void;
  fetchGeneralFeedback: () => void;
  handleSkipModalClose: () => void;
  handleInterruptModalClose: () => void;
  handleSkipConfirm: () => void;
  handleInterruptConfirm: () => void;
  handleNextClick: () => void;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  setInterruptModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSkipModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setScrollTop: React.Dispatch<React.SetStateAction<boolean>>;
}

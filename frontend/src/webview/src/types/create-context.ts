import type { Character } from "@/types/character";
import type{ ChatMessage } from "@/types/chat-message";
import type { TopButtonState, BottomButtonState } from "@/types/action-button";

export interface AnswerContextType {
  currentCharacter: Character;
  interviewId: string;
  chatHistory: ChatMessage[];
  chatInput: string;
  questionId: number;
  topButtonState: TopButtonState;
  bottomButtonState: BottomButtonState;
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

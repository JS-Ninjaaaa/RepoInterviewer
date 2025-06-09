import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ChatMessage } from "@/types/chat-message";
import type { Character } from "@/types/character";
import {
  FeedBackResponse,
  GeneralFeedbackResponse,
} from "@shared/backend-api-response-value";
import type { VscodeApiRequestValue } from "@shared/vscode-api-request-value";
import type { VscodeApiResponseValue } from "@shared/vscode-api-response-value";
import { useLoading } from "@/screens/context/LoadingContext";
import { useThinkingAnimation } from "@/screens/components/hooks/use-thinking-animation";
import { AnswerContext } from "@/screens/answer-screen/context/UseAnswerContext";

interface AnswerContextProviderProps {
  children: React.ReactNode;
  vscode: VSCodeAPI;
  interviewId: string;
  currentCharacter: Character;
  firstlQuestion: string;
}

export const AnswerContextProvider: React.FC<AnswerContextProviderProps> = ({
  children,
  vscode,
  interviewId,
  currentCharacter,
  firstlQuestion,
}) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { type: "question", text: firstlQuestion },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [questionId, setQuestionId] = useState<number>(1);
  const [buttonDisplay, setButtonDisplay] = useState<string>("スキップ");
  const [displayEnterBox, setDisplayEnterBox] = useState<boolean>(true);
  const [interruptModalOpen, setInterruptModalOpen] = useState<boolean>(false);
  const [skipModalOpen, setSkipModalOpen] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState<boolean>(true);

  const { showLoading, hideLoading } = useLoading();
  const { startThinking, stopThinking } = useThinkingAnimation(setChatHistory);
  const navigate = useNavigate();

  const judgeContinueSameQuestion = useCallback(
    (payload: FeedBackResponse) => {
      stopThinking();
      const lastScore = payload.score;
      if (payload.continue_question) {
        setChatHistory((prev) => [
          ...prev,
          { type: "question", text: payload.response },
        ]);
        setDisplayEnterBox(true);
      } else {
        const total = currentCharacter.totalQuestion;
        const lastId = payload.question_id;
        setButtonDisplay(lastId >= total ? "最終結果へ" : "次へ");
        setChatHistory((prev) => [
          ...prev,
          { type: "feedback", text: payload.response, score: lastScore },
        ]);
      }
    },
    [currentCharacter.totalQuestion, stopThinking],
  );

  const fetchFeedback = useCallback(() => {
    setScrollTop(false);
    setChatHistory((prev) => [...prev, { type: "answer", text: chatInput }]);
    startThinking();
    setDisplayEnterBox(false);
    const msg: VscodeApiRequestValue = {
      type: "fetchFeedback",
      payload: {
        interview_id: interviewId,
        question_id: questionId,
        answer: chatInput,
      },
    };
    vscode.postMessage(msg);
    setChatInput("");
  }, [chatInput, interviewId, questionId, startThinking, vscode]);

  const fetchNextQuestion = useCallback(() => {
    startThinking();
    const nextId = questionId + 1;
    const msg: VscodeApiRequestValue = {
      type: "fetchNextQuestion",
      payload: { interview_id: interviewId, question_id: nextId },
    };
    vscode.postMessage(msg);
    setQuestionId(nextId);
    setButtonDisplay("スキップ");
    setDisplayEnterBox(true);
  }, [questionId, startThinking, vscode, interviewId]);

  const fetchGeneralFeedback = useCallback(() => {
    showLoading("全部の回答をチェック中・・・");
    const msg: VscodeApiRequestValue = {
      type: "fetchGeneralFeedback",
      payload: { interview_id: interviewId },
    };
    vscode.postMessage(msg);
  }, [showLoading, vscode, interviewId]);

  const moveGeneralFeedbackScreen = useCallback(
    (payload: GeneralFeedbackResponse) => {
      navigate("/feedback", {
        state: {
          payload,
          currentCharacter,
        },
      });
    },
    [navigate, currentCharacter],
  );

  const handleExtensionMessage = useCallback(
    (event: MessageEvent) => {
      const msg = event.data as VscodeApiResponseValue;
      switch (msg.type) {
        case "feedback":
          judgeContinueSameQuestion(msg.payload);
          break;
        case "nextQuestion":
          stopThinking();
          setChatHistory((prev) => [
            ...prev,
            { type: "question", text: msg.payload.question },
          ]);
          setQuestionId(msg.payload.question_id);
          setButtonDisplay("スキップ");
          setDisplayEnterBox(true);
          break;
        case "generalFeedback":
          hideLoading();
          moveGeneralFeedbackScreen(msg.payload);
          break;
      }
    },
    [
      judgeContinueSameQuestion,
      stopThinking,
      hideLoading,
      moveGeneralFeedbackScreen,
    ],
  );

  useEffect(() => {
    window.addEventListener("message", handleExtensionMessage);
    return () => window.removeEventListener("message", handleExtensionMessage);
  }, [handleExtensionMessage]);

  return (
    <AnswerContext.Provider
      value={{
        currentCharacter,
        interviewId,
        chatHistory,
        chatInput,
        questionId,
        buttonDisplay,
        displayEnterBox,
        interruptModalOpen,
        skipModalOpen,
        scrollTop,
        navigate,
        fetchFeedback,
        fetchNextQuestion,
        fetchGeneralFeedback,
        setChatInput,
        setInterruptModalOpen,
        setSkipModalOpen,
        setScrollTop,
      }}
    >
      {children}
    </AnswerContext.Provider>
  );
};

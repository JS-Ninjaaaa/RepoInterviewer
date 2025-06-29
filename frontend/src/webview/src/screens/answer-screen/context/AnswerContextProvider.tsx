import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ChatMessage } from "@/types/chat-message";
import type { Character } from "@/types/character";
import type { VscodeApiRequestValue } from "@shared/vscode-api-request-value";
import type { VscodeApiResponseValue } from "@shared/vscode-api-response-value";
import type { TopButtonState, BottomButtonState } from "@/types/action-button";
import { Feedback, GeneralFeedback } from "@shared/webview-api-response-type";
import { useLoading } from "@/screens/context/LoadingContext";
import { useThinkingAnimation } from "@/screens/answer-screen/components/chat-panel/chats/hooks/use-thinking-animation";
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
    { type: "question", text: firstlQuestion, questionId: 1 },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [questionId, setQuestionId] = useState<number>(1);
  const [topButtonState, setTopButtonState] = useState<TopButtonState>("skip");
  const [bottomButtonState, setBottomButtonState] =
    useState<BottomButtonState>("send");
  const [displayEnterBox, setDisplayEnterBox] = useState<boolean>(true);
  const [interruptModalOpen, setInterruptModalOpen] = useState<boolean>(false);
  const [skipModalOpen, setSkipModalOpen] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState<boolean>(true);

  const { showLoading, hideLoading } = useLoading();
  const { startThinking, stopThinking } = useThinkingAnimation(setChatHistory);
  const navigate = useNavigate();

  const judgeContinueSameQuestion = useCallback(
    (payload: Feedback) => {
      stopThinking();
      const lastScore = payload.score;
      if (payload.continueQuestion) {
        setChatHistory((prev) => [
          ...prev,
          {
            type: "question",
            text: payload.response,
            questionId: payload.questionId,
          },
        ]);
        setDisplayEnterBox(true);
      } else {
        const total = currentCharacter.totalQuestion;
        const lastId = payload.questionId;
        setBottomButtonState(lastId >= total ? "result" : "next");
        setChatHistory((prev) => [
          ...prev,
          { type: "feedback", text: payload.response, score: lastScore },
        ]);
      }
    },
    [currentCharacter.totalQuestion, stopThinking]
  );

  const fetchFeedback = useCallback(() => {
    setScrollTop(false);
    setChatHistory((prev) => [...prev, { type: "answer", text: chatInput }]);
    startThinking();
    setDisplayEnterBox(false);
    setTopButtonState("none");
    const msg: VscodeApiRequestValue = {
      type: "fetchFeedback",
      payload: {
        interviewId: interviewId,
        questionId: questionId,
        answer: chatInput,
      },
    };
    vscode.postMessage(msg);
    setChatInput("");
  }, [chatInput, interviewId, questionId, startThinking, vscode]);

  const fetchNextQuestion = useCallback(() => {
    startThinking();
    const nextQuestionId = questionId + 1;
    const msg: VscodeApiRequestValue = {
      type: "fetchNextQuestion",
      payload: { interviewId: interviewId, questionId: nextQuestionId },
    };
    vscode.postMessage(msg);
    setQuestionId(nextQuestionId);
    setTopButtonState("none");
    setBottomButtonState("send");
    setDisplayEnterBox(true);
  }, [questionId, startThinking, vscode, interviewId]);

  const fetchGeneralFeedback = useCallback(() => {
    showLoading("全ての回答をチェック中・・・");
    const msg: VscodeApiRequestValue = {
      type: "fetchGeneralFeedback",
      payload: { interviewId: interviewId },
    };
    vscode.postMessage(msg);
  }, [showLoading, vscode, interviewId]);

  const handleNextClick = () => {
    if (bottomButtonState === "next") {
      fetchNextQuestion();
    } else if (bottomButtonState === "result") {
      fetchGeneralFeedback();
    } else {
      setSkipModalOpen(true);
    }
  };

  const handleSkipModalClose = () => setSkipModalOpen(false);
  const handleInterruptModalClose = () => setInterruptModalOpen(false);
  const handleSkipConfirm = () => {
    setSkipModalOpen(false);
    fetchFeedback();
  };

  const handleInterruptConfirm = () => {
    setInterruptModalOpen(false);
    navigate("/title");
  };

  const moveGeneralFeedbackScreen = useCallback(
    (payload: GeneralFeedback) => {
      navigate("/feedback", {
        state: {
          payload,
          currentCharacter,
        },
      });
    },
    [navigate, currentCharacter]
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
            {
              type: "question",
              text: msg.payload.question,
              questionId: msg.payload.questionId,
            },
          ]);
          setQuestionId(msg.payload.questionId);
          setTopButtonState("skip");
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
    ]
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
        topButtonState,
        bottomButtonState,
        displayEnterBox,
        interruptModalOpen,
        skipModalOpen,
        scrollTop,
        fetchFeedback,
        fetchNextQuestion,
        fetchGeneralFeedback,
        handleSkipModalClose,
        handleInterruptModalClose,
        handleNextClick,
        handleInterruptConfirm,
        handleSkipConfirm,
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

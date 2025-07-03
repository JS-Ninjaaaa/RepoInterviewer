export type VscodeApiRequestValue =
  | { type: "fetchFileList" }
  | {
      type: "fetchFirstQuestion";
      payload: {
        difficulty: string;
        totalQuestion: number;
        selectedFiles: string[];
      };
    }
  | {
      type: "fetchNextQuestion";
      payload: {
        interviewId: string;
        questionId: number;
      };
    }
  | {
      type: "fetchFeedback";
      payload: {
        interviewId: string;
        questionId: number;
        answer: string;
      };
    }
  | {
      type: "fetchGeneralFeedback";
      payload: { interviewId: string };
    }
  | { type: "closeWebview" };

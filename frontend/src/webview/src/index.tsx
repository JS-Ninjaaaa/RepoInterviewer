// index.tsx (エントリーポイント)
import { createRoot } from "react-dom/client";
import StartScreen from "./screens/StartScreen";

// ✨ここでグローバルから取得✨
const vscode = typeof acquireVsCodeApi === "function"
  ? acquireVsCodeApi()
  : {
      postMessage: () => {},
      getState: () => undefined,
      setState: () => {},
    };


const root = createRoot(document.getElementById("app")!);
root.render(<StartScreen vscode={vscode} />);

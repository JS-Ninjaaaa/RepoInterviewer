export {}

declare global {
  interface VSCodeAPI {
    postMessage: (msg: { type: string; payload?: unknown }) => void;
    getState: () => unknown;
    setState: (data: unknown) => void;
  }

  function acquireVsCodeApi(): VSCodeAPI;
}

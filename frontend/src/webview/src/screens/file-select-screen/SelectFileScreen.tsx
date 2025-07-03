import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useLoading } from "@/screens/context/LoadingContext";
import CommonThemeButton from "../components/CommonThemeButton";
import FileList from "@/screens/file-select-screen/components/FileList";
import { GradientText } from "../title-screen/components/TitleHeader";

interface VSCodeAPI {
  postMessage(message: { type: string; payload?: unknown }): void;
  getState(): unknown;
  setState(state: unknown): void;
}

interface Props {
  vscode: VSCodeAPI;
}

export const SelectFilesScreen: React.FC<Props> = ({ vscode }) => {
  const [filePaths, setFileList] = useState<string[]>([]);
  const [ignoreFiles, setIgnoreFiles] = useState<string[]>([]);
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    showLoading("ファイル取得中…");
    vscode.postMessage({ type: "fetchFileList" });
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data.type === "fileList") {
        hideLoading();
        const pastFileList = e.data.payload as string[];
        setFileList(pastFileList);
        // 前回の選択状況を再現する
        const state = vscode.getState() as { ignoreFiles?: string[] };
        const init = state?.ignoreFiles ?? [];
        setIgnoreFiles(init.filter((f) => pastFileList.includes(f)));
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const onFileToggle = (file: string) => {
    setIgnoreFiles((prev) => {
      const updated = prev.includes(file)
        ? prev.filter((f) => f !== file)
        : [...prev, file];

      vscode.setState({ ignoreFiles: updated });
      localStorage.setItem("ignoreFiles", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSave = () => {
    // ignoreFiles に含まれないファイル一覧を作る
    const selectedFiles = filePaths.filter((f) => !ignoreFiles.includes(f));
    navigate("/start", { state: { selectedFiles } });
  };

  return (
    <>
      <Box
        component="div"
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: (theme) => theme.palette.background.default,
          zIndex: -1,
        }}
      />

      <Box
        component="main"
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          pt: 14,
          pb: 8,
          px: 4,
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "36px" }}>
          <GradientText>面接除外ファイル選択</GradientText>
        </Typography>
        <FileList
          filePaths={filePaths}
          ignoreFiles={ignoreFiles}
          onFileToggle={onFileToggle}
        />
        <CommonThemeButton
          onClick={handleSave}
          sx={{
            padding: "12px 48px",
            fontWeight: "bold",
            mb: 4,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0px 6px 16px rgba(255, 255, 255, 0.24)"
                : "0px 6px 16px rgba(0, 0, 0, 0.15)",
          }}
        >
          次へ
        </CommonThemeButton>
      </Box>
    </>
  );
};

export default SelectFilesScreen;

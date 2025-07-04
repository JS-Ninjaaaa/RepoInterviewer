import CommonThemeBox from "@/screens/components/CommonThemeBox";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import {
  Box,
  Checkbox,
  Collapse,
  List,
  ListItemButton,
  ListSubheader,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

type FileListProps = {
  filePaths: string[];
  ignoreFiles: string[];
  onFileToggle: (filePaths: string) => void;
};

type FileGroup = { directory: string; fileNames: string[] };

function groupByDirectory(filePaths: string[]): FileGroup[] {
  const directoryToFilesMap = new Map<string, string[]>();
  filePaths.forEach((p) => {
    const idx = p.lastIndexOf("/");
    const dir = idx === -1 ? "" : p.slice(0, idx);
    const file = p.slice(idx + 1);
    const filesInDirectory = directoryToFilesMap.get(dir) ?? [];
    filesInDirectory.push(file);
    directoryToFilesMap.set(dir, filesInDirectory);
  });
  return Array.from(directoryToFilesMap, ([directory, fileNames]) => ({
    directory,
    fileNames,
  }));
}

const FileList: React.FC<FileListProps> = ({
  filePaths,
  ignoreFiles,
  onFileToggle,
}) => {
  const theme = useTheme();
  const groups = useMemo(() => groupByDirectory(filePaths), [filePaths]);

  const [fileToggleOpen, setFileToggleOpen] = useState<Record<string, boolean>>(
    {}
  );
  useEffect(() => {
    const initialFileToggleState: Record<string, boolean> = {};
    groups.forEach((g) => {
      initialFileToggleState[g.directory] = true;
    });
    setFileToggleOpen(initialFileToggleState);
  }, [groups]);

  const toggleFolder = (directory: string) => {
    setFileToggleOpen((prev) => ({ ...prev, [directory]: !prev[directory] }));
  };

  return (
    <CommonThemeBox
      sx={{
        flex: 1,
        width: "100%",
        height: "100%",
        p: 0,
        my: 4,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 6px 16px rgba(255, 255, 255, 0.24)"
            : "0px 6px 16px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          flex: 1,
          width: "100%",
          height: "100%",
          overflowY: "auto",
          py: 2,
          pl: 4,
          bgcolor: (theme) => theme.palette.background.nav,
        }}
      >
        <List disablePadding>
          {groups.map(({ directory, fileNames }) => {
            const fullPaths = fileNames.map((f) =>
              directory ? `${directory}/${f}` : f
            );
            const allSelected = fullPaths.every((p) => ignoreFiles.includes(p));
            const someSelected = fullPaths.some((p) => ignoreFiles.includes(p));

            return (
              <React.Fragment key={directory || "__root__"}>
                <ListSubheader disableSticky sx={{ pl: 0, bgcolor: "inherit" }}>
                  <ListItemButton
                    disableRipple
                    disableTouchRipple
                    sx={{ color: (theme) => theme.palette.text.primary }}
                    onClick={() => toggleFolder(directory)}
                  >
                    <Checkbox
                      edge="start"
                      checked={allSelected}
                      indeterminate={!allSelected && someSelected}
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      indeterminateIcon={
                        <IndeterminateCheckBoxIcon fontSize="small" />
                      }
                      onChange={() => {
                        if (allSelected) {
                          fullPaths.forEach(
                            (p) => ignoreFiles.includes(p) && onFileToggle(p)
                          );
                        } else {
                          fullPaths.forEach(
                            (p) => !ignoreFiles.includes(p) && onFileToggle(p)
                          );
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      size="small"
                      sx={{
                        mr: 1,
                        color: (theme) => theme.palette.text.primary,
                        "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                          color: (theme) => theme.palette.secondary.main,
                        },
                      }}
                    />
                    <Typography sx={{ flex: 1 }}>
                      {directory || "(root)"}
                    </Typography>
                    {fileToggleOpen[directory] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                </ListSubheader>

                <Collapse
                  in={Boolean(fileToggleOpen[directory])}
                  timeout="auto"
                  unmountOnExit
                >
                  {fileNames.map((f) => {
                    const filePaths = directory ? `${directory}/${f}` : f;
                    return (
                      <ListItemButton
                        key={filePaths}
                        disableRipple
                        disableTouchRipple
                        dense
                        sx={{
                          pl: 4,
                          color: (theme) => theme.palette.text.primary,
                        }}
                        onClick={() => onFileToggle(filePaths)}
                      >
                        <Checkbox
                          edge="start"
                          size="small"
                          checked={ignoreFiles.includes(filePaths)}
                          onChange={() => onFileToggle(filePaths)}
                          onClick={(e) => e.stopPropagation()}
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                          checkedIcon={<CheckBoxIcon fontSize="small" />}
                          indeterminateIcon={
                            <IndeterminateCheckBoxIcon fontSize="small" />
                          }
                          sx={{
                            ml: 1,
                            color: (theme) => theme.palette.text.primary,
                            "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                              color: (theme) => theme.palette.secondary.main,
                            },
                          }}
                        />
                        <Typography component="span">{f}</Typography>
                      </ListItemButton>
                    );
                  })}
                </Collapse>
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </CommonThemeBox>
  );
};

export default FileList;

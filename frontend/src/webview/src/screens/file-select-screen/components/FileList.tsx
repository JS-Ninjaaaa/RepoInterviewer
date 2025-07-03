import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  List,
  ListSubheader,
  ListItemButton,
  Checkbox,
  Collapse,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import CommonThemeBox from "@/screens/components/CommonThemeBox";

type Props = {
  paths: string[];
  selected: string[];
  onToggle: (full: string) => void;
};

type Group = { folder: string; files: string[] };

function groupByFolder(paths: string[]): Group[] {
  const map = new Map<string, string[]>();
  paths.forEach((p) => {
    const idx = p.lastIndexOf("/");
    const dir = idx === -1 ? "" : p.slice(0, idx);
    const file = p.slice(idx + 1);
    const arr = map.get(dir) ?? [];
    arr.push(file);
    map.set(dir, arr);
  });
  return Array.from(map, ([folder, files]) => ({ folder, files }));
}

const FileList: React.FC<Props> = ({ paths, selected, onToggle }) => {
  const theme = useTheme();
  const groups = useMemo(() => groupByFolder(paths), [paths]);

  const [open, setOpen] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach((g) => {
      initial[g.folder] = true;
    });
    setOpen(initial);
  }, [groups]);

  const toggleFolder = (folder: string) => {
    setOpen((prev) => ({ ...prev, [folder]: !prev[folder] }));
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
          {groups.map(({ folder, files }) => {
            const fullPaths = files.map((f) => (folder ? `${folder}/${f}` : f));
            const allSelected = fullPaths.every((p) => selected.includes(p));
            const someSelected = fullPaths.some((p) => selected.includes(p));

            return (
              <React.Fragment key={folder || "__root__"}>
                <ListSubheader disableSticky sx={{ pl: 0, bgcolor: "inherit" }}>
                  <ListItemButton
                    disableRipple
                    disableTouchRipple
                    sx={{ color: (theme) => theme.palette.text.primary }}
                    onClick={() => toggleFolder(folder)}
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
                            (p) => selected.includes(p) && onToggle(p)
                          );
                        } else {
                          fullPaths.forEach(
                            (p) => !selected.includes(p) && onToggle(p)
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
                      {folder || "(root)"}
                    </Typography>
                    {open[folder] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListSubheader>

                <Collapse
                  in={Boolean(open[folder])}
                  timeout="auto"
                  unmountOnExit
                >
                  {files.map((f) => {
                    const full = folder ? `${folder}/${f}` : f;
                    return (
                      <ListItemButton
                        key={full}
                        disableRipple
                        disableTouchRipple
                        dense
                        sx={{
                          pl: 4,
                          color: (theme) => theme.palette.text.primary,
                        }}
                        onClick={() => onToggle(full)}
                      >
                        <Checkbox
                          edge="start"
                          size="small"
                          checked={selected.includes(full)}
                          onChange={() => onToggle(full)}
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

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { TARGET_WORDS } from "../data/words";

const sortedWords = [...TARGET_WORDS].sort();

const DictionaryModal = ({ open, onClose, onSelectWord }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWords = useMemo(() => {
    const term = searchTerm.trim().toUpperCase();
    if (!term) return sortedWords;
    return sortedWords.filter((w) => w.includes(term));
  }, [searchTerm]);

  const handleWordClick = (word) => {
    if (onSelectWord) {
      onSelectWord(word);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <MenuBookIcon color="primary" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            Word Dictionary
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Stuck on a guess? Search valid 5-letter words or click one to use it!
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {/* Search Input */}
        <TextField
          fullWidth
          size="small"
          placeholder="Filter by letters (e.g. 'EA', 'ST', 'TH')..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        {/* Word Count */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{filteredWords.length}</strong> of {sortedWords.length} words
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TouchAppIcon fontSize="inherit" /> Click any word to fill it into the game
          </Typography>
        </Box>

        {/* Word Chips Grid */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            maxHeight: 320,
            overflowY: "auto",
            p: 1,
            bgcolor: "rgba(255, 255, 255, 0.03)",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {filteredWords.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, width: "100%", textAlign: "center" }}>
              No matching words found for "{searchTerm}".
            </Typography>
          ) : (
            filteredWords.map((word) => (
              <Tooltip key={word} title="Click to use word">
                <Chip
                  label={word}
                  onClick={() => handleWordClick(word)}
                  clickable
                  variant="outlined"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: 1,
                    fontSize: "0.85rem",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "rgba(83, 141, 78, 0.2)",
                      color: "primary.light",
                    },
                  }}
                />
              </Tooltip>
            ))
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Back to Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DictionaryModal;

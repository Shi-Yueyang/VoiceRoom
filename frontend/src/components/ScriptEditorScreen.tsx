import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Import ScriptContainer component
import ScriptContainer, { ScriptBlock } from "../components/ScriptContainer";
import AddBlockButton from "../components/AddBlockButton";
import { arrayMove } from "@dnd-kit/sortable";

interface ScriptEditorScreenProps {
  scriptId: string;
  onSaveScript: (scriptId: string, data: ScriptBlock[]) => void;
  onOpenSettings?: () => void; // Optional
  onNavigateBack: () => void; // Added for back navigation
}

const ScriptEditorScreen = ({
  scriptId,
  onSaveScript,
  onOpenSettings,
  onNavigateBack,
}: ScriptEditorScreenProps) => {
  // --- State Management ---
  const [scriptBlocks, setScriptBlocks] = useState<ScriptBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [scriptTitle, setScriptTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch script data including title and blocks
  useEffect(() => {
    const fetchScriptData = async () => {
      if (!scriptId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/scripts/${scriptId}`);

        if (response.data) {
          setScriptTitle(response.data.title || "");

          if (response.data.script?.blocks) {
            setScriptBlocks(response.data.script.blocks);
          }
        }
      } catch (error) {
        console.error("Error fetching script data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScriptData();
  }, [scriptId]);

  // --- Event Handlers ---
  const handleSelectBlock = (id: string) => {
    setActiveBlockId(id);
  };

  const handleEditText = (id: string, newText: string) => {
    setScriptBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block._id === id ? { ...block, text: newText } : block
      )
    );
  };

  const handleDeleteBlock = (id: string) => {
    setScriptBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block._id !== id)
    );

    // If the deleted block was active, deactivate
    if (activeBlockId === id) {
      setActiveBlockId(null);
    }
  };

  const handleAddBlock = (type: ScriptBlock["type"]) => {
    const newBlock: ScriptBlock = {
      _id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
    };

    // Insert the new block after the active block or at the end
    setScriptBlocks((prevBlocks) => {
      const activeIndex = prevBlocks.findIndex(
        (block) => block._id === activeBlockId
      );
      const insertIndex =
        activeIndex === -1 ? prevBlocks.length : activeIndex + 1;

      const newBlocks = [...prevBlocks];
      newBlocks.splice(insertIndex, 0, newBlock);
      return newBlocks;
    });

    // Set the new block as active
    setActiveBlockId(newBlock._id);
  };

  const handleSave = () => {
    onSaveScript(scriptId, scriptBlocks);
    // Could add a snackbar/toast notification here
    console.log("Script saved:", scriptId);
  };

  const handleRearrangeBlocks = (oldIndex: number, newIndex: number) => {
    setScriptBlocks((prevBlocks) => arrayMove(prevBlocks, oldIndex, newIndex));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            sx={{ mr: 1 }}
            onClick={onNavigateBack}
          >
            <ArrowBackIcon />
          </IconButton>

          {onOpenSettings && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={onOpenSettings}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Loading script...</span>
              </Box>
            ) : (
              scriptTitle || scriptId
            )}
          </Typography>

          <IconButton color="inherit" aria-label="save" onClick={handleSave}>
            <SaveIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 2,
          paddingBottom: "80px", // Space for FAB
        }}
      >
        <ScriptContainer
          scriptBlocks={scriptBlocks}
          activeBlockId={activeBlockId}
          onSelectBlock={handleSelectBlock}
          onEditBlockText={handleEditText}
          onDeleteBlock={handleDeleteBlock}
          onAddBlock={(type, _afterId) => {
            handleAddBlock(type);
          }}
          onRearrangeBlocks={handleRearrangeBlocks}
        />
      </Box>

      <AddBlockButton onAddBlock={handleAddBlock} />
    </Box>
  );
};

export default ScriptEditorScreen;

import  { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Fab,
  Modal,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Paper,
  Button,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

// Import ScriptContainer component
import ScriptContainer, { ScriptBlock } from "../components/ScriptContainer";
import { arrayMove } from "@dnd-kit/sortable";

interface ScriptEditorScreenProps {
  scriptId: string;
  initialScriptData: ScriptBlock[];
  onSaveScript: (scriptId: string, data: ScriptBlock[]) => void;
  onOpenSettings?: () => void; // Optional
}

// Define block types for the Add Element modal
const BLOCK_TYPES: ScriptBlock["type"][] = [
  "sceneHeading",
  "description",
  "character",
  "dialogue",
  "parenthetical",
  "transition",
];

const CharacterPanelScreen = ({ onClose }: { onClose: () => void }) => (
  <Box sx={{ width: 250, p: 2 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h6">Characters</Typography>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>
    <Typography>Character management content goes here</Typography>
  </Box>
);

const ScriptEditorScreen = ({
  scriptId,
  initialScriptData,
  onSaveScript,
  onOpenSettings,
}: ScriptEditorScreenProps) => {
  // --- State Management ---
  const [scriptBlocks, setScriptBlocks] = useState<ScriptBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [isAddElementModalOpen, setIsAddElementModalOpen] = useState(false);
  const [isCharacterPanelOpen, setIsCharacterPanelOpen] = useState(false);

  // Initialize script blocks from props
  useEffect(() => {
    setScriptBlocks(initialScriptData);
  }, [initialScriptData]);

  // --- Event Handlers ---

  const handleSelectBlock = (id: string) => {
    setActiveBlockId(id);
  };

  const handleEditText = (id: string, newText: string) => {
    setScriptBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, text: newText } : block
      )
    );
  };

  const handleDeleteBlock = (id: string) => {
    setScriptBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block.id !== id)
    );

    // If the deleted block was active, deactivate
    if (activeBlockId === id) {
      setActiveBlockId(null);
    }
  };

  const toggleAddElementModal = () => {
    setIsAddElementModalOpen(!isAddElementModalOpen);
  };

  const handleAddBlock = (type: ScriptBlock["type"]) => {
    const newBlock: ScriptBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      text: `New ${type}...`, // Default text
    };

    // Insert the new block after the active block or at the end
    setScriptBlocks((prevBlocks) => {
      const activeIndex = prevBlocks.findIndex(
        (block) => block.id === activeBlockId
      );
      const insertIndex =
        activeIndex === -1 ? prevBlocks.length : activeIndex + 1;

      const newBlocks = [...prevBlocks];
      newBlocks.splice(insertIndex, 0, newBlock);
      return newBlocks;
    });

    // Set the new block as active and close modal
    setActiveBlockId(newBlock.id);
    setIsAddElementModalOpen(false);
  };

  const toggleCharacterPanel = () => {
    setIsCharacterPanelOpen(!isCharacterPanelOpen);
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
            Script: {scriptId}
          </Typography>

          <IconButton
            color="inherit"
            aria-label="characters"
            onClick={toggleCharacterPanel}
          >
            <PeopleIcon />
          </IconButton>

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

      <Fab
        color="primary"
        aria-label="add element"
        onClick={toggleAddElementModal}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        <AddIcon />
      </Fab>

      <Modal
        open={isAddElementModalOpen}
        onClose={toggleAddElementModal}
        aria-labelledby="add-element-modal-title"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper
          sx={{
            padding: 3,
            minWidth: "250px",
            maxWidth: "90%",
            maxHeight: "80%",
            overflowY: "auto",
          }}
        >
          <Typography
            id="add-element-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Add Element
          </Typography>

          <List>
            {BLOCK_TYPES.map((type) => (
              <ListItem disablePadding key={type}>
                <ListItemButton onClick={() => handleAddBlock(type)}>
                  <ListItemText
                    primary={type.charAt(0).toUpperCase() + type.slice(1)}
                    secondary={
                      type === "sceneHeading"
                        ? "Where the scene takes place"
                        : type === "description"
                        ? "Describe what happens"
                        : type === "character"
                        ? "Who is speaking"
                        : type === "dialogue"
                        ? "Character's speech"
                        : type === "parenthetical"
                        ? "Acting direction"
                        : "Scene transition"
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={toggleAddElementModal}>Cancel</Button>
          </Box>
        </Paper>
      </Modal>

      {/* Character Management Panel */}
      <SwipeableDrawer
        anchor="right"
        open={isCharacterPanelOpen}
        onClose={toggleCharacterPanel}
        onOpen={() => setIsCharacterPanelOpen(true)}
        swipeAreaWidth={0} // Disable swipe to open for better UX
      >
        <CharacterPanelScreen onClose={toggleCharacterPanel} />
      </SwipeableDrawer>
    </Box>
  );
};

export default ScriptEditorScreen;

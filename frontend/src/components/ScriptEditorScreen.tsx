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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Import ScriptContainer component
import ScriptContainer from "../components/ScriptContainer";
import AddBlockButton from "../components/AddBlockButton";
import { arrayMove } from "@dnd-kit/sortable";
import { useScriptSocket } from "../hooks/useSocketIo";
import { ScriptBlock } from "@chatroom/shared";
import { BlockParamUpdates } from "@chatroom/shared/dist/SocketEvents";

interface ScriptEditorScreenProps {
  scriptId: string;
  onNavigateBack: () => void; // Added for back navigation
}

const ScriptEditorScreen = ({
  scriptId,
  onNavigateBack,
}: ScriptEditorScreenProps) => {
  const [scriptBlocks, setScriptBlocks] = useState<ScriptBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [scriptTitle, setScriptTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addBlock, updateBlock } = useScriptSocket({
    scriptId,
    onBlockAdded: (event) => {
      setScriptBlocks((prevBlocks) => [...prevBlocks, event.block]);
    },
    onBlockUpdated: (event) => {
      setScriptBlocks((prevBlocks) =>
        prevBlocks.map((block) =>
          block._id === event.blockId
            ? {
                ...block,
                blockParams: { ...block.blockParams, ...event.updates },
              }
            : block
        )
      );
    },
  });

  // Fetch script data including title and blocks
  useEffect(() => {
    const fetchScriptData = async () => {
      if (!scriptId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/scripts/${scriptId}`);
        console.log("Fetched script data:", response.data);
        if (response.data) {
          setScriptTitle(response.data.title || "");

          if (response.data.blocks) {
            setScriptBlocks(response.data.blocks);
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
  const handleSelectBlock = (blockId: string) => {
    setActiveBlockId(blockId);
  };

  const handleDeleteBlock = (blockId: string) => {
    setScriptBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block._id !== blockId)
    );

    // If the deleted block was active, deactivate
    if (activeBlockId === blockId) {
      setActiveBlockId(null);
    }
  };

  const handleAddBlock = (type: ScriptBlock["type"]) => {
    const blockParams =
      type === "sceneHeading"
        ? { intExt: "", location: "", time: "" }
        : type === "description"
        ? { text: "" }
        : type === "dialogue"
        ? { character: "", text: "" }
        : { text: "" };

    const newBlock: ScriptBlock = {
      _id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      blockParams,
    };

    // Insert the new block after the active block or at the end
    setScriptBlocks([...scriptBlocks, newBlock]);
    setActiveBlockId(newBlock._id);

    addBlock(newBlock, null); // Assuming no preceding block for simplicity
  };

  const handleUpdateBlock = (blockId: string, updates: BlockParamUpdates) => {
    setScriptBlocks(
      scriptBlocks.map((block) =>
        block._id === blockId
          ? { ...block, blockParams: { ...block.blockParams, ...updates } }
          : block
      )
    );

    updateBlock(updates, blockId);
  };

  const handleRearrangeBlocks = (oldIndex: number, newIndex: number) => {
    setScriptBlocks((prevBlocks) => arrayMove(prevBlocks, oldIndex, newIndex));
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
      onClick={() => {
        setActiveBlockId(null);
      }}
    >
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
          onDeleteBlock={handleDeleteBlock}
          onUpdateBlock={handleUpdateBlock}
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

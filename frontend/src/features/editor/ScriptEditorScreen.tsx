import { useState, useEffect, useCallback } from "react";
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
import { ScriptContainer } from "../scripts";
import AddBlockButton from "./AddBlockButton";
import AddEditorButton from "./AddEditorButton";
import { arrayMove } from "@dnd-kit/sortable";
import { useScriptSocket } from "../../hooks/useSocketIo";

import {
  ScriptBlock,
  ServerBlockAddedEvent,
  ServerBlockUpdatedEvent,
  ServerBlockDeletedEvent,
  ServerBlocksMovedEvent,
} from "@chatroom/shared";

import { BlockParamUpdates } from "@chatroom/shared/dist/SocketEvents";

interface ScriptEditorScreenProps {
  scriptId: string;
  onNavigateBack: () => void; // Added for back navigation
  hideAppBar?: boolean; // Whether to hide the built-in AppBar
}

const ScriptEditorScreen = ({
  scriptId,
  onNavigateBack,
  hideAppBar = false,
}: ScriptEditorScreenProps) => {
  const [scriptBlocks, setScriptBlocks] = useState<ScriptBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);  const [scriptTitle, setScriptTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Wrap socket event handlers in useCallback to prevent unnecessary reconnections
  const onServerBlockAdded = useCallback((event: ServerBlockAddedEvent) => {
    console.log("Block added via socket:", event);
    setScriptBlocks((prevBlocks) => [...prevBlocks, event.block].sort((a, b) => a.position - b.position));
  }, []);

  const onServerBlockUpdated = useCallback((event: ServerBlockUpdatedEvent) => {
    console.log("Block updated via socket:", event);
    setScriptBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block._id === event.blockId
          ? {
              ...block,
              blockParams: {
                ...block.blockParams,
                ...event.blockParamUpdates,
              },
            }
          : block
      )
    );
  }, []);

  const onServerBlockDeleted = useCallback((event: ServerBlockDeletedEvent) => {
    console.log("Block deleted via socket:", event);
    setScriptBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block._id !== event.blockId)
    );
  }, []);

  const onServerBlockMoved = useCallback((event: ServerBlocksMovedEvent) => {
    console.log("Blocks moved via socket:", event);
    setScriptBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      const movedBlockIndex = updatedBlocks.findIndex(
        (block) => block._id === event.blockId
      );
      
      if (movedBlockIndex !== -1) {
        // Adjust the position of the moved block
        updatedBlocks[movedBlockIndex] = {
          ...updatedBlocks[movedBlockIndex],
          position: event.newPosition,
        };
        
        // Sort the blocks by position after moving
        return updatedBlocks.sort((a, b) => a.position - b.position);
      }
      
      return updatedBlocks;
    });
  }, []);

  const { addBlockInSocket, updateBlockInSocket, deleteBlockInSocket, moveBlockInSocket } = useScriptSocket({
    scriptId,
    onServerBlockAdded,
    onServerBlockUpdated,
    onServerBlockDeleted,
    onServerBlockMoved,
  });

  // Fetch script data including title and blocks
  useEffect(() => {
    const fetchScriptData = async () => {
      if (!scriptId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/scripts/${scriptId}`);
        if (response.data) {
          setScriptTitle(response.data.title || "");

          if (response.data.blocks) {
            // Sort blocks by position to ensure correct order
            const sortedBlocks = response.data.blocks.sort((a: ScriptBlock, b: ScriptBlock) => a.position - b.position);
            setScriptBlocks(sortedBlocks);
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

    deleteBlockInSocket(blockId);
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

    // Calculate position for the new block
    let newPosition = 4096; // Default position if no blocks exist
    
    if (scriptBlocks.length > 0) {
      if (activeBlockId) {
        // Find the position of the currently active block
        const activeBlockIndex = scriptBlocks.findIndex(block => block._id === activeBlockId);
        if (activeBlockIndex !== -1) {
          const activeBlock = scriptBlocks[activeBlockIndex];
          const nextBlock = scriptBlocks[activeBlockIndex + 1];
          
          if (nextBlock) {
            // Insert between active block and next block
            newPosition = (activeBlock.position + nextBlock.position) / 2;
          } else {
            // Insert after the last block
            newPosition = activeBlock.position + 4096;
          }
        } else {
          // If active block not found, add at the end
          const maxPosition = Math.max(...scriptBlocks.map(block => block.position));
          newPosition = maxPosition + 4096;
        }
      } else {
        // No active block, add at the end
        const maxPosition = Math.max(...scriptBlocks.map(block => block.position));
        newPosition = maxPosition + 4096;
      }
    }

    const newBlock: ScriptBlock = {
      _id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      position: newPosition,
      blockParams,
    };

    // Insert the new block and sort by position

    setActiveBlockId(newBlock._id);

    addBlockInSocket(newBlock); // Assuming no preceding block for simplicity
  };

  const handleUpdateBlock = (blockId: string, blockParamUpdates: BlockParamUpdates) => {
    setScriptBlocks(
      scriptBlocks.map((block) =>
        block._id === blockId
          ? { ...block, blockParams: { ...block.blockParams, ...blockParamUpdates } }
          : block
      )
    );

    updateBlockInSocket(blockId, blockParamUpdates);
  };

  const handleRearrangeBlocks = (oldIndex: number, newIndex: number) => {

    setScriptBlocks((prevBlocks) => {
      // First, move the block to the new position in the array
      const rearrangedBlocks = arrayMove(prevBlocks, oldIndex, newIndex);
      
      // Only adjust the position of the moved block
      const movedBlock = rearrangedBlocks[newIndex];
      let newPosition = movedBlock.position;
      
      // Calculate new position based on neighbors
      const prevBlock = newIndex > 0 ? rearrangedBlocks[newIndex - 1] : null;
      const nextBlock = newIndex < rearrangedBlocks.length - 1 ? rearrangedBlocks[newIndex + 1] : null;
      
      if (prevBlock && nextBlock) {
        // Insert between two blocks
        newPosition = (prevBlock.position + nextBlock.position) / 2;
      } else if (prevBlock) {
        // Insert after the last block
        newPosition = prevBlock.position + 4096;
      } else if (nextBlock) {
        // Insert before the first block
        newPosition = nextBlock.position - 4096;
      } else {
        // Only block in the list
        newPosition = 4096;
      }
      moveBlockInSocket(movedBlock._id, newPosition);
      // Update only the moved block's position
      rearrangedBlocks[newIndex] = {
        ...movedBlock,
        position: newPosition
      };
      
      return rearrangedBlocks;
    });


  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: hideAppBar ? "calc(100vh - 64px)" : "100vh" }}
      onClick={() => {
        setActiveBlockId(null);
      }}
    >
      {/* Header - Only show if not hidden */}
      {!hideAppBar && (
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
      )}

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
          onRearrangeBlocks={handleRearrangeBlocks}
        />
      </Box>

      <AddBlockButton onAddBlock={handleAddBlock} />
      <AddEditorButton 
        scriptId={scriptId}
        onEditorAdded={(username) => {
          console.log(`Editor ${username} added successfully`);
          // Optionally refresh script data or show notification
        }}
      />
    </Box>
  );
};

export default ScriptEditorScreen;

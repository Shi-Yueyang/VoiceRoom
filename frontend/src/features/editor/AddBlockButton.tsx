import { useState } from "react";
import {
  Fab,
  Modal,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Button,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ScriptBlock } from "@chatroom/shared";


interface AddBlockButtonProps {
  onAddBlock: (type: ScriptBlock["type"]) => void;
}

// Define block types for the Add Element modal
const BLOCK_TYPES: ScriptBlock["type"][] = [
  "sceneHeading",
  "description",
  "dialogue",
];

const AddBlockButton = ({ onAddBlock }: AddBlockButtonProps) => {
  const [isAddElementModalOpen, setIsAddElementModalOpen] = useState(false);

  const toggleAddElementModal = () => {
    setIsAddElementModalOpen(!isAddElementModalOpen);
  };

  const handleAddBlock = (type: ScriptBlock["type"]) => {
    onAddBlock(type);
    setIsAddElementModalOpen(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add element"
        onClick={toggleAddElementModal}
        sx={{
          position: "fixed",
          bottom: 16,
          left: 16,
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
            添加元素
          </Typography>

          <List>
            {BLOCK_TYPES.map((type) => (
              <ListItem disablePadding key={type}>
                <ListItemButton onClick={() => handleAddBlock(type)}>
                  <ListItemText
                    primary={
                      type === "sceneHeading"
                        ? "场景"
                        : type === "description"
                        ? "描述"
                        : type === "dialogue"
                        ? "对话"
                        : "未知"
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
    </>
  );
};

export default AddBlockButton;

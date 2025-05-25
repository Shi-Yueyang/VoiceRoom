import React from 'react';
import { 
  Box, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export interface ScriptSummary {
  _id: string;
  title: string;
  lastModified: string;
}

interface ScriptItemProps {
  script: ScriptSummary;
  showDivider: boolean;
  onSelect: (scriptId: string) => void;
  onDelete: (event: React.MouseEvent, script: ScriptSummary) => void;
  formatDate: (dateString: string) => string;
}

const ScriptItem: React.FC<ScriptItemProps> = ({ 
  script, 
  showDivider, 
  onSelect, 
  onDelete,
  formatDate 
}) => {
  return (
    <Box>
      {showDivider && <Divider />}
      <ListItem 
        disablePadding
        secondaryAction={
          <Tooltip title="Delete script">
            <IconButton 
              edge="end" 
              aria-label="delete"
              onClick={(e) => onDelete(e, script)}
              size="small"
              sx={{ mr: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <ListItemButton onClick={() => onSelect(script._id)}>
          <ListItemText
            primary={script.title}
            secondary={formatDate(script.lastModified)}
          />
        </ListItemButton>
      </ListItem>
    </Box>
  );
};

export default ScriptItem;

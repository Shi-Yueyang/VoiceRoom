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
import type { ScriptSummary } from '../../../types';

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
            secondary={
              <Box component="span">
                <Box component="div" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  Created by: {
                    typeof script.creator === 'object' 
                      ? script.creator.username 
                      : script.creator || 'Unknown'
                  }
                </Box>
                <Box component="div" sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 0.25 }}>
                  Editors: {
                    Array.isArray(script.editors) && script.editors.length > 0
                      ? script.editors
                          .map(editor => 
                            typeof editor === 'object' ? editor.username : editor
                          )
                          .join(', ')
                      : 'None'
                  }
                </Box>
                <Box component="div" sx={{ fontSize: '0.75rem', color: 'text.disabled', mt: 0.25 }}>
                  Last modified: {formatDate(script.lastModified)}
                </Box>
              </Box>
            }
          />
        </ListItemButton>
      </ListItem>
    </Box>
  );
};

export default ScriptItem;

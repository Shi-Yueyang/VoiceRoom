import React from 'react';
import {
  Box,
  List,
  Paper,
  Pagination
} from '@mui/material';
import ScriptItem from './ScriptItem';
import { ScriptSummary } from '../../../types';


interface ScriptListProps {
  scripts: ScriptSummary[];
  currentPage: number;
  totalPages: number;
  onSelectScript: (scriptId: string) => void;
  onDeleteScript: (event: React.MouseEvent, script: ScriptSummary) => void;
  onPageChange: (page: number) => void;
  formatDate: (dateString: string) => string;
}

const ScriptList: React.FC<ScriptListProps> = ({
  scripts,
  currentPage,
  totalPages,
  onSelectScript,
  onDeleteScript,
  onPageChange,
  formatDate
}) => {
  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {scripts.map((script, index) => (
          <ScriptItem
            key={script._id}
            script={script}
            showDivider={index > 0}
            onSelect={onSelectScript}
            onDelete={onDeleteScript}
            formatDate={formatDate}
          />
        ))}
      </List>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
          />
        </Box>
      )}
    </Paper>
  );
};

export default ScriptList;

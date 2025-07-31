import React from 'react';
import { Box, Typography, Container } from '@mui/material';

interface GroupsScreenProps {
  searchTerm?: string;
}

const GroupsScreen: React.FC<GroupsScreenProps> = ({ searchTerm }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom color="text.primary">
          Groups
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
          The Groups feature is currently under development. This will allow you to organize 
          and collaborate on scripts with team members, create shared workspaces, and manage 
          group permissions.
        </Typography>
        {searchTerm && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Search term: "{searchTerm}"
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default GroupsScreen;

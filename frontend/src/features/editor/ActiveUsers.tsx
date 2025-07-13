import React from 'react';
import { Typography, Avatar, Chip, Stack, Paper } from '@mui/material';
import { SocketUser } from '@chatroom/shared';
import PersonIcon from '@mui/icons-material/Person';

interface ActiveUsersProps {
  users: SocketUser[];
  currentUserId?: string;
}

export const ActiveUsers: React.FC<ActiveUsersProps> = ({ users, currentUserId }) => {
  // Deduplicate users by userId as a safety measure
  const uniqueUsers = users.filter((user, index, array) => 
    array.findIndex(u => u.userId === user.userId) === index
  );

  if (uniqueUsers.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Active Users
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No other users in this room
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Active Users ({uniqueUsers.length})
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {uniqueUsers.map((user) => (
          <Chip
            key={user.userId}
            avatar={
              <Avatar sx={{ width: 24, height: 24 }}>
                <PersonIcon fontSize="small" />
              </Avatar>
            }
            label={user.username}
            variant={user.userId === currentUserId ? "filled" : "outlined"}
            color={user.userId === currentUserId ? "primary" : "default"}
            size="small"
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default ActiveUsers;

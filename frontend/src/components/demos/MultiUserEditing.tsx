import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Chip,
  Stack,
  Paper,
  Alert,
  AlertTitle
} from '@mui/material';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const EDITING_NAMESPACE = '/editing'; // Define the namespace

interface User {
  id: string;
  name: string;
  color: string;
}

// Helper to get contrasting text color
const getContrastColor = (hexColor: string): string => {
  if (!hexColor) return '#000000';
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
};


const MultiUserEditing: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(true); // Track initial connection attempt
  const [users, setUsers] = useState<User[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null); // Keep ref for potential future use (e.g., cursor position)


  
  useEffect(() => {
    // Connect to the specific namespace
    socketRef.current = io(`${BACKEND_URL}${EDITING_NAMESPACE}`);
    setConnecting(true); // Start connection attempt

    socketRef.current.on('connect', () => {
      setConnected(true);
      setConnecting(false);
      console.log('Connected to /editing namespace');
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
      setConnecting(false);
      setIsJoined(false); // Reset joined state on disconnect
      setUsers([]); // Clear users on disconnect
      console.log('Disconnected from /editing namespace');
    });

    socketRef.current.on('connect_error', (err) => {
        console.error('Connection Error:', err);
        setConnected(false);
        setConnecting(false);
    });

    socketRef.current.on('document-update', (newContent: string) => {
      setContent(newContent);
    });

    socketRef.current.on('users-update', (connectedUsers: User[]) => {
      setUsers(connectedUsers);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (socketRef.current && isJoined) {
      socketRef.current.emit('document-change', newContent);
    }
  };

  const joinSession = () => {
    if (!userName.trim() || !socketRef.current || !connected) return;

    socketRef.current.emit('join-editing-session', { name: userName.trim() });
    setIsJoined(true);
  };

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleJoinKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userName.trim() && connected) {
      joinSession();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Collaborative Editor
        </Typography>

        {!isJoined ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            p={3}
            border={1}
            borderColor="divider"
            borderRadius={1}
          >
            {connecting && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">Connecting to server...</Typography>
              </Box>
            )}
            {!connecting && !connected && (
                 <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                    <AlertTitle>Connection Failed</AlertTitle>
                    Could not connect to the collaboration server. Please check the backend and refresh.
                </Alert>
            )}
             {!connecting && connected && (
                 <Alert severity="info" sx={{ width: '100%', mb: 2 }}>
                    Enter your name to join the collaborative editing session.
                </Alert>
            )}
            <TextField
              label="Your Name"
              variant="outlined"
              value={userName}
              onChange={handleNameInputChange}
              onKeyDown={handleJoinKeyPress} // Allow joining with Enter key
              disabled={!connected || connecting}
              sx={{ width: '100%', maxWidth: 400 }}
            />
            <Button
              variant="contained"
              onClick={joinSession}
              disabled={!connected || !userName.trim() || connecting}
              sx={{ px: 4, py: 1.5 }}
            >
              Join Session
            </Button>
             <Typography variant="caption" color={connected ? 'success.main' : 'error.main'}>
                Status: {connecting ? 'Connecting...' : connected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
              <Typography variant="body2" color={connected ? 'success.main' : 'error.main'}>
                Status: {connected ? 'Connected' : 'Disconnected'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="body2">Active users:</Typography>
                {users.length > 0 ? users.map(user => (
                  <Chip
                    key={user.id}
                    label={user.name}
                    size="small"
                    sx={{
                      backgroundColor: user.color,
                      color: getContrastColor(user.color), // Ensure text is readable
                      fontWeight: 'medium'
                    }}
                  />
                )) : (
                    <Typography variant="caption" color="text.secondary">No other users</Typography>
                )}
              </Stack>
            </Box>

            <TextField
              inputRef={editorRef} // Use inputRef for TextField
              value={content}
              onChange={handleContentChange}
              placeholder="Start typing here. Changes will be visible to all connected users in real-time."
              multiline
              rows={15} // Adjust rows as needed
              variant="outlined"
              fullWidth
              sx={{
                mb: 2,
                fontFamily: '"Fira Code", "Courier New", Courier, monospace', // Example using a monospace font
                fontSize: '1rem',
                '& .MuiOutlinedInput-root': {
                    padding: 0, // Remove default padding if needed
                    '& .MuiOutlinedInput-input': {
                        padding: '12px 14px', // Adjust internal padding
                        lineHeight: 1.6,
                    },
                },
              }}
            />


          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default MultiUserEditing;
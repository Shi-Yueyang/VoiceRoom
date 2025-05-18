import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Box, Button, Container, TextField, Typography, Paper, List, ListItem, ListItemText, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  _id: string;
  text: string;
  user: string;
  room: string;
  timestamp: string;
  updatedAt?: string;
}

const SocketMongoChat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('general');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [rooms, setRooms] = useState<string[]>(['general']);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to socket server
  useEffect(() => {
    // Randomly generate a username if not set
    if (!username) {
      setUsername(`User_${Math.floor(Math.random() * 1000)}`);
    }
    
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    
    // Socket event listeners
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });
    
    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });
    
    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Join room and fetch initial messages when socket connects
  useEffect(() => {
    if (socket && isConnected) {
      // Join the room
      socket.emit('join_room', room);
      
      // Fetch messages for the current room
      fetchMessages();
      
      // Fetch available rooms
      fetchRooms();
      
      // Listen for incoming messages
      socket.on('receive_message', (newMessage: Message) => {
        setMessages(prev => [...prev, newMessage]);
      });
      
      // Listen for message updates
      socket.on('message_updated', (updatedMessage: Message) => {
        setMessages(prev => 
          prev.map(msg => 
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        );
        setEditingMessage(null);
      });
      
      // Listen for message deletions
      socket.on('message_deleted', (data: { id: string }) => {
        setMessages(prev => prev.filter(msg => msg._id !== data.id));
      });
      
      // Listen for errors
      socket.on('error', (error: { message: string }) => {
        console.error('Socket error:', error.message);
        alert(`Error: ${error.message}`);
      });
      
      // Clean up event listeners
      return () => {
        socket.off('receive_message');
        socket.off('message_updated');
        socket.off('message_deleted');
        socket.off('error');
      };
    }
  }, [socket, isConnected, room]);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/messages/${room}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/rooms');
      if (response.ok) {
        const data = await response.json();
        // Ensure 'general' is always included
        if (!data.includes('general')) {
          data.unshift('general');
        }
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };
  
  const sendMessage = () => {
    if (message.trim() === '' || !socket || !isConnected) return;
    
    socket.emit('send_message', {
      text: message,
      user: username,
      room
    });
    
    setMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const startEdit = (msg: Message) => {
    setEditingMessage(msg._id);
    setEditText(msg.text);
  };
  
  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText('');
  };
  
  const saveEdit = (id: string) => {
    if (editText.trim() === '' || !socket) return;
    
    socket.emit('update_message', {
      id,
      text: editText,
      room
    });
  };
  
  const deleteMessage = (id: string) => {
    if (!socket) return;
    
    if (window.confirm('Are you sure you want to delete this message?')) {
      socket.emit('delete_message', {
        id,
        room
      });
    }
  };
  
  const changeRoom = (newRoom: string) => {
    if (socket && newRoom !== room) {
      socket.emit('join_room', newRoom);
      setRoom(newRoom);
      setMessages([]);
    }
  };
  
  const createNewRoom = () => {
    const newRoom = prompt('Enter a new room name:');
    if (newRoom && newRoom.trim() !== '') {
      changeRoom(newRoom.trim());
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Socket.IO + MongoDB Chat Demo
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Status: {isConnected ? 
                  <span style={{ color: 'green' }}>Connected</span> : 
                  <span style={{ color: 'red' }}>Disconnected</span>}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Rooms</Typography>
            <List dense>
              {rooms.map((r) => (
                <ListItem 
                  key={r} 
                  button 
                  selected={r === room}
                  onClick={() => changeRoom(r)}
                >
                  <ListItemText primary={r} />
                </ListItem>
              ))}
              <ListItem button onClick={createNewRoom}>
                <ListItemText primary="+ New Room" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              mb: 2, 
              height: '400px', 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Room: {room}
            </Typography>
            
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {messages.length === 0 ? (
                <Typography variant="body2" color="textSecondary" align="center">
                  No messages yet. Be the first to say something!
                </Typography>
              ) : (
                messages.map((msg) => (
                  <Paper
                    key={msg._id}
                    elevation={1}
                    sx={{
                      p: 1,
                      mb: 1,
                      backgroundColor: msg.user === username ? '#e3f2fd' : '#f5f5f5',
                      maxWidth: '80%',
                      ml: msg.user === username ? 'auto' : 0,
                    }}
                  >
                    {editingMessage === msg._id ? (
                      <Box>
                        <TextField
                          fullWidth
                          multiline
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          variant="outlined"
                          size="small"
                          margin="dense"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button size="small" onClick={cancelEdit} sx={{ mr: 1 }}>
                            Cancel
                          </Button>
                          <Button 
                            size="small" 
                            variant="contained" 
                            onClick={() => saveEdit(msg._id)}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="body1">{msg.text}</Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center', 
                          mt: 1,
                          fontSize: '0.75rem',
                          color: 'text.secondary' 
                        }}>
                          <span>
                            <strong>{msg.user}</strong> · {formatTimestamp(msg.timestamp)}
                            {msg.updatedAt && ' (edited)'}
                          </span>
                          
                          {msg.user === username && (
                            <Box>
                              <IconButton 
                                size="small" 
                                onClick={() => startEdit(msg)}
                                sx={{ p: 0.5 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => deleteMessage(msg._id)}
                                sx={{ p: 0.5 }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </>
                    )}
                  </Paper>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs>
                <TextField
                  fullWidth
                  label="Type a message"
                  multiline
                  maxRows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  placeholder="Press Enter to send"
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={sendMessage}
                  sx={{ height: '100%' }}
                  disabled={!isConnected || message.trim() === ''}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SocketMongoChat;

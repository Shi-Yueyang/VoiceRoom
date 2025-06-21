import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import scriptEditorIcon from '../../assets/script-editor.svg';

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(username, password, email || undefined);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      p: 2,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: { xs: '400px', sm: '500px', md: '800px', lg: '1000px' },
          p: { xs: 3, sm: 4, md: 6 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 0, md: 4 },
        }}
      >
        {/* Left side - Logo and branding (hidden on small screens, shown on medium+) */}
        <Box sx={{ 
          flex: { xs: 0, md: 1 },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <Box
            sx={{
              width: '80%',
              maxWidth: 300,
              height: 200,
              mb: 3,
              background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <img 
              src={scriptEditorIcon} 
              alt="Script Editor" 
              style={{ width: 64, height: 64 }}
            />
            <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold' }}>
              Script Editor
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Join us today
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 300 }}>
            Create your account and start building amazing scripts with our powerful editor.
          </Typography>
        </Box>

        {/* Right side - Register form */}
        <Box sx={{ 
          flex: { xs: 1, md: 1 },
          maxWidth: { xs: '100%', md: 400 },
          width: '100%',
        }}>
          {/* Mobile logo (shown only on small screens) */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4, 
            display: { xs: 'block', md: 'none' } 
          }}>
            <Box
              sx={{
                width: '100%',
                height: 150,
                mb: 2,
                background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <img 
                src={scriptEditorIcon} 
                alt="Script Editor" 
                style={{ width: 48, height: 48 }}
              />
              <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold' }}>
                Script Editor
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
              Join us today
            </Typography>
          </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, color: '#d32f2f', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Username
            </Typography>
            <TextField
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Email (optional)
            </Typography>
            <TextField
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mb: 2,
              py: 1.5,
              backgroundColor: '#1976d2',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
              '&:disabled': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Already have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={onSwitchToLogin}
                sx={{
                  color: 'white',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: '#f0f0f0',
                  },
                }}
              >
                Log in
              </Link>
            </Typography>
          </Box>
        </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterScreen;

import { 
  List,
  ListItemButton,
  ListItemText,
  Paper
} from '@mui/material';

// Extracted SuggestionsList component
const SuggestionsList = ({
  show,
  suggestions,
  onSelectSuggestion
}: {
  show: boolean;
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}) => {
  if (!show) return null;
  
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        width: '100%',
        maxHeight: 200,
        overflow: 'auto',
        zIndex: 1200,
        mt: 0.5
      }}
    >
      <List dense>
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <ListItemButton
              key={suggestion}
              onClick={() => onSelectSuggestion(suggestion)}
              sx={{
                fontFamily: 'Courier New, monospace',
                textTransform: 'uppercase'
              }}
            >
              <ListItemText primary={suggestion} />
            </ListItemButton>
          ))
        ) : (
          <ListItemButton disabled>
            <ListItemText primary="No suggestions" />
          </ListItemButton>
        )}
      </List>
    </Paper>
  );
};

export default SuggestionsList;
import ScriptEditorScreen from './components/ScriptEditorScreen'; // Adjust the import path as needed
import { ScriptBlock } from './components/ScriptContainer';

// Define mock initial script data
const mockScriptData: ScriptBlock[] = [
  {
    id: 'block-1',
    type: 'sceneHeading',
    text: 'EXT. COFFEE SHOP - DAY'
  },
  {
    id: 'block-2',
    type: 'action',
    text: 'John enters the coffee shop, looking around nervously.'
  },

  {
    id: 'block-4',
    type: 'dialogue',
    text: 'Is this seat taken?'
  }
];

function App() {
  // Handler for saving the script data
  const handleSaveScript = (scriptId: string, data: any[]) => {
    console.log(`Saving script ${scriptId}:`, data);
    // In a real app, you would save this data to local storage or send to a server
  };

  return (
    <ScriptEditorScreen
      scriptId="my-first-script"
      initialScriptData={mockScriptData}
      onSaveScript={handleSaveScript}
    />
  );
}

export default App;
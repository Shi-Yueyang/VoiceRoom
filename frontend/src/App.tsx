import { useState } from 'react';
import ScriptEditorScreen from './components/ScriptEditorScreen';
import { ScriptBlock } from './components/ScriptContainer';
import ChatRoom from './components/demos/ChatRoom';
import MultiUserEditing from './components/demos/MultiUserEditing';
import VoiceChat from './components/demos/VoiceChat';
import SocketMongoChat from './components/demos/SocketMongoChat';

// Define mock initial script data
const mockScriptData: ScriptBlock[] = [
  {
    id: 'block-1',
    type: 'sceneHeading',
    blockParams: {
      intExt: '外景',
      location: '咖啡馆',
      time: '白天'
    }
  },
  {
    id: 'block-2',
    type: 'description',
    blockParams: {
      text: 'John enters the coffee shop, looking around nervously.'
    }
  },
  {
    id: 'block-4',
    type: 'dialogue',
    blockParams: {
      characterName: 'John',
      text: 'Is this seat taken? lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    }
  }
];

type DemoType = 'script' | 'chat' | 'editing' | 'voice' | 'socketMongo';

function App() {
  const [currentDemo, setCurrentDemo] = useState<DemoType>('socketMongo');

  // Handler for saving the script data
  const handleSaveScript = (scriptId: string, data: any[]) => {
    console.log(`Saving script ${scriptId}:`, data);
    // In a real app, you would save this data to local storage or send to a server
  };

  const renderDemo = () => {
    switch (currentDemo) {
      case 'script':
        return (
          <ScriptEditorScreen
            scriptId="my-first-script"
            initialScriptData={mockScriptData}
            onSaveScript={handleSaveScript}
          />
        );
      case 'chat':
        return <ChatRoom />;
      case 'editing':
        return <MultiUserEditing />;
      case 'voice':
        return <VoiceChat />;
      case 'socketMongo':
        return <SocketMongoChat />;
      default:
        return <div>Select a demo to get started</div>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ 
        padding: '10px', 
        borderBottom: '1px solid #eaeaea', 
        display: 'flex',
        gap: '10px',
        backgroundColor: '#f5f5f5'
      }}>
        <button 
          onClick={() => setCurrentDemo('script')}
          style={{ 
            padding: '8px 12px',
            backgroundColor: currentDemo === 'script' ? '#007bff' : '#e9e9e9',
            color: currentDemo === 'script' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Script Editor
        </button>
        <button 
          onClick={() => setCurrentDemo('chat')}
          style={{ 
            padding: '8px 12px',
            backgroundColor: currentDemo === 'chat' ? '#007bff' : '#e9e9e9',
            color: currentDemo === 'chat' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Chat Room
        </button>
        <button 
          onClick={() => setCurrentDemo('editing')}
          style={{ 
            padding: '8px 12px',
            backgroundColor: currentDemo === 'editing' ? '#007bff' : '#e9e9e9',
            color: currentDemo === 'editing' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Multi-User Editing
        </button>
        <button 
          onClick={() => setCurrentDemo('voice')}
          style={{ 
            padding: '8px 12px',
            backgroundColor: currentDemo === 'voice' ? '#007bff' : '#e9e9e9',
            color: currentDemo === 'voice' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Voice Chat
        </button>
        <button 
          onClick={() => setCurrentDemo('socketMongo')}
          style={{ 
            padding: '8px 12px',
            backgroundColor: currentDemo === 'socketMongo' ? '#007bff' : '#e9e9e9',
            color: currentDemo === 'socketMongo' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Socket.IO + MongoDB
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderDemo()}
      </div>
    </div>
  );
}

export default App;
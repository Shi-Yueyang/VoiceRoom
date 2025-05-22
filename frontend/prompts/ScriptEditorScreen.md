Create a React functional component using TypeScript and MUI named `ScriptEditorScreen`.

**Role**
This component represents the main script editing view for a mobile-first application. It displays a list of script blocks, manages their order and content, handles user interactions for selecting, editing, adding, and deleting blocks, and provides access to the Character Management Panel.

**Constraints & Context**
* Mobile-First: Design and styling should be optimized for small screens.
* TypeScript: Use TypeScript for props, state types, and function signatures.
* MUI (Material UI): Use MUI components for UI elements and layout 
* I don't have a backend yet 

**Props**
- `scriptId`: Identifier for the script being edited (even without backend, helps conceptualize).
- `initialScriptData`: `  An array of `ScriptBlock` objects to initially load.
- `onSaveScript`: `(scriptId: string, data: ScriptBlock[]) => void` - Callback function to "save" the script data (simulate saving).

**State:**
* `scriptBlocks`: `ScriptBlock[]` - The array holding the current state of all script blocks. Manage this with `useState`.
* `activeBlockId`: `string | null` - The ID of the currently selected block for editing. Use `useState`, default to `null`.
* `isAddElementModalOpen`: `boolean` - Controls the visibility of the "Add Element" selection modal. Use `useState`, default to `false`.
* `isCharacterPanelOpen`: `boolean` - Controls the visibility of the Character Management Panel. Use `useState`, default to `false`.

**UI Structure**
- Header:
Script Title (can be static for now or based on scriptId).
A "Save" button (MUI Button or IconButton).
A "Menu" icon button (MUI IconButton) that could lead to settings (onOpenSettings).
A "Characters" icon button (MUI IconButton) to toggle the CharacterPanelScreen.
- Main Content Area: Use Mui Box. This area should be scrollable
Render the ScriptContainer component inside this area.
- "Add Element" Control: Use a Mui Fab
- "Add Element" Modal: Use  This modal displays options to add different block types. 
- Character Management Panel: Use Mui SwipeableDrawer or Mui Modal sliding in from the side or bottom on mobile. This panel will render the CharacterPanelScreen component.

**Behavior & Event Handlers:**
- Initial Load: populate the scriptBlocks state with initialScriptData when the component mounts.
- Handle Block Selection: Implement a function that updates the activeBlockId state. Pass this down to individual block components via ScriptContainer.
- Handle Block Deletion
- Toggle Add Element Modal
- Handle Add New Block
- Toggle Character Panel: should be triggered by the "Characters" button in the Header and the close button in the Character Panel component.
- Handle Save
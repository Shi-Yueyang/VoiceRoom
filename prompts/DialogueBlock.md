Create a React functional component using TypeScript and MUI named `DialogueBlock`.

**Role:**
This component is responsible for rendering and allowing editing of a single Dialogue block in a mobile script editor. It must display dialogue text with the correct script indentation.

**Constraints & Context:**
* **Mobile-First:** Styling optimized for mobile touch.
* **Parent Component:** Used within `ScriptContainer`, typically follows a `CharacterBlock`.
* **Standard Formatting:** Dialogue is significantly indented from the left margin and uses a monospace font.

**Props:**
* `id`: `string` - The unique identifier for this block.
* `text`: `string` - The dialogue text content.
* `isActive`: `boolean` - True if this block is currently selected/active for editing.
* `onSelect`: `(id: string) => void` - Callback when the block is tapped to activate.
* `onEditText`: `(id: string, newText: string) => void` - Callback when text changes and editing finishes.
* `onDelete`: `(id: string) => void` - Callback when the delete button is clicked.
* `characterId`: `string` - The ID of the character speaking this dialogue (needed for context, not displayed by this block).

**State:**
* `isEditing`: `boolean` - Controls whether the textarea is visible.
* `currentText`: `string` - Holds the text being edited.

**TypeScript Types:**
Assume the `ScriptBlock` interface is available from the context (as defined in the `ScriptEditorScreen` prompt).

**UI Structure:**
1.  A main container Display the `text` prop when `isEditing` is `false`.
2.  A `Mui IconButton` with a `DeleteIcon` (`@mui/icons-material/Delete`), visible only when `isActive` is `true`.

**Behavior & Event Handlers:**
1.  **Initialization:** Update `isEditing` state based on `isActive`. If `isActive` becomes true, set `isEditing(true)` and `currentText` to the `text` prop.
2.  **Click to Select/Edit:** Attach an `onClick` handler to the main `Mui Box`. If not already editing, call `onSelect(id)`.
3.  **Textarea Change:** Attach an `onChange` handler to the `textarea`. Update the internal `currentText` state.
4.  **Finish Editing:** Attach an `onBlur` handler to the `textarea`. Call `onEditText(id, currentText)`. Set `isEditing(false)`.
5.  **Delete Block:** Attach an `onClick` handler to the `IconButton`. Call `onDelete(id)`.
6.  Ensure the `textarea` auto-focuses when `isEditing` becomes true.

**Styling:**
* Add a distinct `backgroundColor` or `border` style to the box when `isActive` is `true` for highlighting.
* **Crucially, apply a significant `margin-left` or `padding-left` to the `Typography` and `textarea` elements *inside* the `Mui Box`** to create the dialogue indentation. Choose a fixed value (e.g., `theme.spacing(8)`) or percentage (`15%`) that works well on mobile.
* Use a **monospace font** (`fontFamily: 'Courier New, monospace'`) for both the `Typography` and `textarea`.
* Ensure text wraps correctly within the indented area.
* Style the `textarea` to remove default border/outline and resize handle, and take up the remaining width after indentation within the padding.
* Position the delete button (`IconButton`) absolutely in the top-right corner of the `Mui Box` (set `Mui Box` to `position: 'relative'`, `IconButton` to `position: 'absolute'`). Adjust positioning for mobile touch.
Create a React functional component using TypeScript and MUI named `ActionBlock`.

**Role:**
This component is responsible for rendering and allowing editing of a single Action block in a mobile script editor. It displays descriptive text about the scene, left-aligned.

**Constraints & Context:**
* **Mobile-First:** Styling optimized for mobile touch.
* **Parent Component:** Used within `ScriptContainer`.
* **Standard Formatting:** Action text is left-aligned and uses a monospace font.

**Props:**
* `id`: `string` - The unique identifier for this block.
* `text`: `string` - The action text content.
* `isActive`: `boolean` - True if this block is currently selected/active for editing.
* `onSelect`: `(id: string) => void` - Callback when the block is tapped to activate.
* `onEditText`: `(id: string, newText: string) => void` - Callback when text changes and editing finishes.
* `onDelete`: `(id: string) => void` - Callback when the delete button is clicked.

**State:**
* `isEditing`: `boolean` - Controls whether the textarea is visible.
* `currentText`: `string` - Holds the text being edited.

**TypeScript Types:**
Assume the `ScriptBlock` interface is available from the context (as defined in the `ScriptEditorScreen` prompt).

**UI Structure:**
1.  A main container `Mui Box`.
2.  Inside this `Box`, render either:
    * `Mui Typography`: Display the `text` prop when `isEditing` is `false`.
    * `Mui TextareaAutosize`: Display the `currentText` state when `isEditing` is `true`. It should auto-focus. Remove default browser styling.
3.  A `Mui IconButton` with a `DeleteIcon` (`@mui/icons-material/Delete`), visible only when `isActive` is `true`.

**Behavior & Event Handlers:**
1.  **Initialization:** Update `isEditing` state based on `isActive`. If `isActive` becomes true, set `isEditing(true)` and `currentText` to the `text` prop.
2.  **Click to Select/Edit:** Attach an `onClick` handler to the main `Mui Box`. If not already editing, call `onSelect(id)`.
3.  **Textarea Change:** Attach an `onChange` handler to the `textarea`. Update the internal `currentText` state.
4.  **Finish Editing:** Attach an `onBlur` handler to the `textarea`. Call `onEditText(id, currentText)`. Set `isEditing(false)`.
5.  **Delete Block:** Attach an `onClick` handler to the `IconButton`. Call `onDelete(id)`.
6.  Ensure the `textarea` auto-focuses when `isEditing` becomes true.

**Styling:**
* Apply styles to the main `Mui Box` for `padding`, `margin-bottom`, and a subtle `backgroundColor` or `border` for block separation.
* Add a distinct `backgroundColor` or `border` style to the `Mui Box` when `isActive` is `true` for highlighting.
* **Do NOT apply any additional `margin-left` or `padding-left` to the `Typography` or `textarea` elements themselves beyond the main Box padding.** The content should start at the left edge of the block's content area.
* Use a **monospace font** (`fontFamily: 'Courier New, monospace'`) for both the `Typography` and `textarea`.
* Ensure text wraps naturally within the block width (minus padding).
* Style the `textarea` to remove default border/outline and resize handle, and take up the full width of the block's content area.
* Position the delete button (`IconButton`) absolutely in the top-right corner of the `Mui Box` (set `Mui Box` to `position: 'relative'`, `IconButton` to `position: 'absolute'`). Adjust positioning for mobile touch.
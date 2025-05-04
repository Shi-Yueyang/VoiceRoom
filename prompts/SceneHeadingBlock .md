Create a React functional component using TypeScript and MUI named `SceneHeadingBlock`.

**Role:**
This component is responsible for rendering and allowing editing of a single Scene Heading (Slugline) block within the main script editor view. It should be a visually distinct, tappable block.

**Constraints & Context:**
* **Mobile-First:** Styling should be appropriate for mobile touch interactions.
* **Parent Component:** This component will be used within a `ScriptContainer` component, which manages the list of blocks and the `activeBlockId` state.
* **Standard Formatting:** Scene Headings are typically ALL CAPS and use a monospace font.

**Props:**
* `id`: `string` - The unique identifier for this specific script block.
* `text`: `string` - The actual text content of the Scene Heading (e.g., "INT. APARTMENT - DAY").
* `isActive`: `boolean` - A flag indicating if this block is currently the selected/active block in the editor.
* `onSelect`: `(id: string) => void` - Callback function to be called when the user taps this block to make it active.
* `onEditText`: `(id: string, newText: string) => void` - Callback function to be called when the text content is edited and the user finishes editing (e.g., on blur).
* `onDelete`: `(id: string) => void` - Callback function to be called when the delete button for this block is clicked.

**State:**
* `isEditing`: `boolean` - Internal state to control whether the text input (`textarea`) is currently displayed instead of the static text (`Typography`). Initialize based on the `isActive` prop, but manage focus/blur internally.
* `currentText`: `string` - Internal state to hold the text being edited in the textarea before saving.

**UI Structure:**
1.  A main container `Mui Box`.
2.  Conditionally render either:
    * `Mui Typography`: Display the `text` prop when `isEditing` is `false`. Apply `text-transform: uppercase;`.
    * `Mui TextareaAutosize` (or a standard `textarea` if `TextareaAutosize` isn't simple enough): Display the `currentText` state when `isEditing` is `true`. It should auto-focus when it appears. Apply `text-transform: uppercase;` (potentially handle input conversion as well). Remove default browser styling (border, outline, resize).
3.  A `Mui IconButton` containing a `DeleteIcon` (from `@mui/icons-material/Delete`). This button should be rendered *only* when the `isActive` prop is `true`.

**Behavior & Event Handlers:**
1.  **Initialization:** When the component mounts or the `isActive` prop changes, update the internal `isEditing` state. If `isActive` becomes `true`, set `isEditing(true)` and set `currentText` to the initial `text` prop. If `isActive` becomes `false`, set `isEditing(false)`.
2.  **Click to Select/Edit:** Attach an `onClick` handler to the main `Mui Box`. If `isEditing` is *not* already true, call the `onSelect(id)` prop.
3.  **Textarea Change:** Attach an `onChange` handler to the `textarea`. Update the internal `currentText` state as the user types. Ensure the input is handled/displayed as uppercase.
4.  **Finish Editing:** Attach an `onBlur` handler to the `textarea`. This indicates the user is finished editing. Call the `onEditText(id, currentText)` prop with the current internal text. Set `isEditing(false)`.
5.  **Delete Block:** Attach an `onClick` handler to the `Mui IconButton`. Call the `onDelete(id)` prop.

**Styling:**
* Apply styles to the main `Mui Box` for `padding`, `margin`, and a subtle `backgroundColor` or `border` to visually separate blocks.
* Add a distinct `backgroundColor` or `border` style to the `Mui Box` when `isActive` is `true` to highlight the selected block.
* Apply a **monospace font** (e.g., `fontFamily: 'Courier New, monospace'`) to both the `Typography` and `textarea`.
* Ensure the `Typography` and `textarea` fill the available width within the `Mui Box` padding.
* Position the `Mui IconButton` (Delete button) in the top-right corner of the `Mui Box` when visible. The `Mui Box` should have `position: 'relative'` and the `IconButton` should have `position: 'absolute'`. Adjust positioning for touch target friendliness.
* Remove default textarea appearance (border, outline, box-shadow, resize handle).
* Ensure text within the `textarea` or `Typography` is displayed uppercase (`text-transform: uppercase;`).
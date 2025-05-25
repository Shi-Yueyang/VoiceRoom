## ActionBlock
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

## DialogueBlock
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

## ScreenHeadingBlock
## v1
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

## v2
for the screen heading block, it can only contain three elements "ext or int", "place" and "time", when inputing each element, there are choices listed for the user to choose, none the choice is satisfied, the user can input their own place or time, and the place and time will be added into to the choice list, for future screenHeading block

The block will look the same in its inactive state, but when active, it will present dedicated input fields for INT/EXT, Place, and Time, along with dynamic suggestion lists.

**Active State (The New Input Area):**
1. A layout to arrange the input elements vertically or in a clear flow on mobile.
2. INT/EXT Input: A simple Mui ToggleButtonGroup or three distinct Mui Button components labeled "INT." , "EXT." and "INT/EXT". Tapping one sets the type. Visually indicate the selected type.
3. Place Input: A Mui TextField or similar input for typing the place name.Below this input, a dynamically appearing list of suggestions (Mui List with Mui ListItemButton). This list appears when the input is focused or as the user types.The list should filter based on the user's typing but always allow typing a new value.
4. Time Input: A Mui TextField or similar input for typing the time (Day, Night, etc.). Below this input, a similar dynamically appearing list of time suggestions.
5. Delete Option: Mui IconButton with DeleteIcon in the top-right, visible only when active.

**Interaction with Suggestions:**
1. Typing in the Place or Time TextField filters the respective suggestion list shown below it.
2. Focusing a TextField makes its suggestion list appear.
3. Tapping a suggestion in the list populates the corresponding TextField with the selected value and hides the list.
4. Blurring a TextField (clicking away) hides its suggestion list (might need a small delay to allow clicking a suggestion first).
5. When the user types a value in the Place or Time TextField that doesn't match any existing suggestion, and they finish editing that field (e.g., blur the field or perhaps hit a "Done" button within the active block state), the component needs to trigger a callback (onAddSuggestion) to inform the parent component that a new suggestion should be added to the global list.
6. When the block becomes inactive (e.g., the user taps on a different block), the component should assemble the complete slugline string from the currently selected INT/EXT type, the Place input value, and the Time input value (${type}. ${place} - ${time}).

**Behavior & Event Handlers:**
1.  **Initialization:** When `isActive` becomes `true`, parse the input `text` prop to initialize `currentType`, `currentPlace`, and `currentTime` state. Set `isEditing(true)`. (Basic parsing: split by ".", then by "-", trim whitespace).
2.  **Click to Select/Edit:** Attach `onClick` to the main `Mui Box`. If not `isEditing`, call `onSelect(id)`.
3.  **INT/EXT Toggle:** Handle changes on the `ToggleButtonGroup` to update `currentType` state.
4.  **Place/Time Input Change:** Attach `onChange` to the Place/Time `TextField`s. Update `currentPlace`/`currentTime` state.
5.  **Place/Time Input Focus:** Attach `onFocus` to Place/Time `TextField`s. Set `showPlaceSuggestions`/`showTimeSuggestions` to `true`. Filter suggestions based on current input value.
6.  **Place/Time Input Blur:** Attach `onBlur` to Place/Time `TextField`s. Add a small delay before setting `showPlaceSuggestions`/`showTimeSuggestions` to `false` to allow clicking suggestions. If the blurred input value is *not* an empty string and is *not* present in the original `placeSuggestions`/`timeSuggestions` array, call `onAddSuggestion(type, value)`.
7.  **Suggestion Click:** Attach `onClick` to `ListItemButton`s in the suggestion lists. Set `currentPlace`/`currentTime` state to the clicked suggestion's value. Set `showPlaceSuggestions`/`showTimeSuggestions` to `false`.
8.  **Finish Editing Block:** When `isActive` becomes `false` (triggered by the parent `ScriptContainer` when another block is selected or user taps away), set `isEditing(false)`. Assemble the final slugline string: `${currentType}. ${currentPlace.trim()} - ${currentTime.trim()}`. Call `onUpdateBlockData(id, { text: assembledString })`.
9.  **Delete Block:** Attach `onClick` to the Delete `IconButton`. Call `onDelete(id)`.
10. Ensure `TextField`s auto-focus when `isEditing` becomes true (maybe focus the first input).

**Styling:**
* Apply styles to the main `Mui Box` for padding, margin-bottom, subtle background/border.
* Add a distinct background/border style to the `Mui Box` when `isActive` is `true`.
* Apply a **monospace font** (`fontFamily: 'Courier New, monospace'`) to `Typography` and all input elements within the active state.
* Style the `Typography` with `text-transform: uppercase;`.
* Style the structured input area (`Mui Box`/`Stack`) for a clean mobile layout (vertical stack is likely best). Add spacing between inputs.
* Style the `TextField`s to look clean (remove default borders/outlines when focused if desired).
* Style the suggestion `List` to appear directly below its `TextField`, potentially with a border or shadow, and handle scrolling if lists are long. Ensure it doesn't push surrounding content down awkwardly; consider positioning.
* Position the delete button (`IconButton`) absolutely in the top-right corner of the main `Mui Box` (set container to `position: 'relative'`, button to `position: 'absolute'`). Adjust positioning.

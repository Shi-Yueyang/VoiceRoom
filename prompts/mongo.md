## db.ts
Create a TypeScript file named `src/config/db.ts`.

**Purpose:**
This file is responsible for establishing and managing the connection to a MongoDB database using Mongoose.

**Technologies:**
* TypeScript
* Mongoose

**Functionality:**
1.  Import the `mongoose` library.
2.  Define an asynchronous function named `connectDB`.
3.  Inside `connectDB`, use `mongoose.connect()` to establish the database connection. The MongoDB URI should be retrieved from environment variables (e.g., `process.env.MONGO_URI`).
4.  Implement `try-catch` blocks to handle potential connection errors.
5.  Log a success message to the console if the connection is successful, indicating the host it connected to.
6.  Log an error message to the console if the connection fails, including the error details, and then exit the process (`process.exit(1)`).
7.  Export the `connectDB` function as the default export.

## PlayScript.ts
Create a TypeScript file named `src/models/PlayScript.ts`.

**Purpose:**
This file will define the Mongoose Schema and Model for a `Script` document, which will be stored in a MongoDB database. It needs to accurately represent the structure of a script, including its title and an ordered array of embedded `ScriptBlock` documents.

**Technology:**
* Mongoose (for MongoDB schema and modeling)
* TypeScript (for type definitions)

**Core Requirements:**

1.  **Imports:**
    * Import `mongoose` and `Schema`, `Document`, `Model` from 'mongoose'.

2.  **TypeScript Interfaces:**
    Define the following TypeScript interfaces to ensure type safety for the data structure:

    * `IHeadingBlockParam`:
        * `intExt`: `string` (e.g., "INT", "EXT")
        * `location`: `string`
        * `time`: `string` (e.g., "DAY", "NIGHT")

    * `IDescriptionBlockParam`:
        * `text`: `string`

    * `IDialogueBlockParam`:
        * `characterName`: `string`
        * `text`: `string`

    * `IScriptBlockParams`: A union type combining the above parameter interfaces:
        * `IHeadingBlockParam | IDescriptionBlockParam | IDialogueBlockParam`

    * `IScriptBlock`: Represents a single embedded script block.
        * `_id`: `Schema.Types.ObjectId` (Mongoose's default for embedded document IDs)
        * `id`: `string` (This will be the string representation of `_id` for frontend use, but keep `_id` as the primary identifier in Mongoose).
        * `type`: `'sceneHeading' | 'description' | 'dialogue'`
        * `position`: `number` (Used for ordering blocks within the script)
        * `blockParams`: `IScriptBlockParams` (This will be a `Schema.Types.Mixed` in Mongoose to allow flexible structure based on `type`).

    * `IScript`: Represents the core data structure of a script document.
        * `title`: `string`
        * `blocks`: `IScriptBlock[]`
        * `lastModified`: `Date`

    * `IScriptDocument`: Extends `IScript` with Mongoose `Document` properties.
        * `IScript & Document`

3.  **Mongoose Schema Definitions:**

    * **`scriptBlockSchema`:** Define a Mongoose Schema for the embedded `IScriptBlock`.
        * `_id`: `Schema.Types.ObjectId`, `auto: true` (Mongoose handles this by default).
        * `id`: `String`, `required: true` (This will store the string version of `_id` for consistency with frontend `id` field).
        * `type`: `String`, `required: true`, `enum: ['sceneHeading', 'description', 'dialogue']`.
        * `position`: `Number`, `required: true`, `default: 0`.
        * `blockParams`: `Schema.Types.Mixed`, `required: true`. (This allows `blockParams` to be an object with varying structures based on `type`).

    * **`scriptSchema`:** Define the main Mongoose Schema for the `IScriptDocument`.
        * `title`: `String`, `required: true`.
        * `blocks`: `[scriptBlockSchema]`, `default: []`. (An array of embedded `scriptBlockSchema` documents).
        * `lastModified`: `Date`, `default: Date.now`.

4.  **Mongoose Model Export:**
    * Export the Mongoose Model for the `Script` using `mongoose.model<IScriptDocument, Model<IScriptDocument>>('Script', scriptSchema)`.

## ScriptController.ts
**File to Create:** `src/controllers/ScriptController.ts`

**Purpose:**
This file will contain the business logic for handling REST API requests related to playScript management. It will interact directly with the MongoDB database via the Mongoose `Script` to perform CRUD (Create, Read, Delete) operations on script documents.

**Technology Stack:**
* Node.js
* Express.js (for `Request`, `Response` types)
* TypeScript
* Mongoose (for database interaction)

**Dependencies (Imports):**
* Import `Request`, `Response` from `'express'`.
* Import `Script` from `../models/Script`. (Assume `Script` is the default export or a named export from that file).
* Import `ScriptBlock` (and its related `HeadingBlockParam`, `DescriptionBlockParam`, `DialogueBlockParam`) from `../types/script`.

**Functions to Implement:**

1.  **`getAllScripts(req: Request, res: Response): Promise<void>`**
    * **Description:** Handles `GET /scripts` requests.
    * **Logic:**
        * Retrieve a list of all script documents from the database.
        * For efficiency, only return essential metadata for each script (e.g., `_id`, `title`, `lastModified`). Do *not* return the `blocks` array in this list view.
        * Sort the results by `lastModified` in descending order.
        * Send a `200 OK` response with the array of script metadata.
        * Handle potential errors with a `500 Internal Server Error` response.

2.  **`getScriptById(req: Request, res: Response): Promise<void>`**
    * **Description:** Handles `GET /scripts/:id` requests.
    * **Logic:**
        * Extract the `id` from `req.params`.
        * Find the script document by its `_id` in the database.
        * If the script is not found, send a `404 Not Found` response.
        * If found, send a `200 OK` response with the complete script document, including its `blocks` array. Ensure the `blocks` array is sorted by the `position` field in ascending order before sending.
        * Handle potential errors with a `500 Internal Server Error` response.

3.  **`createScript(req: Request, res: Response): Promise<void>`**
    * **Description:** Handles `POST /scripts` requests.
    * **Logic:**
        * Extract the `title` from `req.body`. (Assume `title` is the only required field for creation).
        * Validate that `title` is provided. If not, send a `400 Bad Request` response.
        * Create a new `Script` document. Initialize its `blocks` array as empty. Set `lastModified` to the current date.
        * Save the new script document to the database.
        * Send a `201 Created` response with the newly created script document (including its `_id`).
        * Handle potential errors (e.g., database write errors) with a `500 Internal Server Error` response.

4.  **`deleteScript(req: Request, res: Response): Promise<void>`**
    * **Description:** Handles `DELETE /scripts/:id` requests.
    * **Logic:**
        * Extract the `id` from `req.params`.
        * Find and delete the script document by its `_id` from the database.
        * If the script is not found, send a `404 Not Found` response.
        * If successfully deleted, send a `204 No Content` response (or `200 OK` with a success message if preferred, but 204 is standard for successful deletion).
        * Handle potential errors with a `500 Internal Server Error` response.

**General Implementation Guidelines:**
* Use `async/await` for all Mongoose operations.
* Wrap database operations in `try...catch` blocks to handle errors gracefully.
* For error responses, send a JSON object with an `error` property containing a descriptive message.
* Ensure all functions are exported.

## ScriptRoutes.ts
**File Name:** `src/routes/ScriptRoutes.ts`

**Purpose:**
This file defines the REST API routes for managing script resources in an Express.js backend. It uses `express.Router` to define the endpoints and maps them to corresponding controller functions from `ScriptController.ts`.

**Technology Stack:**
* Express.js
* TypeScript

**Dependencies (Imports):**
1.  Import `Router` from the `express` module.
2.  Import all necessary controller functions from `../controllers/scriptController`. Specifically, assume the following functions exist and need to be imported:
    * `getAllScripts`
    * `getScriptById`
    * `createScript`
    * `deleteScript`

**Implementation Details:**

1.  **Initialize Router:** Create an instance of `express.Router()`.
2.  **Define Routes:**
    * **GET /api/scripts**:
        * Method: `GET`
        * Path: `/` (relative to the router's base path)
        * Handler: `scriptController.getAllScripts`
    * **GET /api/scripts/:id**:
        * Method: `GET`
        * Path: `/:id`
        * Handler: `scriptController.getScriptById`
    * **POST /api/scripts**:
        * Method: `POST`
        * Path: `/`
        * Handler: `scriptController.createScript`
    * **DELETE /api/scripts/:id**:
        * Method: `DELETE`
        * Path: `/:id`
        * Handler: `scriptController.deleteScript`
3.  **Export Router:** Export the configured router instance as the default export.


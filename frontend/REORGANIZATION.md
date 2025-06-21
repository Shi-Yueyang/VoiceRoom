# Frontend Project Reorganization

This document describes the reorganization of the frontend project structure for better maintainability and scalability.

## New Project Structure

```
src/
├── assets/              # Static assets (images, icons, etc.)
├── components/          # Reusable UI components
│   └── ui/             # Generic UI components (Navigation, etc.)
├── features/           # Feature-based organization
│   ├── auth/           # Authentication related components
│   │   ├── AuthScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── index.ts
│   ├── scripts/        # Script management components
│   │   ├── ScriptListScreen.tsx
│   │   ├── ScriptContainer.tsx
│   │   ├── scriptList/ # Script list sub-components
│   │   └── index.ts
│   └── editor/         # Script editor components
│       ├── ScriptEditorScreen.tsx
│       ├── AddBlockButton.tsx
│       ├── SuggestionsList.tsx
│       ├── blocks/     # Editor block components
│       └── index.ts
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── services/           # API services and external integrations
│   ├── authService.ts
│   ├── scriptService.ts
│   └── index.ts
├── config/             # Configuration files
│   ├── api.ts         # API configuration
│   ├── theme.ts       # Material-UI theme
│   └── index.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
```

## Benefits of This Structure

### 1. Feature-Based Organization
- **auth/**: All authentication-related components in one place
- **scripts/**: Script management and listing functionality
- **editor/**: Script editing functionality and blocks

### 2. Separation of Concerns
- **components/**: Only reusable UI components
- **services/**: API calls and external service integrations
- **config/**: Configuration and setup files
- **types/**: Centralized type definitions

### 3. Better Import Structure
- Clear import paths: `import { authService } from '../services'`
- Barrel exports via index.ts files
- No circular dependencies

### 4. Scalability
- Easy to add new features in dedicated folders
- Clear boundaries between different parts of the application
- Modular architecture supports team development

## Key Changes Made

1. **Moved screen components** from `components/` to appropriate feature folders
2. **Created service layer** to abstract API calls
3. **Centralized configuration** (theme, API setup)
4. **Unified type definitions** to avoid conflicts
5. **Added barrel exports** for cleaner imports
6. **Organized by feature** rather than by file type

## Import Examples

### Before
```typescript
import ScriptListScreen from './components/ScriptListScreen';
import axios from 'axios';
```

### After
```typescript
import { ScriptListScreen } from '../features/scripts';
import { scriptService } from '../services';
```

This reorganization makes the codebase more maintainable, testable, and easier to navigate for new developers joining the project.

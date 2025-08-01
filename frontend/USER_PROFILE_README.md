# User Profile Components

This document describes the new user profile management components added to the AYA frontend application.

## Components Created

### 1. UserProfilePage (`/frontend/src/pages/UserProfilePage.tsx`)

A comprehensive user profile page that displays:

- **User Information**: Name, email, bio, profile picture, join date
- **Prayer Notes**: Paginated list of user's prayer notes
- **Interactive Features**: 
  - Edit profile button
  - Click to view prayer note details in modal
  - Navigation back to main app

**Route**: `/profile`

**Features**:
- Responsive design matching app theme
- Loading and error states
- Modal for prayer note details
- Empty state when no prayer notes exist

### 2. EditProfilePage (`/frontend/src/pages/EditProfilePage.tsx`)

A form page for updating user profile information:

- **Editable Fields**: Name, bio, profile picture URL
- **Form Features**:
  - Real-time profile picture preview
  - Form validation
  - Success/error messaging
  - Cancel functionality

**Route**: `/profile/edit`

**Features**:
- Form validation and error handling
- Loading states during submission
- Success feedback with auto-navigation
- Maintains form state during edits

## Custom Hooks

### 1. `useUserProfile` (`/frontend/src/hooks/useUserProfile.ts`)

Manages user profile data fetching:

```typescript
const { user, isLoading, error, refetch } = useUserProfile();
```

### 2. `useUpdateProfile`

Handles profile updates:

```typescript
const { updateProfile, isLoading, error } = useUpdateProfile();
await updateProfile({ name: 'New Name', bio: 'New bio' });
```

### 3. `useUserPrayerNotes`

Fetches user's prayer notes with pagination:

```typescript
const { data, isLoading, error, refetch } = useUserPrayerNotes(page, limit);
```

## API Integration

### New API Methods Added

1. **`updateUserProfile`**:
   - Endpoint: `PATCH /api/v1/users/updateMe`
   - Updates user's name, bio, profile picture

2. **`getUserProfileNotes`**:
   - Endpoint: `GET /api/v1/users/me/notes`
   - Retrieves user's prayer notes with pagination

### Required Backend Endpoints

The components expect these backend endpoints to be implemented:

```
GET  /api/auth/me              - Get current user info
PATCH /api/v1/users/updateMe   - Update user profile
GET  /api/v1/users/me/notes    - Get user's prayer notes
```

## TypeScript Interfaces

### User Profile Types

```typescript
interface UserProfile {
  _id: string;
  email: string;
  name: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt?: string;
}

interface UpdateUserRequest {
  name?: string;
  bio?: string;
  profilePicture?: string;
}
```

## Installation & Usage

### 1. Import Components

```typescript
import { UserProfilePage, EditProfilePage } from '@/pages';
```

### 2. Add Routes

```typescript
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/profile" element={<UserProfilePage />} />
  <Route path="/profile/edit" element={<EditProfilePage />} />
</Routes>
```

### 3. Navigation

```typescript
// Navigate to profile
navigate('/profile');

// Navigate to edit profile
navigate('/profile/edit');
```

## Styling & Theme

- Uses existing app design system
- Cosmic theme with starry background
- Responsive grid layouts
- Consistent with other app pages
- Glass-morphism effects with backdrop blur

## Dependencies

- React Router DOM for navigation
- Existing UI components (Button)
- Custom hooks for data management
- API service for backend communication

## Testing

The components include:
- TypeScript type safety
- Error boundary handling
- Loading state management
- Form validation
- Responsive design testing

## Future Enhancements

Potential improvements:
- File upload for profile pictures
- Profile picture cropping/editing
- Email change functionality
- Account deletion
- Privacy settings
- Social features (follow/followers)

## Error Handling

- Network error display
- Form validation errors
- Loading state indicators
- Graceful fallbacks for missing data
- User-friendly error messages

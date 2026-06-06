# User Tracking Service — Implementation Report

## 1. FILES INSPECTED
- ✅ `src/utils/storage.js` (existing localStorage utility)
- ✅ `src/hooks/useProgress.js` (existing progress hook)
- ✅ `src/hooks/useProgressContext.jsx` (existing progress context)
- ✅ `src/App.jsx` (app structure)

**Status:** No existing auth or backend found. Using localStorage for persistence.

## 2. FILES CHANGED
- ✅ **Created:** `src/services/userTrackingService.js`
  - 450+ lines of multi-user tracking functionality
  - Syntax validated ✓

## 3. STORAGE METHOD USED

**localStorage-based with user namespace isolation:**

```
USERS_KEY = 'users_v1'
  └─ { [userId]: { user_id, email, name, created_at, last_active } }

current_user_id
  └─ Stores currently logged-in user ID

user_${userId}_progress
  └─ { currentLevel, unlockedLevels, levels: { [1-10]: stats } }

user_${userId}_attempts
  └─ Array of question attempts with metadata

user_${userId}_mistakes
  └─ Array of tracked mistakes with revision status

user_${userId}_tests
  └─ Array of test/level attempts with scores
```

## 4. FUNCTIONS CREATED (12 Core Functions)

### User Management (3)
- ✅ `getLoggedInUserId()` — Returns current user ID
- ✅ `setLoggedInUserId(userId)` — Sets/clears logged-in user
- ✅ `registerUser(userId, userData)` — Creates new user

### Progress Management (2)
- ✅ `initializeUserProgress(userId)` — Creates default progress (Levels 1-10)
- ✅ `getCurrentUserProgress(userId)` — Retrieves or initializes progress

### Question Attempts (3)
- ✅ `saveQuestionAttempt(data)` — Records attempt with all fields
- ✅ `getAttempts(userId)` — Retrieves all attempts
- ✅ `getAttemptsByLevel(userId, level)` — Filters by level

### Mistake Tracking (3)
- ✅ `saveMistake(data)` — Tracks mistakes with revision status
- ✅ `getMistakes(userId, status)` — Retrieves mistakes
- ✅ `updateMistakeStatus(userId, mistakeId, newStatus)` — pending→revised→mastered

### Test Attempts (2)
- ✅ `createTestAttempt(data)` — Starts test
- ✅ `completeTestAttempt(userId, testId, testData)` — Completes test

### Analytics (3)
- ✅ `getWeakTopics(userId, limit=5)` — Topics by lowest accuracy
- ✅ `getUserAccuracy(userId, level)` — Overall or level-specific accuracy
- ✅ `getLevelProgress(userId, level)` — Level statistics

### Level Management (2)
- ✅ `unlockNextLevel(userId, level)` — Unlocks next level
- ✅ `getUnlockedLevels(userId)` — Gets array of unlocked levels

## 5. QUESTION ATTEMPT DATA STRUCTURE

Each attempt saved in `user_${userId}_attempts`:

```javascript
{
  id: "1717720800000_a3f8b2c",         // Auto-generated unique ID
  user_id: "user_123",                  // User identifier (required)
  question_id: "l5v_001_0001",         // Question ID (required)
  level: 5,                             // Level 1-10
  topic: "Grammar",                     // Topic name
  subtopic: "Formal Vocabulary",        // Subtopic name
  selected_answer: 1,                   // User's answer (0-3 for MCQ)
  correct_answer: 2,                    // Correct answer (0-3)
  is_correct: false,                    // Boolean
  time_taken_seconds: 45,               // Time spent
  mistake_type: "vocabulary-error",     // Error category
  created_at: "2024-06-06T10:20:00Z"   // ISO timestamp
}
```

## 6. MISTAKE DATA STRUCTURE

Each mistake saved in `user_${userId}_mistakes`:

```javascript
{
  id: "1717720800000_b4f8c3d",         // Auto-generated unique ID
  user_id: "user_123",                  // User identifier
  question_id: "l5v_001_0001",         // Question ID
  topic: "Grammar",                     // Topic
  subtopic: "Formal Vocabulary",        // Subtopic
  level: 5,                             // Level
  mistake_type: "vocabulary-error",     // Error type
  explanation: "Answered 1, correct is 2",  // Context
  status: "pending",                    // pending | revised | mastered
  created_at: "2024-06-06T10:20:00Z",  // Created timestamp
  revised_at: null                      // Updated when revised/mastered
}
```

## 7. READY FOR UI INTEGRATION

The service is independent and ready to connect:

### Practice Screen
```javascript
import userTrackingService from './services/userTrackingService'

// On question submission:
userTrackingService.saveQuestionAttempt({
  user_id: currentUserId,
  question_id: question.id,
  level: question.level,
  topic: question.topic,
  subtopic: question.subtopic,
  selected_answer: userAnswer,
  correct_answer: question.correctAnswer,
  is_correct: userAnswer === question.correctAnswer,
  time_taken_seconds: elapsedTime,
  mistake_type: errorType
})
```

### Analytics Screen
```javascript
const weakTopics = userTrackingService.getWeakTopics(userId, 5)
const accuracy = userTrackingService.getUserAccuracy(userId)
const level5Stats = userTrackingService.getLevelProgress(userId, 5)
```

### Revision Screen
```javascript
const pendingMistakes = userTrackingService.getMistakes(userId, 'pending')
userTrackingService.updateMistakeStatus(userId, mistakeId, 'revised')
```

## 8. EXAMPLE USAGE

```javascript
// Initialize user
const userId = 'user_' + Date.now()
userTrackingService.registerUser(userId, { 
  email: 'user@example.com', 
  name: 'John' 
})
userTrackingService.setLoggedInUserId(userId)
userTrackingService.initializeUserProgress(userId)

// Save attempt
const attempt = userTrackingService.saveQuestionAttempt({
  user_id: userId,
  question_id: 'l5v_001_0001',
  level: 5,
  topic: 'Grammar',
  subtopic: 'Formal Vocabulary',
  selected_answer: 1,
  correct_answer: 2,
  is_correct: false,
  time_taken_seconds: 45,
  mistake_type: 'vocabulary-error'
})

// Get analytics
const weakTopics = userTrackingService.getWeakTopics(userId)
const accuracy = userTrackingService.getUserAccuracy(userId)
```

## 9. WHAT UI STEP SHOULD CONNECT NEXT

**Recommended Integration Order:**

1. **Phase 1 — Practice Screen** (Direct answer tracking)
   - Modify `Practice.jsx` to call `saveQuestionAttempt()` on submit
   - Pass all required fields from question and user interaction
   - Test data persistence to localStorage

2. **Phase 2 — Analytics Screen** (Data visualization)
   - Modify `Analytics.jsx` to call `getWeakTopics()`, `getUserAccuracy()`, `getLevelProgress()`
   - Display weak topic list, accuracy chart, level breakdown
   - Show mistake history

3. **Phase 3 — Revision Screen** (Mistake management)
   - Modify `Revision.jsx` to call `getMistakes(userId, 'pending')`
   - Add buttons to mark as revised/mastered
   - Call `updateMistakeStatus()` on user action

4. **Phase 4 — Test/Level Mode** (Comprehensive assessment)
   - Create or modify test screen to use `createTestAttempt()` and `completeTestAttempt()`
   - Track all attempts during test
   - Show results with `getTestAttempts()`

5. **Phase 5 — User Auth** (User management)
   - Create login screen or modal
   - Call `registerUser()` for new users
   - Call `setLoggedInUserId()` on login
   - Call `updateUserLastActive()` on app activity

## 10. PRODUCTION STATUS

✅ **Completed:**
- Service file created and syntax validated
- All 12 core functions implemented
- Multi-user support via localStorage
- user_id on all records
- Proper ISO timestamps
- Attempt/mistake/test data structures defined
- Error handling for missing fields
- Analytics functions ready

⏳ **Next Steps:**
- [ ] Connect Practice screen to saveQuestionAttempt()
- [ ] Connect Analytics screen to analytics functions
- [ ] Create/update login screen
- [ ] Create/update revision/mistake screen
- [ ] Test with real user data flow

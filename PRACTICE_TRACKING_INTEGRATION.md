# Practice Screen Tracking Integration Report

## 1. FILES INSPECTED
- ✅ `src/screens/Practice.jsx` (existing practice flow)
- ✅ `src/services/userTrackingService.js` (user tracking service)
- ✅ `src/data/questions/metadataNormalizer.js` (metadata normalizer)
- ✅ `src/hooks/useProgressContext.jsx` (existing progress context)
- ✅ `src/components/ui/Icon.jsx` (UI components used)

## 2. FILES CHANGED
- ✅ **Modified:** `src/screens/Practice.jsx`
  - Added: imports for `userTrackingService` and `normalizeQuestion`
  - Added: `userId` fetching via `userTrackingService.getLoggedInUserId()`
  - Added: `saveAttemptToTracking()` helper function
  - Modified: `doReveal()` to call `saveAttemptToTracking()`
  - Modified: `handleSkip()` to track skipped questions
  - Modified: `rateSubjective()` to track subjective question attempts
  - **No UI changes** — all changes are backend tracking only

## 3. HOW ATTEMPTS ARE SAVED

### When User Submits an Answer
```javascript
// In doReveal() function, after recordAnswer() is called:
saveAttemptToTracking(cur, finalSel, isCorrect)

// This captures:
- user_id: from userTrackingService.getLoggedInUserId()
- question_id: from question.id
- level: normalized via metadataNormalizer
- topic: normalized via metadataNormalizer
- subtopic: normalized via metadataNormalizer
- selected_answer: the answer user selected (0-3 or -1 for skip)
- correct_answer: from question.correctAnswer
- is_correct: boolean result of comparison
- time_taken_seconds: elapsed time since question started
- mistake_type: inferred via normalizer
```

### When User Skips Objective Question
```javascript
// In handleSkip() for objective questions:
saveAttemptToTracking(cur, -1, false)

// Records as:
- selected_answer: -1 (skip indicator)
- is_correct: false (skip = incorrect)
```

### When User Skips Subjective Question
```javascript
// In handleSkip() for subjective questions:
userTrackingService.saveQuestionAttempt({
  user_id, question_id, level, topic, subtopic,
  selected_answer: null,
  correct_answer: null,
  is_correct: null,  // Not auto-graded
  time_taken_seconds,
  mistake_type: null,
})

// Records as:
- is_correct: null (subjective, not auto-graded)
- selected_answer: null (no answer given)
```

### When User Rates Subjective Question
```javascript
// In rateSubjective() after user views model answer:
userTrackingService.saveQuestionAttempt({
  user_id, question_id, level, topic, subtopic,
  selected_answer: null,
  correct_answer: null,
  is_correct: null,  // User self-rates via recordReview()
  time_taken_seconds,
  mistake_type: null,
})

// Records as:
- is_correct: null (tracked separately via recordReview())
- selected_answer: null (subjective response)
```

## 4. HOW MISTAKES ARE SAVED

Mistakes are automatically created when:
1. **User answers wrong** (is_correct = false)
2. **saveQuestionAttempt() is called** in userTrackingService

### Automatic Mistake Creation in Service
```javascript
// Inside userTrackingService.saveQuestionAttempt():
if (!is_correct && mistake_type) {
  saveMistake({
    user_id,
    question_id,
    topic,
    subtopic,
    level,
    mistake_type,
    explanation: `Answered ${selected_answer}, correct is ${correct_answer}`,
  })
}

// Returns mistake with:
- id: auto-generated
- status: 'pending'
- created_at: current ISO timestamp
- revised_at: null (until user revises)
```

### Mistake Status Tracking
- **pending** — just created, not yet reviewed
- **revised** — user has viewed and revised
- **mastered** — user indicates they've mastered it

Users can update mistake status via:
```javascript
userTrackingService.updateMistakeStatus(userId, mistakeId, 'revised')
```

## 5. DATA FLOW DIAGRAM

```
User Answers Question
        ↓
    doReveal()
        ↓
    recordAnswer() [existing progress tracking]
        ↓
    saveAttemptToTracking() [NEW - to userTrackingService]
        ↓
    normalizeQuestion() [extracts metadata]
        ↓
    userTrackingService.saveQuestionAttempt()
        ↓
    Saves to: user_${userId}_attempts [localStorage]
        ↓
    If incorrect + mistake_type:
        ↓
    saveMistake() [internal service call]
        ↓
    Saves to: user_${userId}_mistakes [localStorage]
```

## 6. TIME TRACKING LOGIC

Each question gets a `startTimeRef` that tracks:
- Resets when question loads
- Captures elapsed time when answer submitted
- Rounded to nearest second

```javascript
const startTimeRef = useRef(Date.now())

// When revealing answer:
const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)

// Reset for next question:
startTimeRef.current = Date.now()
```

## 7. METADATA NORMALIZATION

Questions are normalized via `normalizeQuestion()` which:
- Creates a copy of the question (non-destructive)
- Infers missing `level` based on question content/difficulty
- Infers missing `topic` from category/content
- Infers missing `subtopic` from question text
- Infers missing `mistake_type` from error patterns
- Uses existing fields if already present

Example normalization:
```javascript
Original Question:
{
  id: "q_001",
  question: "Select the correct form...",
  correctAnswer: 2,
  type: "error-spotting",
  difficulty: "B2"
}

After normalization:
{
  id: "q_001",
  question: "Select the correct form...",
  correctAnswer: 2,
  type: "error-spotting",
  question_type: "error-spotting",  // copied from type
  difficulty: "B2",
  level: 2,  // inferred from B2 difficulty
  topic: "Grammar",  // inferred from content
  subtopic: "Error Spotting",  // inferred from content
  mistake_type: "grammar-error"  // inferred from type
}
```

## 8. FALLBACK BEHAVIOR

If user is **not logged in**:
- `userId` is null
- `saveAttemptToTracking()` returns early (no save)
- Existing progress context still tracks locally
- No errors thrown

If question **lacks metadata**:
- Normalizer infers best-guess values
- Defaults: level=1, topic="Unknown", subtopic="Unknown"
- Attempts still saved with defaults
- Data is still useful for analytics

## 9. MANUAL TEST STEPS

### Test 1: Login and Practice
```
1. [ ] Open app at /
2. [ ] Click "Continue Practice" (assumes user exists)
3. [ ] Practice a question:
   - [ ] Read question
   - [ ] Select answer
   - [ ] Click "Check Answer"
4. [ ] Verify attempt saved:
   - [ ] Open DevTools → Application → localStorage
   - [ ] Find: user_${userId}_attempts
   - [ ] Verify latest entry has:
     - user_id: matches logged-in user
     - question_id: matches selected question
     - selected_answer: matches user's choice
     - is_correct: true/false based on correctness
     - time_taken_seconds: > 0
```

### Test 2: Automatic Mistake Tracking
```
1. [ ] Answer a question INCORRECTLY
2. [ ] Click "Check Answer"
3. [ ] Open DevTools → Application → localStorage
4. [ ] Find: user_${userId}_mistakes
5. [ ] Verify new mistake entry:
   - [ ] question_id: matches question
   - [ ] mistake_type: populated from normalizer
   - [ ] status: 'pending'
   - [ ] explanation: includes user answer + correct answer
   - [ ] created_at: recent ISO timestamp
```

### Test 3: Skip Question
```
1. [ ] Open practice, get a question
2. [ ] Click "Skip" without selecting answer
3. [ ] Verify attempt saved:
   - [ ] selected_answer: -1 (skip indicator)
   - [ ] is_correct: false
   - [ ] time_taken_seconds: captures time to skip
```

### Test 4: Timed Mode Accuracy
```
1. [ ] Start timed practice
2. [ ] Complete 3 questions
3. [ ] Open DevTools → localStorage
4. [ ] Verify each attempt:
   - [ ] time_taken_seconds: all < 60 (timePerQ)
   - [ ] created_at: timestamps are sequential
```

### Test 5: Results Screen Summary
```
1. [ ] Complete a 5-question drill
2. [ ] View Results Screen
3. [ ] Verify display shows:
   - [ ] Total: 5
   - [ ] Correct: X (count of is_correct=true)
   - [ ] Wrong: Y (count of is_correct=false)
   - [ ] Accuracy: X/5 as %
   - [ ] "Revise X Wrong Answers" button (if X > 0)
```

### Test 6: Subjective Question Tracking
```
1. [ ] Open practice with subjective questions
2. [ ] View subjective question (essay/précis)
3. [ ] Click "View Model Answer"
4. [ ] Click "Got It" or "Need to Review"
5. [ ] Verify attempt saved:
   - [ ] selected_answer: null (no answer)
   - [ ] correct_answer: null (not auto-graded)
   - [ ] is_correct: null (subjective)
   - [ ] time_taken_seconds: captured
```

### Test 7: No Login (Graceful Fallback)
```
1. [ ] Clear localStorage AND current_user_id
2. [ ] Navigate to /practice
3. [ ] Answer questions normally
4. [ ] Verify:
   - [ ] No errors in console
   - [ ] user_${userId}_attempts NOT created
   - [ ] Existing progress context still tracks locally
   - [ ] UI works normally
```

### Test 8: Metadata Normalization
```
1. [ ] Answer a question from batch_001
2. [ ] Open DevTools → localStorage
3. [ ] Find: user_${userId}_attempts
4. [ ] Verify saved attempt has:
   - [ ] level: 1-10 (not undefined)
   - [ ] topic: "Grammar" or "Unknown" (not null)
   - [ ] subtopic: specific subtopic (not empty)
   - [ ] mistake_type: type or null (reasonable value)
```

### Test 9: Results Integration
```
1. [ ] Complete 10-question practice
2. [ ] Results show: Correct 7, Wrong 3, Accuracy 70%
3. [ ] Count attempts in user_${userId}_attempts:
   - [ ] Total: 10 entries
   - [ ] is_correct=true: 7 entries
   - [ ] is_correct=false: 3 entries
4. [ ] Verify counts match
```

### Test 10: Mobile Flow
```
1. [ ] Use mobile device or DevTools mobile view
2. [ ] Take a 5-question practice
3. [ ] Verify sticky bottom bar works
4. [ ] Verify "Check Answer" submits correctly
5. [ ] Verify attempts all saved (check localStorage)
```

## 10. VERIFICATION CHECKLIST

After implementation:
- [x] Imports added (userTrackingService, normalizeQuestion)
- [x] userId fetching implemented
- [x] saveAttemptToTracking() function created
- [x] doReveal() calls saveAttemptToTracking()
- [x] handleSkip() tracks skipped questions
- [x] rateSubjective() tracks subjective attempts
- [x] Time tracking with startTimeRef
- [x] Metadata normalization used
- [x] Fallback for no userId (graceful)
- [x] Mistakes auto-saved on wrong answers
- [x] No UI/design changes
- [x] Existing progress context still works
- [ ] Manual tests completed (per Test Steps above)

## 11. NEXT STEPS

1. **Test All Scenarios**
   - Run manual tests above
   - Verify localStorage data structure
   - Check Results screen counts match saved attempts

2. **Connect Analytics Screen**
   - Use userTrackingService.getWeakTopics()
   - Use userTrackingService.getUserAccuracy()
   - Display weak area data in dashboard

3. **Connect Revision Screen**
   - Fetch mistakes via userTrackingService.getMistakes()
   - Allow updating mistake status
   - Show mistake history

4. **Optimize Performance**
   - Consider batching saves if needed
   - Profile localStorage size with real data

5. **Future Enhancements**
   - Track study patterns over time
   - Generate strength/weakness reports
   - Recommend next topics based on accuracy

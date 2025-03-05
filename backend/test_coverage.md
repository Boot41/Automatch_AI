# API Test Coverage Report

## Overall Coverage Summary
- Statement Coverage: 79.43%
- Branch Coverage: 47.27%
- Function Coverage: 84.61%
- Line Coverage: 78.47%

## Endpoint Coverage Details

### Authentication Endpoints
- **Controller Coverage**: 91.42%
- **Routes**: `/api/v1/auth/signup`, `/api/v1/auth/signin`, `/api/v1/auth/me`
- **Test Cases**:
  - Successful user signup
  - Successful user signin
  - Fetch user details
  - Invalid credentials handling
  - Missing fields validation

### AI/Chatbot Endpoints
- **Controller Coverage**: 85.18%
- **Routes**: `/api/v1/ai/start`, `/api/v1/ai/reply`
- **Test Cases**:
  - Start new chat session
  - Handle user replies
  - Dealer search integration
- **Uncovered Lines**: 13, 33-34, 44, 80-84, 113

### Dealer Endpoints
- **Controller Coverage**: 57.14%
- **Route**: `/api/v1/dealer/find`
- **Test Cases**:
  - Find nearby dealers with valid coordinates
  - Handle missing coordinates
  - Authentication validation
  - Geocoding service error handling
  - Dealer search service error handling
- **Uncovered Lines**: 11-18

### Session Endpoints
- **Controller Coverage**: 77.77%
- **Routes**: `/api/v1/user/sessions`, `/api/v1/user/messages/:sessionId`
- **Test Cases**:
  - Retrieve user sessions
  - Fetch session messages
  - Authentication checks
- **Uncovered Lines**: 10, 20-21, 32, 53-54

## Service Coverage

### External Services
- **Geocoding Service**: 17.64% coverage
  - Needs more test cases for error handling
  - Uncovered Lines: 4-25

- **Gemini Service**: 81.25% coverage
  - Good coverage for main functionality
  - Uncovered Lines: 13, 35-36

## Middleware Coverage
- **Auth Middleware**: 95.23%
  - Excellent coverage
  - Only Line 32 uncovered

## Areas Needing Improvement
1. Dealer Controller (57.14% coverage)
   - Need more test cases for error scenarios
   - Better coverage for location handling

2. Geocoding Service (17.64% coverage)
   - Add tests for different location formats
   - Better error handling coverage

3. Session Controller (77.77% coverage)
   - Add tests for edge cases
   - Improve message retrieval coverage

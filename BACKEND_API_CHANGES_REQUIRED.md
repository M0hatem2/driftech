# Backend API Changes Required

## Issue
The current login API in the backend expects a `phone` field as a number, but the frontend system uses email-based authentication throughout (OTP verification, profile completion, etc.).

## Required Backend Changes

### 1. Update AuthController.php
In `app/Http/Controllers/Draftech/AuthController.php`, line around 183 in the `login` method:

**Current Code (causing error):**
```php
public function login(Request $request)
{
    $request->validate([
        'phone' => 'required|numeric',
        'password' => 'required',
    ]);
    
    // Login logic here...
}
```

**Required Changes:**
```php
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);
    
    // Update login logic to use email instead of phone
    $credentials = $request->only('email', 'password');
    
    // Use email for authentication instead of phone
    if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
        // Success logic...
    }
}
```

### 2. Update User Model
Ensure the User model and database can handle email-based authentication:

```php
// In User model
public function findForPassport($identifier) {
    return User::where('email', $identifier)->first();
}
```

### 3. Update Database Migration (if needed)
If users are stored with phone numbers instead of emails, you may need to:
- Add email field migration
- Update existing users to have email addresses
- Make email unique in database

### 4. Test the Changes
- Test login with email/password
- Ensure OTP verification still works
- Test profile completion flow
- Verify token generation and authentication

## Frontend Compatibility
The frontend is already updated to use email-based authentication and will work seamlessly once the backend is updated.

## Timeline
These changes should take approximately 2-4 hours to implement and test.
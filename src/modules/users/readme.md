> Business Rules = BR
> Functional Requirements = FR
> Non Functional Requirements = NFR

# User registration

**FR**
- It should be possible to register a new user.

**BR**
- It should NOT be possible to register a new user with an email already in use.

********************************************************************************

# User authenticate

**FR**
- User should be able to authenticate in to application.

**BR**
- User must have a registration to authenticate to the application.

********************************************************************************

# Show user profile

**FR**
- User should be able to get your personnal data.

**BR**
- User must be authenticated in to the application.

********************************************************************************

# User profile update

**FR**
- User should be possible to update his profile.

**BR**
- It should NOT be able to change the email with an email already in use.
- User must be authenticated in to the application.

********************************************************************************

# User avatar update

**FR**
- User should be able to add an avatar to his profile.

**NRF**
- Multer should be used to upload the avatar file.

**BR**
- User should be able to upload only one file per time to be your avatar.
- User should be able to upload only .png, .jpg and jpeg image files.
- User must be authenticated in to the application.

********************************************************************************

# Refresh accesss token

**FR**
- Should be possible to the refresh access token through the refresh token.

**BR**
- The refresh token generated should expire in 30 days.
- The access token generated should expire in 15 minutes.
- It should not be possible to refresh access token with an invalid refresh token.

********************************************************************************

# User reset password

**FR**
- Should be possible to the user reset the password through the registered email.
- User must receive an email with the steps to reset the password.
- User should be able to enter a new password.

**BR**
- Use should enter a new password.
- The reset email link should expire in 3 hours.

********************************************************************************

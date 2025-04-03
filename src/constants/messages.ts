export const USERS_MESSAGE = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be string',
  NAME_LENGTH_MUST_BE_BETWEEN_1_AND_100: 'Name length must be between 1 and 100',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_ALREADY_EXIST: 'Email already exist',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be string',
  PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_50: 'Password length must be between 6 and 50',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 6 - 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm password must be string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_50: 'Confirm password length must be between 6 and 50',
  CONFIRM_PASSWORD_MUST_BE_SAME_WITH_PASSWORD: 'Confirm password must be same with password',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be 6 - 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth is required',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be date',
  LOGIN_SUCCESSFULLY: 'Login successfully',
  LOGOUT_SUCCESSFULLY: 'Logout successfully',
  REGISTER_SUCCESSFULLY: 'Register successfully',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token successfully',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  USER_NOT_FOUND: 'User not found',
  EMAIL_VERIFY_SUCCESSFULLY: 'Email verify successfully',
  RESEND_VERIFY_EMAIL_SUCCESSFULLY: 'Resend verify email successfully',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESSFULLY: 'Verify forgot password successfully',
  FORGOT_PASSWORD_TOKEN_IS_INVALID: 'Forgot password token is invalid',
  PASSWORD_RESET_SUCCESSFULLY: 'Password reset successfully',
  GET_MY_PROFILE_SUCCESSFULLY: 'Get my profile successfully',
  GET_MY_PROFILE_FAILURE: 'Get my profile failure',
  USER_NOT_VERIFIED: 'User not verified',
  BIO_MUST_BE_STRING: 'Bio must be string',
  BIO_LENTH_MUST_BETWEEN_1_200: 'Bio length must be between 1 and 200',
  LOCATION_MUST_BE_STRING: 'Location must be string',
  LOCATION_LENTH_MUST_BETWEEN_1_200: 'Location length must be between 1 and 200',
  WEBSITE_MUST_BE_STRING: 'Website must be string',
  WEBSITE_LENTH_MUST_BETWEEN_1_200: 'Website length must be between 1 and 200',
  USERNAME_MUST_BE_STRING: 'Username must be string',
  AVATAR_MUST_BE_STRING: 'Avatar must be string',
  USERNAME_LENTH_MUST_BETWEEN_1_400: 'Username length must be between 1 and 400',
  AVATAR_LENGHT_MUST_BETWEEN_1_400: 'Avatar length must be between 1 and 400',
  COVER_PHOTO_MUST_BE_STRING: 'Cover photo must be string',
  COVER_PHOTO_LENGHT_MUST_BETWEEN_1_400: 'Cover photo length must be between 1 and 400',
  UPDATE_MY_PROFILE_SUCCESSFULLY: 'Update my profile successfully',
  GET_PROFILE_SUCCESSFULLY: 'Get profile successfully',
  FOLLOW_SUCCESSFULLY: 'Follow successfully',
  INVALID_USER_ID: 'Invalid follow user id',
  ALREADY_FOLLOWED: 'Already followed',
  ALREADY_UNFOLLOWED: 'Already unfollowed',
  UNFOLLOW_SUCCESSFULLY: 'Unfollow successfully',
  USERNAME_IS_INVALID: 'Username must be 4-15 characters and contain only letters, numbers and _',
  USERNAME_ALREADY_EXIST: 'Username already exist',
  OLD_PASSWORD_IS_INCORRECT: 'Old password is incorrect',
  PASSWORD_CHANGE_SUCCESSFULLY: 'Password change successfully',
  GMAIL_NOT_VERIFIED: 'Gmail not verified',
  USER_ID_IS_REQUIRED: 'User id is required',
  INVALID_IMAGE_FORMAT: 'Invalid image format',
  USER_IS_FOLLOWER: 'User is follower',
  GET_FOLLOWERS_SUCCESSFULLY: 'Get followers successfully',
  FOLLOWER_NOT_FOUND: 'Follower not found',
  REMOVE_FOLLOWER_SUCCESSFULLY: 'Remove follower successfully',
  USER_IS_NOT_FOLLOWER: 'User is not follower',
  SEARCH_SUCCESSFULLY: 'Search successfully',
  GET_MUTUAL_FOLLOWERS_SUCCESSFULLY: 'Get mutual followers successfully'
} as const

export const POSTS_MESSAGE = {
  GET_POSTS_SUCCESSFULLY: 'Get posts successfully',
  GET_POSTS_FAILURE: 'Get posts failure',
  GET_POST_SUCCESSFULLY: 'Get post successfully',
  GET_POST_FAILURE: 'Get post failure',
  CREATE_POST_SUCCESSFULLY: 'Create post successfully',
  CREATE_POST_FAILURE: 'Create post failure',
  UPDATE_POST_SUCCESSFULLY: 'Update post successfully',
  UPDATE_POST_FAILURE: 'Update post failure',
  DELETE_POST_SUCCESSFULLY: 'Delete post successfully',
  DELETE_POST_FAILURE: 'Delete post failure',
  VIDEOS_LIMIT: 'Maximum of 1 video allowed per post',
  IMAGES_LIMIT: 'Maximum of 5 images allowed per post',
  CONTENT_IS_REQUIRED: 'Content is required',
  VIDEO_OR_IMAGE: 'Maximum of 1 video or 5 images allowed per post',
  ERROR_CREATING_POST: 'Error creating post',
  POST_NOT_FOUND: 'Post not found'
} as const

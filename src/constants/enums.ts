import { FileType } from '~/utils/file'

export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export interface Media {
  url: string
  type: MediaType // video, image
}

export enum MediaType {
  Image,
  Video
}

export enum PostAudience {
  EveryOne,
  TwitterCircle
}

export enum PostType {
  NewPost,
  RePost,
  QuotePost,
  Comment
}

export interface MediaConversationType {
  url: string
  type: FileType
  name?: string
}

export enum ConversationStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  RECALLED = 'recalled',
  DELETED = 'deleted'
}

export enum CALL_STATUS {
  MISSED = 'missed',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum CALL_TYPE {
  VOICE = 'voice',
  VIDEO = 'video'
}

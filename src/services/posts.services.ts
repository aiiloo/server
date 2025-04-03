import { ObjectId } from 'mongodb'
import { MediaType, PostAudience, PostType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { POSTS_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { NewPost } from '~/models/requests/Post.requests'
import Post, { Media, PostAType } from '~/models/schemas/Post.schema'
import databaseService from './database.services'
import fs from 'fs'
import usersServices from './users.services'

export class PostService {
  /**
   * Creates a new post with media validation
   * Maximum 1 video and 5 images allowed
   */
  async createPost(user_id: string, postData: NewPost): Promise<Post> {
    // Validate media limits
    this.validateMediaLimits(postData.medias)

    // Create the post object
    try {
      const postToCreate: PostAType = {
        user_id: new ObjectId(user_id),
        type: PostType.NewPost,
        audience: Number(postData.audience),
        content: postData.content,
        parent_id: null,
        medias: postData.medias,
        // guest_views: 0,
        user_views: 0,
        created_at: new Date(),
        updated_at: new Date()
      }

      await databaseService.posts.insertOne(postToCreate)

      return new Post(postToCreate)
    } catch (error) {
      console.log(error)
      for (let i = 0; i < postData.medias.length; i++) {
        usersServices.deleteFile(postData.medias[i].url)
      }
      throw new ErrorWithStatus({
        message: POSTS_MESSAGE.ERROR_CREATING_POST,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }

  /**
   * Validates media limits:
   * - Maximum 1 video
   * - Maximum 5 images
   * - Total media count should not exceed 5
   */
  private validateMediaLimits(medias: Media[]): void {
    if (!medias || medias.length === 0) {
      return // No media to validate
    }

    // Count videos and images
    const videoCount = medias.filter((media) => media.type === MediaType.Video).length
    const imageCount = medias.filter((media) => media.type === MediaType.Image).length

    if (videoCount && imageCount) {
      for (let i = 0; i < medias.length; i++) {
        usersServices.deleteFile(medias[i].url)
      }
      throw new ErrorWithStatus({
        message: POSTS_MESSAGE.VIDEO_OR_IMAGE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // Check if limits are exceeded
    if (videoCount > 1) {
      for (let i = 0; i < medias.length; i++) {
        usersServices.deleteFile(medias[i].url)
      }
      throw new ErrorWithStatus({
        message: POSTS_MESSAGE.VIDEOS_LIMIT,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (imageCount > 5) {
      for (let i = 0; i < medias.length; i++) {
        usersServices.deleteFile(medias[i].url)
      }
      throw new ErrorWithStatus({
        message: POSTS_MESSAGE.IMAGES_LIMIT,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // Additional check to ensure total media count doesn't exceed 5
    // This is to handle the case where there's 1 video and 5 images
    // if (medias.length > 5) {
    //   throw new Error('Maximum of 5 media items allowed per post')
    // }
  }
  /**
   * Gets a post by its ID
   */
  async getPostById(postId: string): Promise<Post | null> {
    // Here you would typically fetch from the database
    // const db = await getDb();
    // const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
    // if (!post) return null;
    // return new Post(post as PostAType);

    return null // Placeholder
  }

  /**
   * Deletes a post by its ID
   * Only the post owner can delete their post
   */
  async deletePost(postId: string, userId: string): Promise<boolean> {
    // Fetch the post first to check ownership
    const post = await this.getPostById(postId)

    if (!post) {
      throw new Error('Post not found')
    }

    if (post.user_id.toString() !== userId) {
      throw new Error('Unauthorized to delete this post')
    }

    // Delete from database
    // const db = await getDb();
    // const result = await db.collection('posts').deleteOne({ _id: new ObjectId(postId) });
    // return result.deletedCount > 0;

    return true // Placeholder
  }
}

const postService = new PostService()

export default postService

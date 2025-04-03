import { Request, Response } from 'express'
import { PostType, PostAudience } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import postService from '~/services/posts.services'
import { Media } from '~/models/schemas/Post.schema'
import { ParamsDictionary } from 'express-serve-static-core'
import { NewPost, ReqPost } from '~/models/requests/Post.requests'
import { POSTS_MESSAGE } from '~/constants/messages'
import fs from 'fs'

/**
 * Create a new post
 * POST /posts
 */
export const createPost = async (req: Request<ParamsDictionary, any, ReqPost>, res: Response) => {
  const { user_id } = req.decoded_authorization.user_id
  const { audience = PostAudience.EveryOne, content } = req.body
  const files = req.files as Express.Multer.File[] | any

  // Validate required fields
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: POSTS_MESSAGE.CONTENT_IS_REQUIRED })
  }

  const medias: Media[] = files
    ? (files as any).medias.map((file: any) => ({
        url: `${file.filename}`,
        type: file.mimetype.includes('image') ? 0 : 1
      }))
    : []
  const postData: NewPost = {
    type: PostType.NewPost,
    audience,
    content,
    parent_id: null,
    medias: medias as Media[],
    user_views: 0
  }

  const post = await postService.createPost(user_id, postData)
  return res.status(201).json({
    message: POSTS_MESSAGE.CREATE_POST_SUCCESSFULLY,
    data: post
  })
}

/**
 * Get post by ID
 * GET /posts/:id
 */
//   async getPost(req: Request, res: Response) {
//     try {
//       const { id } = req.params

//       if (!ObjectId.isValid(id)) {
//         return res.status(400).json({ message: 'ID bài đăng không hợp lệ' })
//       }

//       const post = await this.postService.getPostById(id)

//       if (!post) {
//         return res.status(404).json({ message: 'Không tìm thấy bài đăng' })
//       }

//       return res.status(200).json({
//         message: 'Lấy bài đăng thành công',
//         data: post
//       })
//     } catch (error: any) {
//       console.error('Get post error:', error)
//       return res.status(500).json({
//         message: 'Có lỗi xảy ra khi lấy thông tin bài đăng'
//       })
//     }
//   }

//   /**
//    * Delete post by ID
//    * DELETE /posts/:id
//    */
//   async deletePost(req: Request, res: Response) {
//     try {
//       const { id } = req.params
//       const { user_id } = req.user // Assuming authentication middleware adds user to req

//       if (!ObjectId.isValid(id)) {
//         return res.status(400).json({ message: 'ID bài đăng không hợp lệ' })
//       }

//       const result = await this.postService.deletePost(id, user_id)

//       return res.status(200).json({
//         message: 'Xóa bài đăng thành công',
//         data: { deleted: result }
//       })
//     } catch (error: any) {
//       console.error('Delete post error:', error)

//       if (error.message === 'Post not found') {
//         return res.status(404).json({ message: 'Không tìm thấy bài đăng' })
//       }

//       if (error.message === 'Unauthorized to delete this post') {
//         return res.status(403).json({ message: 'Bạn không có quyền xóa bài đăng này' })
//       }

//       return res.status(500).json({
//         message: 'Có lỗi xảy ra khi xóa bài đăng'
//       })
//     }
//   }

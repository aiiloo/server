import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { uploads } from '~/middlewares/uploadFileOrVideo.middleware'
import { createPost, getPostController } from '~/controllers/posts.controllers'

// Khởi tạo router cho posts
const postsRouter = Router()

// Route để tạo bài đăng mới
postsRouter.post(
  '/new-post',
  accessTokenValidator,
  uploads.fields([{ name: 'medias', maxCount: 5 }]),
  wrapRequestHandler(createPost)
)
postsRouter.get('/all-post', accessTokenValidator, wrapRequestHandler(getPostController))

// Route để lấy bài đăng theo ID
// postsRouter.get('/:id', wrapRequestHandler(postController.getPost.bind(postController)))

// // Route để xóa bài đăng
// postsRouter.delete('/:id', accessTokenValidator, wrapRequestHandler(postController.deletePost.bind(postController)))

export default postsRouter

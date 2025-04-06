import { NextFunction, Request, Response } from 'express'
import { USERS_MESSAGE } from '~/constants/messages'
import { TokenPayLoad } from '~/models/requests/User.requests'
import followersService from '~/services/followers.services'

export const addFollowerController = async (req: Request, res: Response, next: NextFunction) => {
  const { follower_user_id } = req.body
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const result = await followersService.addFollower({ user_id: user_id, follower_user_id: follower_user_id })

  return res.json({
    message: result.message
  })
}

export const getFollowersController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.params
  const limit = Number(req.query.limit) || 10
  const page = Number(req.query.page) || 1
  const result = await followersService.getFollowers(user_id, limit, page)

  return res.json({
    message: USERS_MESSAGE.GET_FOLLOWERS_SUCCESSFULLY,
    data: result
  })
}

export const removeFollowerController = async (req: Request, res: Response, next: NextFunction) => {
  const { follower_user_id } = req.body
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const result = await followersService.removeFollower({ user_id: user_id, follower_user_id: follower_user_id })

  return res.json({
    message: USERS_MESSAGE.REMOVE_FOLLOWER_SUCCESSFULLY
  })
}

export const getMutualFollowersController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const limit = Number(req.query.limit) || 10
  const page = Number(req.query.page) || 1
  const result = await followersService.getMutualFollowers(user_id, limit, page)

  return res.json({
    message: USERS_MESSAGE.GET_MUTUAL_FOLLOWERS_SUCCESSFULLY,
    data: result
  })
}

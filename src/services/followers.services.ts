import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { USERS_MESSAGE } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

class FollowersService {
  async addFollower({ user_id, follower_user_id }: { user_id: string; follower_user_id: string }) {
    const result = await databaseService.followers.insertOne({
      user_id: new ObjectId(user_id),
      follower_user_id: new ObjectId(follower_user_id)
    })

    return {
      message: USERS_MESSAGE.FOLLOW_SUCCESSFULLY
    }
  }

  async getFollowers(user_id: string, limit: number, page: number) {
    const result = await databaseService.followers
      .find({
        user_id: new ObjectId(user_id)
      })
      .skip(limit * (page - 1))
      .toArray()

    return {
      result
    }
  }

  async removeFollower({ user_id, follower_user_id }: { user_id: string; follower_user_id: string }) {
    const result = await databaseService.followers.deleteOne({
      user_id: new ObjectId(user_id),
      follower_user_id: new ObjectId(follower_user_id)
    })

    if (result.deletedCount === 0) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGE.FOLLOWER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return {
      message: USERS_MESSAGE.REMOVE_FOLLOWER_SUCCESSFULLY
    }
  }

  async getMutualFollowers(user_id: string, limit: number, page: number) {
    const objectId = new ObjectId(user_id)
    const result = await databaseService.followers
      .aggregate([
        // Tìm tất cả người đang follow user_id
        {
          $match: {
            user_id: objectId
          }
        },
        // Tìm trong số đó, ai được user_id follow ngược lại
        {
          $lookup: {
            from: 'followers',
            let: { follower_id: '$follower_user_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$user_id', '$$follower_id'] }, { $eq: ['$follower_user_id', objectId] }]
                  }
                }
              }
            ],
            as: 'mutual'
          }
        },
        // Chỉ giữ lại những người có follow lẫn nhau
        {
          $match: {
            mutual: { $ne: [] }
          }
        },
        // Lấy thông tin người dùng
        {
          $lookup: {
            from: 'users',
            localField: 'follower_user_id',
            foreignField: '_id',
            as: 'user_info'
          }
        },
        // Định dạng kết quả
        {
          $project: {
            _id: 0,
            user: { $arrayElemAt: ['$user_info', 0] }
          }
        },
        // Phân trang
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    return result
  }
}

const followersService = new FollowersService()

export default followersService

import jwt from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayLoad } from '~/models/requests/User.requests'

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }

      resolve(token as string)
    })
  })
}

// export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
//   return new Promise<TokenPayLoad>((resolve, reject) => {
//     jwt.verify(token, secretOrPublicKey, (error, decoded) => {
//       if (error) {
//         throw reject(error)
//       }

//       resolve(decoded as TokenPayLoad)
//     })
//   })
// }

export const verifyToken = ({
  token,
  secretOrPublicKey,
  tokenType
}: {
  token: string
  secretOrPublicKey: string
  tokenType: TokenType
}) => {
  return new Promise<TokenPayLoad>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        if (error instanceof jwt.TokenExpiredError) {
          const errorMessage =
            tokenType === TokenType.AccessToken
              ? 'Access token has expired'
              : tokenType === TokenType.RefreshToken
                ? 'Refresh token has expired'
                : 'Token has expired'
          return reject(new ErrorWithStatus({ message: errorMessage, status: HTTP_STATUS.UNAUTHORIZED }))
        }
        return reject(error)
      }
      resolve(decoded as TokenPayLoad)
    })
  })
}

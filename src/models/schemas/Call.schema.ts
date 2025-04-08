import { ObjectId } from 'mongodb'
import { CALL_STATUS, CALL_TYPE } from '~/constants/enums'

export interface CallType {
  _id?: ObjectId
  caller_id: ObjectId
  receiver_id: ObjectId
  started_at: Date
  ended_at?: Date
  status: CALL_STATUS
  type: CALL_TYPE
  created_at?: Date
}

export default class Call {
  _id?: ObjectId
  caller_id: ObjectId
  receiver_id: ObjectId
  started_at: Date
  ended_at?: Date
  status: CALL_STATUS
  type: CALL_TYPE
  created_at?: Date

  constructor({ _id, caller_id, receiver_id, started_at, ended_at, status, type, created_at }: CallType) {
    const date = new Date()

    this._id = _id
    this.caller_id = caller_id
    this.receiver_id = receiver_id
    this.started_at = started_at
    this.ended_at = ended_at
    this.status = status
    this.type = type
    this.created_at = created_at || date
  }
}

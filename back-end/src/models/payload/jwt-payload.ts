import { UserRole } from 'src/core/enum/user-role.enum'
// import { IsBanned } from '../isBanned/isBanned.entity'

export class JWTPayload {
    id: string
    email: string
    userName: string
    role: string
    isBanned:  boolean
    avatarURL: string

}

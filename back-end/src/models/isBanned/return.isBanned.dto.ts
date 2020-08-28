import { User } from '../users/user.entity'

export class ReturnIsBannedDTO {
    id: string
    owner: User
    description: string
    // @Column({ type: 'timestamp', default: () => 'current_timestamp'})
    banDate: Date
    expirationDate: Date
}

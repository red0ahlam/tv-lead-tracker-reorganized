import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt'

@Injectable()
export class PasswordService {

    private readonly saltRounds = 12

    async hashPassword(password: string): Promise<string>{
        return await bcrypt.hash(password, this.saltRounds)
    }

    async comparePassword(password: string, hash: string): Promise<boolean>{
        return await bcrypt.compare(password, hash)
    }
}

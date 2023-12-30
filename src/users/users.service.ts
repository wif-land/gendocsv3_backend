import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './users.entity'
import { CreateUserDTO } from './dto/create-user.dto'
import { genSalt, hash } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: {
        outlookEmail: email,
        isActive: true,
      },
    })

    return result
  }

  async create(user: CreateUserDTO): Promise<User> {
    const password = await this.generateSaltPassword(user.password)

    return await this.userRepository
      .create({
        ...user,
        password,
      })
      .save()
  }

  async update(
    id: number,
    user: Partial<CreateUserDTO>,
  ): Promise<{ accessToken: string }> {
    let userToUpdate = user
    let password = ''
    const hasNewPassword = user.password !== undefined

    if (hasNewPassword) {
      password = await this.generateSaltPassword(user.password)

      userToUpdate = {
        ...user,
        password,
      }
    }

    try {
      await this.userRepository.update(
        {
          id,
        },
        userToUpdate,
      )

      const payload = {
        username: `${user.firstName} ${user.firstLastName}`,
        sub: id,
        roles: user.roles,
        platformPermission: user.platformPermission,
      }

      return { accessToken: this.jwtService.sign(payload) }
    } catch (error) {
      throw new Error(error)
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.userRepository.update(
        {
          id,
        },
        {
          isActive: false,
        },
      )

      return true
    } catch (error) {
      return false
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        outlookEmail: true,
        googleEmail: true,
        firstName: true,
        firstLastName: true,
        secondName: true,
        secondLastName: true,
        roles: true,
        platformPermission: true,
        isActive: true,
      },
    })
  }

  private async generateSaltPassword(password: string): Promise<string> {
    const ROUNDS = 10
    const SALT = await genSalt(ROUNDS)

    return hash(password, SALT)
  }
}

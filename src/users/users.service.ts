import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/users.entity'
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
    id: string,
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
        sub: id,
        firstName: user.firstName,
        firstLastName: user.firstLastName,
        secondName: user.secondName,
        secondLastName: user.secondLastName,
        outlookEmail: user.outlookEmail,
        googleEmail: user.googleEmail,
        roles: user.roles,
        isActive: user.isActive,
      }

      return { accessToken: this.jwtService.sign(payload) }
    } catch (error) {
      throw new Error(error)
    }
  }

  async delete(id: string): Promise<boolean> {
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
      select: {
        id: true,
        outlookEmail: true,
        googleEmail: true,
        firstName: true,
        firstLastName: true,
        secondName: true,
        secondLastName: true,
        roles: true,
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

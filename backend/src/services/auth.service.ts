
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SqlDataSource } from '../config/sql.config';
import { User } from '../entities/user.entity';

const userRepository = SqlDataSource.getRepository(User);

export class AuthService {

  async register(username: string, password: string) {

    const existing = await userRepository.findOneBy({
      username
    });

    if (existing) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = userRepository.create({
      username,
      password: hashedPassword
    });

    const savedUser = await userRepository.save(user);

    return {
      id: savedUser.id,
      username: savedUser.username
    };
  }

  async login(username: string, password: string) {

    const user = await userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      throw new Error('Invalid username or password');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username
      }
    };
  }
}

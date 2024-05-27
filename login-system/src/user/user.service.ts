import { Injectable, UnauthorizedException, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { UpdateUser } from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    sgMail.setApiKey(this.configService.get<string>('MAILSERVER_API'));
  }

  async createUser(createUserDto: any): Promise<User> {
    try {
      const newUser = new this.userModel(createUserDto);
      return newUser.save();
    } catch (error) {
      throw error;
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      return this.userModel.find().select('-isActive -__v -password').exec();
    } catch (error) {
      throw error;
    }
  }

  async findOneUser(username: string): Promise<User | undefined> {
    try {
      return this.userModel
        .findOne({ username })
        .select('-isActive -__v')
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async findOneUserByEmail(email: string): Promise<User | undefined> {
    try {
      return this.userModel
        .findOne({ email })
        .select('-isActive -__v -password')
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async updateUser(username: string, updateUser: UpdateUser): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(updateUser.password, salt);
      const user = await this.userModel
        .findOneAndUpdate(
          { username },
          { password: hashedPassword },
          { new: true, runValidators: true },
        )
        .exec();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(username: string): Promise<any> {
    try {
      return this.userModel.deleteOne({ username }).exec();
    } catch (error) {
      throw error;
    }
  }

  async checkPassword(inputPassword: string, storedHash: string) {
    try {
      const match = await bcrypt.compare(inputPassword, storedHash);
      if (match) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async signIn(username: string, id: string): Promise<string> {
    const payload = { sub: id, username: username };
    return await this.jwtService.signAsync(payload);
  }

  async verify(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET_TOKEN'),
      });
      return { status: true, message: payload };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          status: false,
          message: 'Token has expired, please log in again.',
        };
      }
      return {
        status: false,
        message: 'Invalid token.',
      };
    }
  }

  async formatMail(token: string, email: string) {
    try {
      // url reset password
      const host = this.configService.get<string>('FRONTEND_URL');
      const path = 'reset/' + token;
      const url = `${host}/${path}`;
      // html
      const body = `
        <div>
            <h1>Reset Password</h1>
            <p>reset password please <a href="${url}">click here</a>.</p>
        </div>`;

      await this.sendMail(
        email,
        'Reset Password',
        'To reset your password, please use the following link.',
        body,
      );
      return url;
    } catch (error) {
      throw error;
    }
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    const msg = {
      to,
      from: 'ariyavas.p@ku.th',
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent successfully');
      console.log(msg);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

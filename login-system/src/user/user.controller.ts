import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser, GetUser, UpdateUser } from './models/user.model';
import { ResponseUtils } from 'src/common/response.model';
import { LocalToken } from '../common/token.decurator';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUser) {
    try {
      const user = await this.userService.findOneUser(createUserDto.username);
      if (createUserDto.password != createUserDto.confirmPassword) {
        return ResponseUtils.BadRequestResponse(
          'password and confirm password not macth.',
        );
      }
      const userAfterSave = await this.userService.createUser(createUserDto);
      return ResponseUtils.CustomResponse(HttpStatus.OK, '200', userAfterSave);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@LocalToken() token: string) {
    try {
      const decode = await this.userService.verify(token);
      if (!decode.status) {
        return ResponseUtils.BadRequestResponse(decode.message);
      }

      const user = await this.userService.findAllUsers();
      return ResponseUtils.CustomResponse(HttpStatus.OK, '200', user);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async findOne(@Body() body: GetUser) {
    try {
      const user = await this.userService.findOneUser(body.username);
      if (!user) {
        return ResponseUtils.BadRequestResponse('username not found.');
      }

      const validatePassword: Boolean = await this.userService.checkPassword(
        body.password,
        user.password,
      );
      if (!validatePassword) {
        return ResponseUtils.BadRequestResponse('password not macth.');
      }

      const token: string = await this.userService.signIn(
        user.username,
        user.id,
      );

      return ResponseUtils.CustomResponse(HttpStatus.OK, '200', token);
    } catch (error) {
      throw error;
    }
  }

  @Get('reset/:email')
  async reset(@Param('email') param: string) {
    try {
      const user = await this.userService.findOneUserByEmail(param);
      if (!user) {
        return ResponseUtils.BadRequestResponse('user not found.');
      }
      const token: string = await this.userService.signIn(
        user.username,
        user.id,
      );
      const sendMail = await this.userService.formatMail(token, param);
      return ResponseUtils.CustomResponse(HttpStatus.OK, '200', sendMail);
    } catch (error) {
      throw error;
    }
  }

  @Get('profile/:token')
  async update(@Param('token') token: string) {
    try {
      const decode = await this.userService.verify(token);
      if (!decode.status) {
        return ResponseUtils.BadRequestResponse(decode.message);
      }
      return ResponseUtils.CustomResponse(HttpStatus.OK, '200', decode.message);
    } catch (error) {
      throw error;
    }
  }

  @Put(':username')
  async updatePassword(@Param('username') param: string, @Body() body: UpdateUser) {
    try {
      if (body.password != body.confirmPassword) {
        return ResponseUtils.BadRequestResponse(
          'password and confirm password not macth.',
        );
      }
      const user = await this.userService.updateUser(param, body);
      return ResponseUtils.CustomResponse(HttpStatus.OK, '200', user);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':username')
  async remove(@Param('username') username: string) {
    try {
      return await this.userService.deleteUser(username);
    } catch (error) {
      throw error;
    }
  }
}

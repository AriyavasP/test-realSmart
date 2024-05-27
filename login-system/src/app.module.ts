import { Module } from '@nestjs/common';
import { MongoModule } from './mongoose.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

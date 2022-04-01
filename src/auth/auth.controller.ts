import { Controller, Post, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { configService } from 'src/config/config.service';
import { CloudfrontService } from 'src/modules/aws/cloudfront/cloudfront.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { LoginRequestDto } from './dtos/login-request.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginRequestDto })
  async login(@Request() req, @Response() res) {
    const loginResponse = await this.authService.login(req.user);
    const domain = configService.getCloudfrontAwsDomain();
    const expireTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
    const awsCookies = await new CloudfrontService().getSignedCookie(domain);

    for (const key in awsCookies) {
      console.log(key, awsCookies[key]);
      res.cookie(key, awsCookies[key], {
        domain,
        httpOnly: true,
        expires: expireTime,
        secure: configService.getEnv() !== 'development',
      });
    }

    res
      .cookie(jwtConstants.accessToken, loginResponse.accessToken, {
        httpOnly: true,
        expires: expireTime,
        secure: configService.getEnv() !== 'development',
        signed: true,
      })
      .send({ success: true, user: loginResponse.user });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/user')
  async user(@Request() req) {
    const user = await this.authService.getUser(req.user);
    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Response() res) {
    const awsCookieKeys = [
      'CloudFront-Policy',
      'CloudFront-Signature',
      'CloudFront-Key-Pair-Id',
    ];

    for (const key in awsCookieKeys) {
      res.clearCookie(key);
    }
    res.clearCookie(jwtConstants.accessToken);
    res.send({ success: true });
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../../../../shared/application/models/authenticated-user.model';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { ApiErrorResponseDto } from '../../../../shared/presentation/dto/api-error-response.dto';
import { CloseAccountUseCase } from '../../application/use-cases/close-account.use-case';
import { GetProfileUseCase } from '../../application/use-cases/get-profile.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RegisterDto } from '../dtos/register.dto';
import { UserResponseDto } from '../../../users/presentation/dtos/user-response.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly closeAccountUseCase: CloseAccountUseCase,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar una cuenta de usuario común' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  async register(@Body() dto: RegisterDto): Promise<UserResponseDto> {
    const user = await this.registerUserUseCase.execute({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      privacyTermsAccepted: dto.privacyTermsAccepted,
      privacyTermsVersion: dto.privacyTermsVersion,
    });

    return UserResponseDto.from(user);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión con correo y contraseña' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  async login(@Body() dto: LoginDto, @Req() request: Request): Promise<AuthResponseDto> {
    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    return AuthResponseDto.from(result);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar el access token con un refresh token' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    const result = await this.refreshTokenUseCase.execute({
      refreshToken: dto.refreshToken,
    });

    return AuthResponseDto.from(result);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cerrar la sesión asociada al refresh token' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    await this.logoutUseCase.execute({ refreshToken: dto.refreshToken });
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  async me(@CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto> {
    const profile = await this.getProfileUseCase.execute(user.id);

    return UserResponseDto.from(profile);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cerrar la cuenta del usuario autenticado' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  async closeAccount(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.closeAccountUseCase.execute({ userId: user.id });
  }
}

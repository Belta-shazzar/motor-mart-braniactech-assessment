import config from "@/config";
import { SignInDto, SignUpDto } from "@/dto/auth.dto";
import { HttpException } from "@/exceptions/http.exception";
import { AuthData, DataStoredInToken } from "@/interfaces/auth.interface";
import { User } from "@prisma/client";
import { UserService } from "@services/user.service";
import { compare, hash } from "bcrypt";
import httpStatus from "http-status";
import { sign } from "jsonwebtoken";
import { Service } from "typedi";

@Service()
export class AuthService {
  constructor(private userService: UserService) {}

  public async signUp(signUpDto: SignUpDto): Promise<AuthData> {
    const checkUser: User = await this.userService.findByEmail(signUpDto.email);

    if (checkUser)
      throw new HttpException(
        httpStatus.CONFLICT,
        `This email ${signUpDto.email} already exists`
      );

    const hashedPassword = await hash(signUpDto.password, 10);
    const user = await this.userService.createUser({
      ...signUpDto,
      password: hashedPassword,
    });

    return {
      user: this.userService.stripUserPassword(user),
      token: this.createToken(user.id),
    };
  }

  public async signIn(signInDto: SignInDto): Promise<AuthData> {
    const user: User = await this.userService.findByEmail(signInDto.email);
    if (!user)
      throw new HttpException(
        httpStatus.NOT_FOUND,
        `This email ${signInDto.email} does not exist`
      );

    const isMatchingPassword: boolean = await compare(
      signInDto.password,
      user.password
    );
    if (!isMatchingPassword) throw new HttpException(401, "Incorrect password");

    return {
      user: this.userService.stripUserPassword(user),
      token: this.createToken(user.id),
    };
  }

  private createToken(userId: string): string {
    const dataStoredInToken: DataStoredInToken = { id: userId };
    const secretKey: string = config.app.jwtSecret;
    const expiresIn: number = 60 * 3600;

    return sign(dataStoredInToken, secretKey, { expiresIn });
  }
}

import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
  @ApiProperty({
    description: "Email address registered with Niventra Capital Advisory",
    example: "investor@example.com",
  })
  @IsEmail({}, { message: "A valid email address is required." })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: "Single-use password recovery token issued to email" })
  @IsString()
  @IsNotEmpty({ message: "Reset token is required." })
  token: string;

  @ApiProperty({ description: "New password (minimum 8 characters)", example: "RotatedSecure2026!#" })
  @IsString()
  @MinLength(8, { message: "New password must be at least 8 characters long." })
  newPassword: string;
}

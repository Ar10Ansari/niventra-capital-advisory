import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "Registered email address", example: "investor@example.com" })
  @IsEmail({}, { message: "A valid email address is required." })
  email: string;

  @ApiProperty({ description: "Account password", example: "DemoInvestor2026!#" })
  @IsString()
  @IsNotEmpty({ message: "Password is required." })
  password: string;
}

import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChatQueryDto {
  @ApiProperty({
    description: "User question about Niventra advisory services or disclosures",
    example: "What is your 5-point due diligence framework?",
  })
  @IsString()
  @IsNotEmpty({ message: "Please provide a valid question regarding Niventra's debt advisory services." })
  @MaxLength(2000)
  message: string;
}

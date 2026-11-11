import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CalculatorService } from "./calculator.service";
import { CalculateDto } from "./dto/calculate.dto";

@ApiTags("Indicative Return Calculator")
@Controller("calculator")
export class CalculatorController {
  constructor(private calculatorService: CalculatorService) {}

  @Post("simulate")
  @ApiOperation({ summary: "Calculate simple-interest debenture return schedule and TDS disclosures" })
  simulate(@Body() dto: CalculateDto) {
    return this.calculatorService.calculate(dto);
  }
}

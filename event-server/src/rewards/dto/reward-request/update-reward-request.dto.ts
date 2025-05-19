import { RewardRequestStatus } from "src/rewards/schemas/reward-request.schema";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateRewardRequestDto {
    @IsEnum(RewardRequestStatus)
    @IsNotEmpty()
    @ApiProperty({ description: '보상 요청 상태', enum: RewardRequestStatus })
    status: RewardRequestStatus;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: '보상 요청 이유', required: false })
    rejectionReason?: string;
}

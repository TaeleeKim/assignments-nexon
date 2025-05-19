import { IsObject, IsOptional } from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { RewardRequestStatus, Reward } from "src/interfaces/reward.interface";

export class UpdateRewardResponseDto {
    constructor(status: RewardRequestStatus, rewards: Reward[], approvedData?: any, rejectedData?: any) {
        this.status = status;
        this.rewards = rewards;
        this.approvedData = approvedData ?? undefined;
        this.rejectedData = rejectedData ?? undefined;
    }

    @IsNotEmpty()
    @ApiProperty({ description: '보상 요청 결과' })
    status: RewardRequestStatus;

    @IsObject()
    @IsNotEmpty()
    @ApiProperty({ description: '보상 목록' })
    rewards: Reward[];

    @IsObject()
    @IsOptional()
    @ApiPropertyOptional({ description: '승인 정보', required: false })
    approvedData?: {
        approvedAt: Date;
        approvedBy: string | null; // null일 경우 시스템 체크
    }

    @IsObject()
    @IsOptional()
    @ApiPropertyOptional({ description: '거절 정보', required: false })
    rejectedData?: {
        rejectedAt: Date;
        rejectedBy: string | null; // null일 경우 시스템 체크
        rejectionReason: string;
    }
} 
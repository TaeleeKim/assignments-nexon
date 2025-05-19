import { IsObject } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { RewardRequestStatus } from "src/rewards/schemas/reward-request.schema";
import { Reward } from "src/rewards/schemas/reward.schema";

export class CreateRewardResponseDto {
    constructor(status: RewardRequestStatus, rewards: Reward[]) {
        this.status = status;
        this.rewards = rewards;
    }

    @IsNotEmpty()
    @ApiProperty({ description: '보상 요청 결과' })
    status: RewardRequestStatus;

    @IsObject()
    @IsNotEmpty()
    @ApiProperty({ description: '보상 목록' })
    rewards: Reward[];
} 
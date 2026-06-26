import { IsEnum } from 'class-validator';

export enum ReviewModerationAction {
  HIDE = 'HIDE',
  SHOW = 'SHOW',
}

export class ModerateReviewDto {
  @IsEnum(ReviewModerationAction)
  action!: ReviewModerationAction;
}

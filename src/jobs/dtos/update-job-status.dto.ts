import { IsEnum } from 'class-validator';

export enum UpdateJobStatus {
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export class UpdateJobStatusDto {
  @IsEnum(UpdateJobStatus)
  status!: UpdateJobStatus;
}

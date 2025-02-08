export class CreateCommentDto {
  userId: number;
  homeId: number;
  commentContent?: string;
  commentRate: number;
}

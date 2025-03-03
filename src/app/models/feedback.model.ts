export interface Feedback {
  feedbackText: string;
  rating: number;
  assessmentId:number,
  email:string
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
}
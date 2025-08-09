export interface QueryRequest {
  documents: string;
  questions: string[];
}

export interface QueryAnswer {
  answer: string;
  clause: string;
  section: string;
  page: number;
  rationale: string;
}

export interface QueryResponse {
  answers: QueryAnswer[];
}

export interface ApiError {
  detail: string;
  status?: number;
}
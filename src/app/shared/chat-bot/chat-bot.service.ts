import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';
 
export interface QuizQuestion {
  id: number;
  question: string;
  type: 'select' | 'text';
  options: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface QuizResponse {
  status: boolean;
  message: string;
  data: {
    items: { [key: string]: QuizQuestion };
  };
}

export interface QuizAnswer {
  [questionId: number]: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatBotService {
  private apiUrl = 'https://driftech.tech/dashboard/public/api/auth/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getQuiz(): Observable<QuizResponse> {
    return this.http.get<QuizResponse>(`${this.apiUrl}quiz`, {
      headers: this.getHeaders(),
    });
  }

  submitAnswers(answers: QuizAnswer): Observable<any> {
    return this.http.post(`${this.apiUrl}quiz-answers`, answers, {
      headers: this.getHeaders(),
    });
  }
}

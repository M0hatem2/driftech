import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChatBotService, QuizQuestion, QuizAnswer } from './chat-bot.service';
import { ChatVisibilityService } from '../../shared/services/chat-visibility.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
  animations: [
    trigger('chatAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.9) translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ChatBotComponent implements OnInit, OnDestroy {
  isChatOpen = false;
  newMessage = '';
  messages: { text: string; sender: 'me' | 'bot'; isSuccess?: boolean }[] = [];
  isAuthenticated = false;
  private authSubscription: Subscription = new Subscription();

  // Quiz properties
  isQuizMode = false;
  quizQuestions: QuizQuestion[] = [];
  currentQuestionIndex = 0;
  currentAnswer = '';
  answers: QuizAnswer = {};
  isLoading = false;
  hasSubmittedQuiz = false;
  private readonly QUIZ_SUBMITTED_KEY = 'quiz_submitted';
  private autoCloseTimer: any = null;

  // Initial greeting state
  showInitialGreeting = false;
  private delayTimer: any = null;
  quizDataLoaded = false;

  constructor(
    private authService: AuthService,
    private chatBotService: ChatBotService,
    private chatVisibilityService: ChatVisibilityService,
  ) {}

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.authState$.subscribe((isAuth: boolean) => {
      this.isAuthenticated = isAuth;
    });

    // Subscribe to chat visibility changes
    this.authSubscription.add(
      this.chatVisibilityService.isOpen$.subscribe((isOpen: boolean) => {
        this.isChatOpen = isOpen;
        if (isOpen && this.isAuthenticated && !this.isQuizMode) {
          if (this.hasSubmittedQuiz) {
            this.showSubmittedMessage();
          } else if (!this.showInitialGreeting) {
            this.initializeGreeting();
          }
        }
      }),
    );

    // Check if quiz has been submitted
    this.checkQuizSubmissionStatus();
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    // Clear auto-close timer
    this.clearAutoCloseTimer();
    // Clear delay timer
    this.clearDelayTimer();
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.chatVisibilityService.openChat();
      // Load quiz data immediately when chat opens (only once)
      if (!this.quizDataLoaded && !this.hasSubmittedQuiz) {
        this.loadQuizData();
        this.quizDataLoaded = true;
      }
      // If quiz was submitted, start auto-close timer
      if (this.hasSubmittedQuiz) {
        this.startAutoCloseTimer();
      }
    } else {
      this.chatVisibilityService.closeChat();
      this.clearAutoCloseTimer();
    }
  }

  loadQuizData() {
    this.isLoading = true;
    console.log('Starting to load quiz data...');
    this.chatBotService.getQuiz().subscribe({
      next: (response) => {
        console.log('Quiz response received:', response);
        if (response.status && response.data && response.data.items) {
          this.quizQuestions = Object.values(response.data.items);
          console.log('Questions loaded successfully:', this.quizQuestions.length, 'questions');
        } else {
          console.warn('Invalid response structure:', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading quiz:', error);
        this.messages.push({
          text: "Sorry, couldn't load the quiz. Please try again.",
          sender: 'bot',
        });
        this.isLoading = false;
      },
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, sender: 'me' });
      this.newMessage = '';
      // رد تلقائي بعد ثانية
      setTimeout(() => {
        this.messages.push({ text: 'Got it! We’ll reply soon.', sender: 'bot' });
      }, 1000);
    }
  }
  initializeGreeting() {
    this.showInitialGreeting = true;
    this.messages = [
      {
        text: "Hello, I'm Yahya, let me help you find your car.",
        sender: 'bot',
      },
    ];
  }
  startQuiz() {
    // Add "start" message to chat
    this.messages.push({ text: 'start', sender: 'me' });
    this.showInitialGreeting = false;

    // Check if questions are loaded
    console.log('Questions before delay:', this.quizQuestions.length);

    // After 2 seconds, show questions (data should be loaded)
    this.delayTimer = setTimeout(() => {
      if (this.quizQuestions && this.quizQuestions.length > 0) {
        this.isQuizMode = true;
        this.currentQuestionIndex = 0;
        this.currentAnswer = '';
        this.answers = {};
        console.log('Quiz mode activated with', this.quizQuestions.length, 'questions');
      } else {
        console.error('No questions loaded!');
        this.messages.push({
          text: 'Error: No questions available. Please refresh.',
          sender: 'bot',
        });
      }
    }, 2000);
  }

  selectOption(option: string) {
    this.currentAnswer = option;
    this.submitAnswer();
  }

  nextQuestion() {
    if (this.currentAnswer.trim()) {
      this.submitAnswer();
    }
  }

  get currentQuestion(): QuizQuestion | null {
    return this.quizQuestions[this.currentQuestionIndex] || null;
  }

  submitAnswer() {
    if (!this.currentQuestion) return;

    this.answers[this.currentQuestion.id] = this.currentAnswer;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.quizQuestions.length) {
      this.submitQuiz();
    } else {
      this.currentAnswer = '';
    }
  }

  submitQuiz() {
    this.isLoading = true;
    this.chatBotService.submitAnswers(this.answers).subscribe({
      next: (response) => {
        this.setQuizSubmitted();
        this.messages.push({
          text: 'Answers saved successfully ✓',
          sender: 'bot',
          isSuccess: true,
        });
        this.isQuizMode = false;
        this.isLoading = false;
        // Start auto-close timer after quiz submission
        this.startAutoCloseTimer();
      },
      error: (error) => {
        this.messages.push({
          text: 'There was an error submitting your answers. Please try again.',
          sender: 'bot',
        });
        this.isLoading = false;
      },
    });
  }

  goBack() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentAnswer = this.answers[this.quizQuestions[this.currentQuestionIndex].id] || '';
    }
  }

  private checkQuizSubmissionStatus() {
    if (typeof window !== 'undefined' && localStorage) {
      const submitted = localStorage.getItem(this.QUIZ_SUBMITTED_KEY);
      this.hasSubmittedQuiz = submitted === 'true';
    }
  }

  private setQuizSubmitted() {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.QUIZ_SUBMITTED_KEY, 'true');
      this.hasSubmittedQuiz = true;
    }
  }

  private showSubmittedMessage() {
    this.messages = [
      {
        text: ' Answer submitted   ✓',
        sender: 'bot',
        isSuccess: true,
      },
    ];
    // Start auto-close timer when showing submitted message
    this.startAutoCloseTimer();
  }

  private startAutoCloseTimer() {
    this.clearAutoCloseTimer();
    this.autoCloseTimer = setTimeout(() => {
      this.isChatOpen = false;
      this.chatVisibilityService.closeChat();
      this.clearAutoCloseTimer();
    }, 3000);
  }

  private clearAutoCloseTimer() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  private clearDelayTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  }
}

// Mock API services for development

import { AIModel } from '../model/AIModel';
import { Persona } from '../model/persona';
import { UserProfile, HistoryItem } from '../store/slices/userSlice';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Auth Service
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    // Simulate API call
    await delay(1000);

    // Mock validation
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      const user = {
        id: '1',
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
      };

      // Store in localStorage to persist session
      localStorage.setItem('personaverse_current_user', JSON.stringify(user));

      return user;
    } else {
      throw new Error('Invalid email or password');
    }
  },

  register: async (userData: { name: string; username: string; email: string; password: string }) => {
    // Simulate API call
    await delay(1500);

    // Mock validation
    if (userData.email === 'test@example.com') {
      throw new Error('Email already in use');
    }

    const user = {
      id: '2',
      name: userData.name,
      username: userData.username,
      email: userData.email,
    };

    // Store in localStorage to persist session
    localStorage.setItem('personaverse_current_user', JSON.stringify(user));

    return user;
  },

  logout: async () => {
    // Simulate API call
    await delay(500);

    // Remove from localStorage
    localStorage.removeItem('personaverse_current_user');

    return true;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('personaverse_current_user');
    return user ? JSON.parse(user) : null;
  },
};

// User Service
export const userService = {
  getUserProfile: async () => {
    // Simulate API call
    await delay(800);

    const profile: UserProfile = {
      id: '1',
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      plan: 'free',
      tokensAvailable: 100,
    };

    return profile;
  },

  updateUserProfile: async (updates: Partial<UserProfile>) => {
    // Simulate API call
    await delay(1000);

    // In a real app, this would update the backend
    return {
      id: '1',
      name: updates.name || 'Test User',
      username: updates.username || 'testuser',
      email: 'test@example.com',
      plan: updates.plan || 'free',
      tokensAvailable: 100,
    };
  },

  addTokens: async (amount: number) => {
    // Simulate API call
    await delay(800);

    // In a real app, this would update the backend
    const updatedProfile: UserProfile = {
      id: '1',
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      plan: 'free',
      tokensAvailable: 100 + amount,
    };

    return updatedProfile;
  },

  changePlan: async (planType: 'free' | 'standard' | 'premium') => {
    // Simulate API call
    await delay(1200);

    // In a real app, this would update the backend
    const updatedProfile: UserProfile = {
      id: '1',
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      plan: planType,
      tokensAvailable: planType === 'free' ? 100 : planType === 'standard' ? 300 : 500,
    };

    return updatedProfile;
  },
};

// History Service
export const historyService = {
  downloadFile: (fileUrl: string) => {
    // In a real app, this would trigger a file download
    console.log(`Downloading file from: ${fileUrl}`);
    alert(`In a real app, this would download the file from: ${fileUrl}`);
  },
  getUserHistory: async () => {
    // Simulate API call
    await delay(1000);

    const history: HistoryItem[] = [
      {
        id: '1',
        title: 'Customer Satisfaction Survey',
        fileUrl: '/files/survey1.xlsx',
        createdAt: '2025-04-10T15:30:00Z',
        modelUsed: '2',
        personasUsed: ['John, 35, Manager', 'Sarah, 28, Designer', 'Emily, 31, Researcher'],
        tokensCost: 45,
      },
      {
        id: '2',
        title: 'Product Feedback Form',
        fileUrl: '/files/feedback.docx',
        createdAt: '2025-04-08T10:15:00Z',
        modelUsed: '3',
        personasUsed: ['David, 42, Executive', 'Lisa, 24, Student'],
        tokensCost: 25,
      },
      {
        id: '3',
        title: 'Market Research Questionnaire',
        fileUrl: '/files/market_research.pdf',
        createdAt: '2025-04-05T14:45:00Z',
        modelUsed: '4',
        personasUsed: ['Michael, 55, Educator', 'John, 35, Manager', 'Emily, 31, Researcher', 'Sarah, 28, Designer'],
        tokensCost: 80,
      },
    ];

    return history;
  },
};

// File Service
export const fileService = {
  uploadFile: async (file: File, progressCallback?: (progress: number) => void) => {
    // Simulate file upload with progress
    let progress = 0;
    const totalDuration = 3000; // 3 seconds
    const interval = 200; // Update every 200ms
    const steps = totalDuration / interval;

    for (let i = 0; i <= steps; i++) {
      await delay(interval);
      progress = Math.min(100, Math.round((i / steps) * 100));

      if (progressCallback) {
        progressCallback(progress);
      }
    }

    // Mock response
    return {
      success: true,
      fileUrl: `/uploads/${file.name}`,
    };
  },
};

// Persona Service
export const personaService = {
  getPersonas: async () => {
    // Simulate API call
    // await delay(600);

    // Get personas from the store/initial data
    const response = await fetch('/api/personas');
    console.log("response", response);

    const personas: Persona[] = await response.json();

    return personas;
  },

  getModels: async () => {
    // Simulate API call
    await delay(600);

    // Get models from the store/initial data
    const response = await fetch('/api/models');
    const models: AIModel[] = await response.json();

    return models;
  },

  generateResponses: async (
    fileUrl: string,
    modelId: string,
    personaIds: string[],
    prompt: string
  ) => {
    // Simulate API call
    await delay(5000);

    // Calculate token cost based on model and personas
    const tokenCost = personaIds.length * 5 + (modelId === '1' ? 5 : modelId === '2' ? 15 : modelId === '3' ? 10 : 20);

    return {
      success: true,
      responseUrl: `/responses/response_${Date.now()}.xlsx`,
      tokenCost,
    };
  },
};

// Pricing Service
export const pricingService = {
  getPricingPlans: async () => {
    // Simulate API call
    await delay(800);

    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        tokenAmount: 10000,
        features: [
          'Upload up to 5 survey files',
          'Access to GPT-Mini model',
          'Basic persona options',
          'Standard response formats',
        ],
      },
      {
        id: 'standard',
        name: 'Standard',
        price: 9.99,
        tokenAmount: 500000,
        features: [
          'Unlimited survey uploads',
          'Access to GPT-4o and DeepSeek',
          'Advanced persona customization',
          'Priority processing',
          'Extended history retention',
        ],
        popular: true,
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 19.99,
        tokenAmount: 2000000,
        features: [
          'All Standard features',
          'Access to all AI models',
          'Custom persona creation',
          'Advanced analytics',
          'Dedicated support',
          'Team collaboration',
        ],
      },
    ];
  },

  startCheckout: async (packageId: string) => {
    // Simulate API call
    await delay(1200);

    return {
      success: true,
      checkoutUrl: `/checkout?package=${packageId}`,
    };
  },
};

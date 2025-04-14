import { LoginCredentials } from '../../hooks/useAuth';
import { UserProfile, HistoryItem } from '../../store/slices/userSlice';

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password',
  },
];

const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  plan: 'free',
  tokensAvailable: 50,
};

const mockHistoryItems: HistoryItem[] = [
  {
    id: '1',
    title: 'Customer Satisfaction Survey',
    fileUrl: '/files/survey1.pdf',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    modelUsed: '2',
    personasUsed: ['John', 'Sarah', 'Michael'],
    tokensCost: 45,
  },
  {
    id: '2',
    title: 'Product Feedback Form',
    fileUrl: '/files/survey2.docx',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    modelUsed: '4',
    personasUsed: ['Emily', 'David', 'Lisa'],
    tokensCost: 60,
  },
];





const mockPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    tokenAmount: 50,
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
    tokenAmount: 200,
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
    tokenAmount: 500,
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

// Auth Service
export const authService = {
  getCurrentUser: () => {
    const user = localStorage.getItem('personaverse_current_user');
    return user ? JSON.parse(user) : null;
  },

  login: async (credentials: LoginCredentials) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const user = mockUsers.find((u) => u.email === credentials.email && u.password === credentials.password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('personaverse_current_user', JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  },

  register: async (data: { name: string; username: string; email: string; password: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    if (mockUsers.some((u) => u.email === data.email)) {
      throw new Error('Email already in use');
    }

    if (mockUsers.some((u) => u.username === data.username)) {
      throw new Error('Username already taken');
    }

    const newUser = {
      id: (mockUsers.length + 1).toString(),
      ...data,
    };

    mockUsers.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    localStorage.setItem('personaverse_current_user', JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  },

  logout: async () => {
    localStorage.removeItem('personaverse_current_user');
    return true;
  },
};

// User Service
export const userService = {
  getUserProfile: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
    return { ...mockUserProfile };
  },

  updateUserProfile: async (updates: Partial<UserProfile>) => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
    Object.assign(mockUserProfile, updates);
    return { ...mockUserProfile };
  },

  addTokens: async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
    mockUserProfile.tokensAvailable += amount;
    return { ...mockUserProfile };
  },

  changePlan: async (planType: 'free' | 'standard' | 'premium') => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
    mockUserProfile.plan = planType;
    return { ...mockUserProfile };
  },
};

// History Service
export const historyService = {
  getUserHistory: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
    return [...mockHistoryItems];
  },

  downloadFile: (fileUrl: string) => {
    console.log(`Downloading file: ${fileUrl}`);
    // In a real app, this would trigger a file download
    alert(`Downloading file: ${fileUrl}`);
  },
};

// File Service
export const fileService = {
  uploadFile: async (file: File, progressCallback: (progress: number) => void) => {
    // Simulate file upload with progress updates
    for (let i = 0; i <= 100; i += 10) {
      progressCallback(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return {
      fileUrl: URL.createObjectURL(file),
    };
  },
};





// Pricing Service
export const pricingService = {
  getPricingPlans: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
    return [...mockPlans];
  },

  startCheckout: async (planId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
    return {
      checkoutUrl: `/checkout?plan=${planId}`,
    };
  },
};

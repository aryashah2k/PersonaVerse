import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import { Persona } from '@/types/supabase';
import { RootState } from '@/store';

// Define available models
export type Model = 'gpt-4o' | 'gpt-mini' | 'deepseek';

interface PersonaState {
  personas: Persona[];
  selectedPersonas: string[];
  selectedModel: Model;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PersonaState = {
  personas: [],
  selectedPersonas: [],
  selectedModel: 'gpt-4o',
  status: 'idle',
  error: null,
};

// Async thunk to fetch all personas from Supabase
export const fetchPersonas = createAsyncThunk(
  'persona/fetchPersonas',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .order('name');

      if (error) {
        return rejectWithValue(error.message);
      }

      return data as Persona[];
    } catch (error) {
      return rejectWithValue('Failed to fetch personas');
    }
  }
);

// Define the mock personas
const mockPersonas: Persona[] = [
  {
    id: 'persona-1',
    name: 'Executive Leader',
    description: 'Business-oriented perspective with strategic insight',
    avatar_url: null,
    location: 'Corporate HQ',
    job_title: 'CEO',
    created_at: new Date().toISOString()
  },
  {
    id: 'persona-2',
    name: 'Technical Expert',
    description: 'Deep technical analysis and implementation details',
    avatar_url: null,
    location: 'Engineering Dept',
    job_title: 'Senior Developer',
    created_at: new Date().toISOString()
  },
  {
    id: 'persona-3',
    name: 'UX Designer',
    description: 'User experience and design perspective',
    avatar_url: null,
    location: 'Design Studio',
    job_title: 'UX/UI Lead',
    created_at: new Date().toISOString()
  },
  {
    id: 'persona-4',
    name: 'Marketing Specialist',
    description: 'Market trends and customer engagement insights',
    avatar_url: null,
    location: 'Marketing Dept',
    job_title: 'Marketing Director',
    created_at: new Date().toISOString()
  },
  {
    id: 'persona-5',
    name: 'Financial Analyst',
    description: 'Financial implications and cost-benefit analysis',
    avatar_url: null,
    location: 'Finance Dept',
    job_title: 'Financial Controller',
    created_at: new Date().toISOString()
  },
];

// Create a thunk to set mock personas
export const setMockPersonas = createAsyncThunk(
  'persona/setMockPersonas',
  async (_, { dispatch }) => {
    // Simulate a brief loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPersonas;
  }
);

const personaSlice = createSlice({
  name: 'persona',
  initialState,
  reducers: {
    selectPersona: (state, action: PayloadAction<string>) => {
      // Add persona to selection if not already selected
      if (!state.selectedPersonas.includes(action.payload)) {
        state.selectedPersonas.push(action.payload);
      }
    },
    unselectPersona: (state, action: PayloadAction<string>) => {
      // Remove persona from selection
      state.selectedPersonas = state.selectedPersonas.filter(
        (id) => id !== action.payload
      );
    },
    setSelectedModel: (state, action: PayloadAction<Model>) => {
      state.selectedModel = action.payload;
    },
    resetPersonaSelections: (state) => {
      state.selectedPersonas = [];
      state.selectedModel = 'gpt-4o';
    },
    // Load some mock personas for development, to be removed in production
    setMockPersonas: (state) => {
      state.personas = [
        {
          id: '1',
          name: 'Sarah Johnson',
          job: 'Marketing Manager',
          location: 'New York',
          image_url: 'https://i.pravatar.cc/150?img=1',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Michael Chen',
          job: 'Software Engineer',
          location: 'San Francisco',
          image_url: 'https://i.pravatar.cc/150?img=2',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          job: 'UX Designer',
          location: 'Chicago',
          image_url: 'https://i.pravatar.cc/150?img=3',
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'David Kim',
          job: 'Financial Analyst',
          location: 'Boston',
          image_url: 'https://i.pravatar.cc/150?img=4',
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Jessica Williams',
          job: 'Teacher',
          location: 'Austin',
          image_url: 'https://i.pravatar.cc/150?img=5',
          created_at: new Date().toISOString()
        },
        {
          id: '6',
          name: 'Robert Smith',
          job: 'Doctor',
          location: 'Seattle',
          image_url: 'https://i.pravatar.cc/150?img=6',
          created_at: new Date().toISOString()
        },
        {
          id: '7',
          name: 'Ana Patel',
          job: 'Architect',
          location: 'Denver',
          image_url: 'https://i.pravatar.cc/150?img=7',
          created_at: new Date().toISOString()
        },
        {
          id: '8',
          name: 'James Wilson',
          job: 'Chef',
          location: 'Portland',
          image_url: 'https://i.pravatar.cc/150?img=8',
          created_at: new Date().toISOString()
        },
        {
          id: '9',
          name: 'Olivia Garcia',
          job: 'Journalist',
          location: 'Miami',
          image_url: 'https://i.pravatar.cc/150?img=9',
          created_at: new Date().toISOString()
        },
        {
          id: '10',
          name: 'Benjamin Lee',
          job: 'Photographer',
          location: 'Los Angeles',
          image_url: 'https://i.pravatar.cc/150?img=10',
          created_at: new Date().toISOString()
        },
        {
          id: '11',
          name: 'Sophia Nguyen',
          job: 'Lawyer',
          location: 'Washington DC',
          image_url: 'https://i.pravatar.cc/150?img=11',
          created_at: new Date().toISOString()
        },
        {
          id: '12',
          name: 'Ethan Brown',
          job: 'Graphic Designer',
          location: 'Atlanta',
          image_url: 'https://i.pravatar.cc/150?img=12',
          created_at: new Date().toISOString()
        },
        {
          id: '13',
          name: 'Ava Martinez',
          job: 'Product Manager',
          location: 'Dallas',
          image_url: 'https://i.pravatar.cc/150?img=13',
          created_at: new Date().toISOString()
        },
        {
          id: '14',
          name: 'Lucas Thompson',
          job: 'Researcher',
          location: 'Phoenix',
          image_url: 'https://i.pravatar.cc/150?img=14',
          created_at: new Date().toISOString()
        },
        {
          id: '15',
          name: 'Isabella Clark',
          job: 'HR Director',
          location: 'Philadelphia',
          image_url: 'https://i.pravatar.cc/150?img=15',
          created_at: new Date().toISOString()
        }
      ];
      state.status = 'succeeded';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPersonas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.personas = action.payload;
      })
      .addCase(fetchPersonas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(setMockPersonas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.personas = action.payload;
      });
  },
});

export const {
  selectPersona,
  unselectPersona,
  setSelectedModel,
  resetPersonaSelections
} = personaSlice.actions;

// Selectors
export const selectPersonas = (state: RootState) => state.persona.personas;
export const selectSelectedPersonas = (state: RootState) => state.persona.selectedPersonas;
export const selectPersonaStatus = (state: RootState) => state.persona.status;
export const selectPersonaError = (state: RootState) => state.persona.error;
export const selectSelectedModel = (state: RootState) => state.persona.selectedModel;
export const selectPersonasById = (state: RootState, ids: string[]) =>
  state.persona.personas.filter(persona => ids.includes(persona.id));

export default personaSlice.reducer;

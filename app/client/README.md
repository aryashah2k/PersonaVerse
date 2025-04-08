# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

# ChantriBucket

ChantriBucket is a document analysis platform that leverages AI personas to analyze uploaded documents and provide insights. Users can upload various document types, select AI personas for analysis, and receive customized outputs based on their expectations.

## Features

- **Authentication**: Email/password login and Google SSO via Supabase Auth
- **File Upload**: Support for .txt, .doc/.docx, .pdf, and .xlsx files
- **Persona Selection**: Choose from a variety of AI personas for document analysis
- **Custom Expectations**: Specify the type of response you want from the analysis
- **Token-Based System**: Different plans offer various token limits
- **User Profile Management**: Update personal information and profile picture

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Bun](https://bun.sh/) (for package management)
- [Supabase Account](https://supabase.com/) (for backend services)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chantribucket
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Supabase

Follow the detailed instructions in the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) file to:

1. Create a Supabase project
2. Set up the required database tables and bucket storage
3. Configure authentication providers
4. Get your API keys

### 4. Configure Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Start the Development Server

```bash
bun run dev
```

Visit `http://localhost:5173` in your browser to see the application.

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/layouts`: Layout components
  - `/pages`: Application pages
  - `/store`: Redux store setup and slices
  - `/lib`: Utility functions and configuration
  - `/hooks`: Custom React hooks
  - `/types`: TypeScript type definitions

## Main Workflows

### User Authentication

1. Users can sign up with email/password or Google
2. On signup, a user profile is created in the Supabase 'profiles' table
3. When a user logs out, all browser tabs are logged out

### Document Processing

1. User uploads a document on the Home page
2. User selects one or more personas for analysis
3. User specifies their expectation for the output
4. System processes the document with selected personas
5. User receives downloadable results

### Token System

- Each user starts with a free plan that includes limited tokens
- Document processing consumes tokens based on document size
- Users can upgrade to paid plans for more tokens

## Development

### Running Tests

```bash
bun test
```

### Building for Production

```bash
bun run build
```

## Deployment

The application is configured for easy deployment to Netlify:

1. Connect your repository to Netlify
2. Set the environment variables in Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy your site

## License

[MIT License](LICENSE)

## Acknowledgments

- Built with [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/)
- Uses [Supabase](https://supabase.com/) for backend services
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- State management with [Redux Toolkit](https://redux-toolkit.js.org/)

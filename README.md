## Project Title

HandySloth is a modern tool discovery and management platform built with React and XState. It helps users discover, submit, and manage productivity tools, AI applications, and development resources in one centralized location. Users can browse tools by categories, view trending and popular tools, create detailed tool submissions, and track their bookmarked tools through an intuitive dashboard interface.

## Features

- **Tool Discovery**: Browse tools by categories (Data Analytics, AI Tools, Development, Design, Marketing, etc.)
- **Trending & Popular Tools**: View tools sorted by views and clicks with automatic rankings
- **Tool Submission**: Create detailed tool entries with categories, tags, images (up to 5), and social links
- **Tool Details**: View comprehensive tool information including images, descriptions, social links, and community ratings
- **Dashboard**: Track bookmarked tools, recently viewed items, and personal statistics
- **Community Ratings**: Rate tools with 5-star system and leave detailed feedback
- **Category Management**: Browse tools by specific categories with stats and filtering
- **Dark Mode**: Full dark mode support with persistent user preference
- **Responsive Design**: Mobile-first responsive interface built with Tailwind CSS
- **State Management**: Robust state management using XState machines for tools, sidebar, and form handling

## Tech Stack

- React 19
- TypeScript
- Vite 7
- XState 5 (State Machines)
- React Router DOM 7
- Tailwind CSS 4
- Bootstrap 5 (partial UI components)

## How it Works

- **Tool State Management**: Uses XState machines to manage tool fetching, creation, updates, and deletion. The `ToolMachine` handles all tool-related operations with proper loading, idle, and error states.

- **Tool Discovery**: Tools are automatically sorted by views (trending) and clicks (popular). Recent tools are sorted by creation date, allowing users to discover the latest additions.

- **Tool Submission Flow**: When creating a new tool, users fill out a form with:
  - Basic information (name, category, descriptions)
  - Multiple images (limited to 5)
  - Tags (Free, Paid, Open Source, Web-based, etc.)
  - Social links (Telegram, X, Website) stored as an object for easy access
  
- **Tool Display**: Tools are displayed in cards showing logo, name, category, description, and quick-action social links. Each card is clickable to view full details.

- **Dashboard Features**: The dashboard tracks user-specific data including bookmarked tools and recently viewed items, providing a personalized experience.

- **Component Architecture**: Modular component structure with reusable UI components like `SelectablePill`, `AttachImages`, and specialized tool components like `ToolCard` and `ToolDetailedCard`.

## Key Learnings

- **XState Integration**: Managing complex application state with XState machines, including context updates, event handling, and async operations through actors.

- **Type-Safe Forms**: Building controlled form components with TypeScript, ensuring type safety across form fields and state updates.

- **Event Propagation**: Handling click events properly by stopping propagation on nested interactive elements (links, buttons) within clickable cards.

- **State Machine Patterns**: Implementing state machines for different features (tools, sidebar, contact forms) with clear separation of concerns and predictable state transitions.

- **Object-Based Data Structures**: Using object structures (like `SocialLinks`) instead of arrays for better data access patterns, then converting to required formats when needed.

- **Modular Component Design**: Creating reusable, composable components that can be easily maintained and extended, following single responsibility principle.

- **TypeScript Type System**: Leveraging TypeScript's type system with unions, interfaces, and utility types (`Omit`, `Pick`) to create flexible yet type-safe data models.

- **Dynamic Route Handling**: Using React Router with dynamic parameters to create tool detail pages with proper error handling for missing resources.

## Setup & Run

#### 1. Clone the repository

    git clone https://github.com/your-username/handy-sloth.git

#### 2. Navigate into the project folder

    cd HandySloth

#### 3. Install dependencies

    npm install

#### 4. Start the development server

    npm run dev

The app will be available at `http://localhost:5173` (Vite default port).

#### 5. Build for production

    npm run build

This creates an optimized production build in the `dist` folder.

#### 6. Preview production build

    npm run preview

This serves the production build locally for testing.

## Project Structure

```
HandySloth/
├── src/
│   ├── assets/          # Images and icons
│   ├── components/      # Reusable React components
│   │   ├── Tools/       # Tool-specific components
│   │   ├── Profile/     # Dashboard profile components
│   │   ├── Sidebar/     # Navigation sidebar
│   │   └── ui/          # Generic UI components
│   ├── context/         # React context providers
│   ├── dummy-data/      # Mock data for development
│   ├── layouts/         # Layout components
│   ├── machines/        # XState state machines
│   ├── pages/           # Route page components
│   ├── services/        # API and service functions
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

## License

This project is open source and available under the [MIT License](https://choosealicense.com/licenses/mit/)

## Links

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://sameer-shamshad-portfolio.vercel.app/)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/sameer-shamshad/)

[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=X&logoColor=white)](https://x.com/samu101325?s=21)

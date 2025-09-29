# Generate Prompt for Blog

A professional marketing content generator designed. This application streamlines the creation of marketing prompts for courses and events across multiple communication channels.

## Description

Generate Prompt for Blog is an intelligent marketing content creation tool that helps educational institutions and organizations create professional, channel-optimized marketing content. The application generates detailed prompts that can be used with AI writing tools to produce consistent, high-quality marketing materials for courses and events.

## Features

### Content Generation

- **Course Marketing Prompts**: Generate comprehensive prompts for course advertisements including course details, schedules, highlights, and registration information
- **Event Marketing Prompts**: Create engaging event promotion prompts with event details, agendas, offers, and participant information
- **Multi-Channel Optimization**: Customize content for different platforms including Facebook fanpages, community groups, Zalo OA, and email marketing

### Template System

- **Course Templates**: Multiple writing styles including problem-solution format, curiosity-driven approach, and natural advertising tone
- **Event Templates**: Various approaches including excitement generation, informative content, and community-focused messaging
- **Channel-Specific Formatting**: Automatic adaptation for different social media platforms and communication channels

### Advanced Options

- **Content Length Control**: Choose between short (50-100 words), medium (100-200 words), or detailed (200-300 words) content
- **Emoji Integration**: Optional emoji inclusion for enhanced engagement
- **Urgency Features**: Add urgency elements to create time-sensitive campaigns
- **Hashtag Management**: Automatic hashtag integration with customizable additional tags

### Data Management

- **Persistent Storage**: Save and manage course and event data with localStorage integration
- **Sidebar Navigation**: Quick access to saved items with instant form population
- **Data Export/Import**: Backup and restore functionality for saved content
- **Auto-fill Functionality**: Click saved items to automatically populate all form fields and settings

### User Interface

- **Modern SaaS Design**: Clean, professional interface with dark mode support
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Real-time Preview**: Instant prompt generation with copy-to-clipboard functionality
- **Toast Notifications**: User-friendly feedback system for all actions

## Tech Stack

### Frontend Framework

- **React 19.1.1**: Modern React with latest features and hooks
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite**: Fast build tool with Hot Module Replacement (HMR)

### UI Components

- **Radix UI**: Accessible, unstyled UI primitives including Dialog, Dropdown Menu, Tabs, and Tooltip components
- **Tailwind CSS 4.1.13**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Beautiful, customizable SVG icons
- **shadcn/ui**: High-quality, reusable UI components built on Radix UI

### Development Tools

- **ESLint**: Code linting with modern JavaScript/TypeScript rules
- **Class Variance Authority**: Utility for managing component variants
- **clsx & tailwind-merge**: Efficient className manipulation and merging

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/thanhhh2512/Generate-prompt-for-blog.git
cd Generate-prompt-for-blog
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Local Development

The application supports hot module replacement for instant feedback during development. All changes to React components, TypeScript files, and Tailwind styles will be reflected immediately in the browser.

### Available Scripts

- `npm run dev`: Start development server with HMR
- `npm run build`: Build the application for production
- `npm run lint`: Run ESLint to check code quality
- `npm run preview`: Preview the production build locally

## Deployment

The application is deployed and accessible at:

**Live Demo**: [https://generate-prompt-for-blog.vercel.app/](https://generate-prompt-for-blog.vercel.app/)

### Build for Production

To create a production build:

```bash
npm run build
```

The built files will be generated in the `dist` directory and can be deployed to any static hosting service.

## Contributing

We welcome contributions to improve the Generate Prompt for Blog application. Please follow these guidelines:

1. **Fork the Repository**: Create a personal fork of the project
2. **Create Feature Branch**: Create a new branch for your feature or bug fix

```bash
git checkout -b feature/your-feature-name
```

3. **Follow Code Standards**: Ensure your code follows the established TypeScript and React patterns
4. **Test Thoroughly**: Test your changes across different scenarios and devices
5. **Submit Pull Request**: Create a detailed pull request with clear description of changes

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing component structure and naming conventions
- Ensure responsive design compatibility
- Add appropriate error handling and user feedback
- Update documentation for significant changes

---

**Developed By TA TRONG THANH** - Streamlining marketing content creation for educational excellence.

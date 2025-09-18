# CUSC Prompt Generator

A web application that generates standardized prompts for CUSC (Trung tâm Công nghệ Phần mềm Đại học Cần Thơ) course marketing content. This tool helps marketing staff create consistent, high-quality prompts that can be used with AI tools like ChatGPT or Gemini to produce marketing posts.

## Features

### Core Functionality
- **Course Information Form**: Input course details including name, dates, duration, learning mode, highlights, and registration links
- **Channel Selection**: Choose from 4 different marketing channels:
  - Main Fanpage (formal, detailed)
  - Community Group (friendly, interactive)
  - Zalo OA (short, strong CTA)
  - Email Marketing (personalized, professional)
- **Template Styles**: Select from 3 content approaches:
  - Inspirational (storytelling, emotion-driven)
  - Quick Benefits (problem-solution with bullet points)
  - Curiosity-Driven (question-based engagement)
- **Extra Options**: Customize content length, emoji usage, and urgency level
- **Prompt Generation**: Creates ready-to-use prompts with CUSC branding guidelines
- **Copy to Clipboard**: Easy copying of generated prompts

### Quality Assurance
- Enforces correct spelling and formatting
- Ensures proper organization names are used exactly as specified
- Automatically includes required hashtags (#CUSC + course-specific tags)
- Maintains consistent tone and structure across all channels

## Tech Stack

- **Frontend**: Vite + React 18 with TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Build Tool**: Vite (faster development and building)
- **Deployment Ready**: Compatible with Vercel, Netlify, AWS Amplify

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Fill Course Information**: Enter all required course details including name, start date, duration, and registration link
2. **Select Channel**: Choose the marketing channel where the content will be published
3. **Choose Template**: Pick the content style that best fits your marketing goal
4. **Configure Options**: Set content length, emoji preferences, and urgency level
5. **Generate Prompt**: Click the generate button to create your custom prompt
6. **Copy & Use**: Copy the generated prompt and paste it into ChatGPT, Gemini, or your preferred AI tool

## Adding New Templates or Channels

### Adding a New Channel

Edit `app/data/channels.ts`:

```typescript
{
  id: 'new-channel',
  name: 'New Channel Name',
  description: 'Description of the channel',
  characteristics: [
    'Characteristic 1',
    'Characteristic 2',
    // ... more characteristics
  ]
}
```

### Adding a New Template

Edit `app/data/templates.ts`:

```typescript
{
  id: 'new-template',
  name: 'Template Name',
  description: 'Template description',
  structure: 'Detailed explanation of the template structure and approach'
}
```

### Extending Prompt Generation

The prompt generation logic is in `app/utils/promptGenerator.ts`. You can modify this file to:
- Add new formatting rules
- Include additional channel-specific requirements
- Customize the prompt structure for new templates

## Project Structure

```
├── src/
│   ├── data/
│   │   ├── channels.ts      # Channel definitions
│   │   └── templates.ts     # Template definitions
│   ├── utils/
│   │   └── promptGenerator.ts # Prompt generation logic
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Content Guidelines

The application ensures all generated prompts follow CUSC branding guidelines:

### Organization Names (Must be exact)
- **Trung tâm Công nghệ Phần mềm Đại học Cần Thơ (CUSC)**
- **Lập trình viên Quốc tế - APTECH**
- **Mỹ thuật Đa phương tiện Quốc tế - ARENA**

### Required Elements
- Always include #CUSC hashtag
- Course-specific hashtags
- Proper spelling and grammar
- Consistent formatting
- Appropriate tone for selected channel

## Deployment

This application is configured for easy deployment on AWS Amplify:

1. Connect your repository to AWS Amplify
2. The build settings are automatically detected
3. Deploy with a single click

Alternative deployment options:
- Vercel
- Netlify
- Any Node.js hosting platform

## Contributing

To extend the application:

1. Add new channels in `app/data/channels.ts`
2. Add new templates in `app/data/templates.ts`
3. Modify prompt generation logic in `app/utils/promptGenerator.ts`
4. Update types in `app/types.ts` if needed
5. Test thoroughly with different combinations

## License

This project is built for CUSC internal use.
# Procco B2B Marketplace

Version: 1.0.0

## Description

Procco is a B2B marketplace platform designed for the Finnish market. It facilitates service requests and offers between buyers and sellers.

## Key Features

- Create service requests with AI-assisted clarifying questions
- Buyer and Seller dashboards
- Responsive design with dark mode

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- OpenAI API integration

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```
4. Run the development server: `npm run dev`
5. Build for production: `npm run build`

## Current State

This version (1.0.0) includes a fully functional B2B marketplace with the following pages:

- Main Dashboard
- Create Service Request
- Buyer Dashboard
- Seller Dashboard

The platform uses AI to generate clarifying questions and summarize service requests. It's styled with a dark theme and uses Framer Motion for animations.

## Known Limitations

- Authentication and user management are not implemented
- Data persistence is currently handled through localStorage

## Future Improvements

- Implement user authentication
- Add a backend database for data persistence
- Enhance the offer submission and acceptance process
- Implement real-time notifications
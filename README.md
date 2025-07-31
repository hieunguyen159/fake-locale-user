# UserMint - Fake User Data Generator

This is a Next.js web application that allows you to generate fake user data based on selected regions and countries. It detects your browser's current location to pre-select the region and country, and provides options to copy individual data fields or the entire generated data as JSON.

## Features

- **Location-based Data Generation:** Select a region and country to generate relevant fake user data.
- **Browser Location Detection:** Automatically detects your browser's locale to set default region and country.
- **Copy Individual Fields:** Easily copy specific data fields (e.g., full name, email) to your clipboard.
- **Copy as JSON:** Copy all generated user data as a JSON object.
- **Responsive UI:** Designed to work well on various screen sizes.
- **Stats Tracking:** Track generation statistics with Supabase integration.
- **Geist Font:** Beautiful typography with Geist font family.

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS, Shadcn/ui components
- **Font:** Geist Sans & Mono
- **Data:** TypeScript constants (converted from txt files)

## Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm or Yarn
- Supabase account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/usermint.git
   cd usermint
   ```

2. Install dependencies:

   ```bash
   npm install

   # or

   yarn install
   ```

3. Set up Supabase:

   - Create a new Supabase project
   - Create a `stats` table with the following schema:
     ```sql
     CREATE TABLE stats (
       id BIGSERIAL PRIMARY KEY,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       generated_counts INT4 NOT NULL
     );
     ```

4. Configure environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Running the Development Server

```bash
npm run dev

# or

yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Building for Production

```bash
npm run build

# or

yarn build
```

This command builds the application for production to the `.next` folder.

### Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Project Structure

- `app/`: Contains the main application pages and layout.
  - `layout.tsx`: Root layout for the application.
  - `page.tsx`: The main page component for the fake user data generator.
  - `globals.css`: Global CSS styles.
- `components/`: React components including UI components.
  - `ui/`: Shadcn UI components used in the project.
  - `stats-display.tsx`: Statistics display component.
- `lib/`: Utility functions and configurations.
  - `actions.ts`: Data loading functions using TypeScript constants.
  - `stats.ts`: Statistics management with Supabase integration.
  - `supabase.ts`: Supabase client configuration.
- `data/constants/`: TypeScript constants converted from txt files.
  - `countries/`: Country-specific data constants.
  - `index.ts`: Main exports and country data mapping.
- `hooks/`: Custom React hooks.
  - `use-stats.ts`: Statistics management hook.
  - `use-user-generator.ts`: Main user generation logic.

## Data Management

The application uses TypeScript constants for better performance and type safety. Country data includes:

- Cities
- First names (male/female)
- Last names
- States/regions
- Street names

Statistics are tracked using Supabase with local storage as backup.

## Contributing

Feel free to fork the repository, make improvements, and submit pull requests.

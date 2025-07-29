# Muxly - Fake User Data Generator

This is a Next.js web application that allows you to generate fake user data based on selected regions and countries. It detects your browser's current location to pre-select the region and country, and provides options to copy individual data fields or the entire generated data as JSON.

## Features

-   **Location-based Data Generation:** Select a region and country to generate relevant fake user data.
-   **Browser Location Detection:** Automatically detects your browser's locale to set default region and country.
-   **Copy Individual Fields:** Easily copy specific data fields (e.g., full name, email) to your clipboard.
-   **Copy as JSON:** Copy all generated user data as a JSON object.
-   **Responsive UI:** Designed to work well on various screen sizes.

## Getting Started

### Prerequisites

-   Node.js (v18.x or later)
-   npm or Yarn

### Installation

1.  Clone the repository:
    \`\`\`bash
    git clone https://github.com/your-username/muxly.git
    cd muxly
    \`\`\`
2.  Install dependencies:
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

### Running the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Building for Production

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

This command builds the application for production to the `.next` folder.

### Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Project Structure

-   `app/`: Contains the main application pages and layout.
    -   `layout.tsx`: Root layout for the application.
    -   `page.tsx`: The main page component for the fake user data generator.
    -   `globals.css`: Global CSS styles.
-   `components/ui/`: Shadcn UI components used in the project.
-   `lib/actions.ts`: Server Actions for loading country-specific data from text files.
-   `data/`: Contains country-specific data in `.txt` files, organized by country code.
    -   `[COUNTRY_CODE]/lists/`: Subfolders containing lists like `cities.txt`, `female_first.txt`, `last.txt`, `male_first.txt`, `states.txt`, `street.txt`.

## Contributing

Feel free to fork the repository, make improvements, and submit pull requests.

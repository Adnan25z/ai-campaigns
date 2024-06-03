# AI Campaigns

AI Campaigns is a web application designed to help non-profits create impactful campaigns using AI. The application allows users to input their organization details, generates campaign ideas, and provides an interface to edit and customize these ideas.
![Gameplay Image](assets/campaign.jpg)

## Features

- Generate campaign templates based on user input
- Customize generated campaigns
- Store user data in Google Sheets
- Use AI to create aspirational and impactful campaign messages

## Technologies Used

- **Next.js:** Framework for building the React application
- **OpenAI API:** For generating campaign content
- **Google Sheets API:** For storing user input data
- **React:** Frontend library for building the user interface
- **JavaScript:** For handling logic and API calls

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Adnan25z/ai-campaigns.git
    cd ai-campaigns
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env.local` file in the root directory and add the following environment variables:

    ```env
    OPENAI_API_KEY=your_openai_api_key
    NEXT_PUBLIC_SPREADSHEET_ID=your_google_spreadsheet_id
    NEXT_PUBLIC_SHEET_ID=your_google_sheet_id
    NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL=your_google_client_email
    NEXT_PUBLIC_GOOGLE_SERVICE_PRIVATE_KEY=your_google_service_private_key
    ```

4. Run the application:

    ```bash
    npm run dev
    ```
## Core Functionality

### Campaign Generation:
- **OpenAI Integration:** Uses the OpenAI API to generate campaign ideas based on user input. This includes prompts to create a campaign template and SMS examples.
- **API Calls:** Functions `generateAction` and `generateSecond` handle the API requests to OpenAI for initial and detailed campaign generation.

### User Data Handling:
- **Google Sheets Integration:** Initializes and interacts with Google Sheets to store and manage user input data. Functions to append data to the spreadsheet are defined for organizing user information.

### Frontend Implementation:
- **React Components:** Various components for user input forms, including email, location, non-profit name, revenue range, purpose, activities, fundraising goal, duration, and focus.
- **State Management:** Uses React hooks (`useState`) for managing input states and application flow.

## Usage

1. Enter your email address.
2. Provide your organization's details including location, name, revenue, purpose, and current activities.
3. Generate an initial campaign template using AI.
4. Specify your fundraising goal, campaign duration, and focus.
5. Generate a detailed campaign with SMS examples using AI.

With our easy-to-use interface and powerful AI technology, you'll be able to generate multiple campaign ideas in minutes. Plus, with the ability to edit and customize the generated content, you can ensure that your campaign is a perfect fit for your organization.

So what are you waiting for? Sign up now and start empowering your non-profit with AI-powered campaigns! 🤖

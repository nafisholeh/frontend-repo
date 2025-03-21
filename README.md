# EBUDDY Frontend Application

This is a Next.js project demonstrating Firebase authentication, Redux state management, and Material UI integration.

## Features

- User authentication (sign up, login, logout)
- Dashboard with user information
- Profile management
- Responsive design with Material UI

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

### Firebase Configuration

This application uses Firebase Authentication. To run the project, you need to set up your own Firebase project and configure the application with your API keys.

#### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup steps
3. Enter a project name (e.g., "ebuddy-app")
4. Choose whether to enable Google Analytics (optional)
5. Create the project

#### Step 2: Add a Web App to Your Firebase Project

1. In your Firebase project console, click on the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "ebuddy-web")
3. You can check "Also set up Firebase Hosting" if you plan to deploy the app (optional)
4. Click "Register app"

#### Step 3: Get Your Firebase Configuration

After registering your app, Firebase will provide you with your app's configuration. If you don't see it immediately:

1. Go to your Firebase project console
2. Click on the gear icon (⚙️) next to "Project Overview" to open Project settings
3. Scroll down to the "Your apps" section
4. Select your web app
5. Under the "SDK setup and configuration" section, you'll find your Firebase configuration object:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

#### Step 4: Enable Email/Password Authentication

This step is **crucial** - many "CONFIGURATION_NOT_FOUND" errors occur because Firebase Authentication has not been explicitly set up:

1. In the Firebase console, go to "Authentication" in the left sidebar
2. Click on the "Sign-in method" tab
3. Click on "Email/Password" and enable it
4. Save your changes
5. **Important:** Make sure you see "Email/Password" listed as "Enabled" in the providers list

> **Note:** Even if you've set up your environment variables correctly, Firebase will throw a "CONFIGURATION_NOT_FOUND" error if you haven't activated at least one authentication method in the Firebase Console.

#### Step 5: Configure Your Local Environment

Create a `.env.local` file in the root of the project with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace each value with the corresponding value from your Firebase configuration.

> **Important Security Note**: 
> - These environment variables are exposed to the browser since they're prefixed with `NEXT_PUBLIC_`.
> - This is normal for Firebase client-side SDKs, as these keys are meant to be public.
> - The security of your Firebase project relies on proper security rules in Firebase, not on keeping these keys secret.
> - For additional security, configure Firebase Authentication to only allow specific domains.

### Using Firebase Authentication in the Application

Once you've completed the Firebase setup, you can use the application's authentication features.

#### How to Register a New User

1. Start the application by running `npm run dev` in your terminal
2. Navigate to the registration page at http://localhost:3000/register
3. Fill in the registration form with:
   - **Full Name**: Your name (will be displayed in the dashboard)
   - **Email**: A valid email address
   - **Password**: Choose a password (minimum 6 characters)
   - **Confirm Password**: Type the same password again
4. Click the "Register" button
5. If successful, you will be automatically logged in and redirected to the dashboard

#### Common Registration Issues

- **"Email already in use"**: The email address is already registered. Try logging in instead.
- **"Password too weak"**: Choose a stronger password (at least 6 characters).
- **"Firebase configuration not found"**: Check your `.env.local` file and ensure all environment variables are correctly set.

#### How to Log In

1. Navigate to the login page at http://localhost:3000/login
2. Enter your registered email and password
3. Click the "Sign In" button
4. If successful, you will be redirected to the dashboard

#### Testing with Sample Users

If you want to test without creating a new account, you can set up test users in Firebase:

1. Go to the Firebase Console > Authentication > Users
2. Click "Add User"
3. Enter an email and password for your test user
4. Use these credentials to log in to the application

#### Managing User Accounts

- **Viewing User Profile**: After logging in, click on "Profile" in the navigation bar
- **Updating Profile**: On the Profile page, you can update your display name
- **Logging Out**: Click the "Logout" button on the Profile page

## Running the Development Server

After setting up your Firebase configuration, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Troubleshooting Firebase Authentication

If you encounter Firebase authentication errors, check the following:

1. **API Key Errors** (e.g., "Firebase: Error (auth/api-key-not-valid)"): 
   - Ensure your `.env.local` file exists with the correct Firebase configuration
   - Verify that all environment variables are correctly set
   - Make sure there are no typos in your API keys

2. **Configuration Not Found Error** (e.g., "Firebase: Error (auth/configuration-not-found)" or "CONFIGURATION_NOT_FOUND")**:
   - This error typically indicates that your Firebase project isn't properly configured or there's an issue with your app registration
   - **Common Solution**: The most common cause is that Firebase Authentication hasn't been properly set up
     - Go to Firebase Console > Authentication
     - Click on the "Sign-in method" tab
     - Enable at least one authentication method (Email/Password)
     - Save your changes
     - Restart your app
   - Other Solutions:
     - Make sure you've completed all steps in the Firebase Console, including registering your web app
     - Verify the app ID in your `.env.local` file matches your Firebase app
     - Ensure your Firebase project is active and not disabled
     - Try clearing your browser cache or using incognito mode to avoid caching issues
     - If you've recently created your Firebase project, wait a few minutes as changes can take time to propagate

3. **Domain Restrictions**:
   - If you've restricted your Firebase project to specific domains, ensure `localhost` is allowed during development

4. **Firebase Rules**:
   - Check that your Firebase authentication rules are configured correctly

5. **Browser Console**:
   - Look for additional error details in your browser's developer console
   - The full error message often contains more specific information about what's wrong

6. **Restart Development Server**:
   - Sometimes simply restarting your development server after setting environment variables can resolve authentication issues

7. **Registration Problems**:
   - If you can't register new users, ensure Email/Password provider is enabled in Firebase Authentication
   - Check if your Firebase plan allows new user registration (Spark plan has limitations)

8. **Verification Needed**:
   - If you enabled email verification in Firebase, users might need to verify their email before they can log in

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/overview/)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

When deploying, remember to configure your environment variables in your hosting provider's settings.

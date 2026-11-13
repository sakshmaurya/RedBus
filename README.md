# Redbus

We have Cloned a bus ticketing and hiring platform called redbus.
redBus is an Indian online bus ticketing platform providing ticket booking facility through its website, iOS and Android mobile apps. It connects bus travellers with a network of over 2500 bus operators, across India, countries in South East Asia and Latin America.
It connects bus travellers with a network of over 2500 bus operators, across India, countries in South East Asia and Latin America.

In this project , we have tried to make a perfect clone of redbus.in.

### Live Link :

# Steps to install the project:

## Install basic Software:
* Install NodeJS
* Install VS Code
* Install Git

## Clone the following git repository inside any folder:

* https://github.com/sakshmaurya/RedBus.git

##  Open the cloned git repo in VS Code and install the required dependencies.

* #### Open a terminal and make sure you are in the working directory folder (Inside redbus folder go to : redbus/front-end-redbus and redbus/back-end-redbus), run this command to install the required project dependencies in both back-end and front-end folder.
  * npm install

* #### Now, Run npm start in back-end-redbus as well as front-end-redbus folder in two separate terminals to start the backend and frontend

* #### Now you can access the app at this URL: http://localhost:3000

## Technologies used

  * React
  * CSS
  * Express
  * MongoDB
  * Mongoose
  * Libraries used

      * Redux
      * React-redux
      * Redux-thunk
      * material-ui/core
      * material-ui/icons
      * material-ui/lab
      * uuid
      * React-dom
      * React-icons
      * react-google-login
      * react-icons
      * react-modal
      * react-scripts
      * react-stripe-checkout
      * cloudinary
      * nodemailer (for notifications)
      * web-push (for push notifications)

## New Features Added

### � Internationalization (i18n)
- **Multi-Language Support**: English and Hindi languages supported throughout the application
- **Dynamic Language Switching**: Change language instantly without page reload
- **Language Persistence**: User language preference saved in database and localStorage
- **Translation Coverage**: All major UI elements translated including navigation, forms, buttons, and messages
- **Fallback System**: English as default language for missing translations
- **Language Selector**: Easy-to-use language selector in the navigation bar

### 🗺️ Interactive Route Planner
- **Google Maps Integration**: Real-time route calculation using Google Maps API
- **Multiple Waypoints**: Add multiple stops between start and destination
- **Traffic Information**: Real-time traffic data with congestion levels (Low/Moderate/Heavy)
- **Alternative Routes**: View multiple route options with distance and duration comparison
- **Route Visualization**: Interactive map display with route polylines and markers
- **Saved Routes**: Authenticated users can save frequently used routes
- **Route Management**: Load, view, and delete saved routes
- **Traffic-Aware ETA**: Estimated travel time based on current traffic conditions

### 🌙 Dark Mode
- **Theme Toggle**: Instant switch between light and dark themes
- **System-Wide Application**: Dark mode applied consistently across all pages and components
- **Theme Persistence**: User theme preference saved in database and localStorage
- **Instant Switching**: No page reload required for theme changes
- **Responsive Design**: Dark mode optimized for desktop, tablet, and mobile
- **Custom CSS**: Comprehensive dark mode styling for all UI elements

### �🌟 Travel Community
- **Verified Traveler System**: Users become verified travelers after completing their first booking, enabling them to create community posts
- **Post Creation**: Verified users can create posts with title, description, route, destination, and images
- **Image Upload**: Posts support multiple image uploads via Cloudinary
- **Engagement**: Like and comment on posts with real-time updates
- **Moderation**: Report inappropriate content for admin review
- **Trending Posts**: View popular posts based on engagement score (likes × 2 + comments)
- **Social Sharing**: Share posts via Web Share API, WhatsApp, Facebook, and copy link
- **Profile Integration**: View community activity stats in profile (posts, likes received, comments)

### 💬 Travel Forum
- **Discussion Categories**: Organized forums for routes, destinations, and travel advice
- **Topic Creation**: Create discussion topics in categories
- **Replies**: Reply to topics with nested comments
- **Moderation**: Admin can pin and lock topics
- **Activity Tracking**: View counts and last activity timestamps

### 🔔 Advanced Notification System
- **Multi-Channel Delivery**: In-app, email, and push notifications
- **User Preferences**: Customize notification settings by category and channel
- **Booking Notifications**: Confirmations, cancellations, schedule changes, journey reminders
- **Community Notifications**: Likes, comments, and replies on posts
- **Notification History**: View all notifications with read/unread status
- **Localization**: Support for English and Hindi languages
- **Delivery Tracking**: Track notification delivery status with retry mechanism

## Environment Variables

### Backend (config.env)
- `DATABASE`: MongoDB connection string
- `DATABASE_PASSWORD`: MongoDB password
- `PORT`: Backend server port (default: 8000)
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_UPLOAD_PRESET`: Cloudinary upload preset

### Frontend (.env.local)
- `REACT_APP_BACKEND_URL`: Backend API URL
- `REACT_APP_GOOGLE_MAPS_API_KEY`: Google Maps API key (required for Route Planner)

## Development Setup

1. Clone the repository
2. Install backend dependencies: `cd back-end-redbus && npm install`
3. Install frontend dependencies: `cd front-end-redbus && npm install`
4. Configure environment variables
5. Start backend: `cd back-end-redbus && npm start`
6. Start frontend: `cd front-end-redbus && npm start`
7. Access application at: http://localhost:3000

## Google Maps API Setup

To enable the Route Planner feature:
1. Create a Google Cloud Platform project
2. Enable Maps JavaScript API and Directions API
3. Create an API key
4. Add the API key to frontend `.env.local`: `REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here`
5. Restrict the API key for security

## Deployment Notes

- Ensure MongoDB connection string is properly configured
- Set up Cloudinary for image uploads
- Configure Google Maps API key for Route Planner
- Set environment variables for production
- Build frontend: `npm run build`
- Deploy backend to a Node.js hosting service
- Deploy frontend to a static hosting service


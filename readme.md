# Dating Profile Management Application

## Overview

This project implements a profile management application that allows users to view profiles, access detailed profile information, and manage favorite profiles. The application is built with a focus on responsiveness, code quality, and a clean design.

## Key Components

1. **index.html**

   - The main entry point of the application.
   - Includes a responsive meta tag and links to the CSS files.
   - Contains a container for dynamic content rendering.

2. **CSS Files**

   - **main.css**: Contains global styles and layouts for desktop.
   - **profile.css**: Styles specifically related to the profile page.
   - **responsiveness.css**: Contains mobile-specific styles using media queries.

3. **JavaScript Files**
   - **api.js**: Handles API calls for profiles and favorites.
   - **profileList.js**: Responsible for rendering the profile overview page, including profile listing and pagination.
   - **singleProfile.js**: Renders individual profile pages and manages profile details, including toggling favorite status.
   - **favorites.js**: Manages functionality for adding/removing profiles as favorites and updates the UI accordingly.

## Key Implementation Points

- **API Integration**: Utilizes the Fetch API to retrieve data from the profiles and favorites APIs.
- **Routing**: A simple router manages navigation between the profile overview and single profile pages.
- **Responsive Design**: Employs CSS Grid and Flexbox for layout, ensuring a smooth experience on both desktop and mobile devices.
- **Favorite Functionality**: Implements favorite toggling using local storage and API updates for maintaining state.
- **Performance Optimization**: Lazy loads images to improve application performance and caching the APIs.
- **Error Handling**: Incorporates error handling for all API requests to enhance user experience.
- **Modern JavaScript**: Utilizes ES6+ features such as async/await and destructuring for cleaner code.

## How to Run the Project

1. **Clone the repository** or download the ZIP file containing the project.
2. **Extract the files** to a local directory.
3. Open `index.html` in a web browser to view the application.

## Design Choices

- The application is designed to be user-friendly and visually appealing, with an emphasis on clean and organized code. The modular structure promotes maintainability and scalability.
- Responsive design techniques were prioritized to ensure a consistent user experience across devices, particularly on mobile screens.

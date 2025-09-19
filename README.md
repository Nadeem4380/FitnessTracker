# 🏃‍♂️ FitnessTracker

**A comprehensive React Native fitness tracking application with GitHub data synchronization**

[![React Native](https://img.shields.io/badge/React%20Native-0.72+-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2049+-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![GitHub](https://img.shields.io/badge/Data%20Storage-GitHub%20API-green.svg)](https://docs.github.com/en/rest)

## 📱 Overview

FitnessTracker is a modern, feature-rich fitness tracking application built with React Native and Expo. It offers comprehensive workout logging, progress analytics, goal setting, and seamless data synchronization through GitHub API integration.

## ✨ Features

### 🎯 **Core Functionality**
- **Workout Logging** - Track 10+ exercise types with duration, calories, and intensity
- **Daily Stats** - Monitor steps, water intake, calories burned, and workout minutes
- **Goal Setting** - Set and track personalized fitness goals
- **Progress Analytics** - Visual charts and progress tracking
- **User Profile** - Manage personal information and preferences

### 📊 **Analytics & Visualization**
- **Progress Charts** - Line charts for weekly activity trends
- **Goal Progress** - Visual progress bars for daily/weekly goals
- **Exercise Breakdown** - Pie charts for workout intensity distribution
- **Calorie Tracking** - Bar charts for weekly calorie burn analysis
- **Workout Statistics** - Comprehensive exercise analytics

### 🔄 **Data Management**
- **GitHub Integration** - Automatic data backup and synchronization
- **Real-time Updates** - Live data persistence and retrieval
- **Offline Support** - Local data caching with sync when online
- **Data Export** - JSON format data storage in GitHub repository

### 🎨 **User Experience**
- **Modern UI** - Beautiful gradient themes and smooth animations
- **Responsive Design** - Optimized for all device sizes
- **Intuitive Navigation** - Tab-based navigation with modal forms
- **Dark/Light Themes** - Customizable appearance
- **Performance Optimized** - Fast loading and smooth interactions

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Charts**: react-native-chart-kit
- **Styling**: StyleSheet with LinearGradient
- **Icons**: Expo Vector Icons (Ionicons)
- **Data Storage**: GitHub API
- **Authentication**: GitHub Personal Access Token
- **State Management**: React Hooks (useState, useEffect)

## 📦 Complete Installation Guide

### 📋 Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** - Install with `npm install -g expo-cli`
- **GitHub Account** - For data storage
- **Mobile Device** or **Emulator** - For testing

### 🚀 Step-by-Step Installation

#### **Step 1: Data Repository Setup**

First, set up your data storage repository:

1. **Create the data repository** (if not already created):
   ```bash
   # Go to GitHub and create a new repository named "FitnessTracker-data"
   # Or use the existing one at: https://github.com/Nadeem4380/FitnessTracker-data
   ```

2. **Clone and initialize the data repository**:
   ```bash
   git clone https://github.com/Nadeem4380/FitnessTracker-data.git
   cd FitnessTracker-data
   ```

3. **Create initial data files**:
   ```bash
   # Create workouts.json
   echo '[]' > workouts.json
   
   # Create stats.json
   cat > stats.json << 'EOF'
   [
     {
       "date": "2025-01-19",
       "steps": 0,
       "caloriesBurned": 0,
       "workoutMinutes": 0,
       "waterIntake": 0
     }
   ]
   EOF
   
   # Create goals.json
   cat > goals.json << 'EOF'
   {
     "dailySteps": 10000,
     "dailyCalories": 500,
     "dailyWorkouts": 60,
     "dailyWater": 8,
     "weeklyWorkouts": 5
   }
   EOF
   
   # Create profile.json
   cat > profile.json << 'EOF'
   {
     "name": "Your Name",
     "age": 25,
     "height": 170,
     "weight": 70,
     "activityLevel": "moderate",
     "avatar": "https://github.com/Nadeem4380.png"
   }
   EOF
   ```

4. **Commit and push initial data**:
   ```bash
   git add .
   git commit -m "Initialize fitness tracker data files"
   git push origin main
   ```

#### **Step 2: GitHub Token Configuration**

1. **Generate GitHub Personal Access Token**:
   - Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (Full control of private repositories)
   - Set expiration as needed
   - Generate and **copy the token immediately**

2. **Test your token** (optional):
   ```bash
   curl -H "Authorization: token YOUR_TOKEN_HERE" https://api.github.com/user
   ```

#### **Step 3: Main App Repository Setup**

1. **Clone the main FitnessTracker repository**:
   ```bash
   git clone https://github.com/Nadeem4380/FitnessTracker.git
   cd FitnessTracker
   ```

2. **Install dependencies**:
   ```bash
   # Install main dependencies
   npm install
   
   # Install Expo-specific packages
   npx expo install expo-linear-gradient @expo/vector-icons
   
   # Install additional required packages
   npm install react-native-chart-kit js-base64 @react-native-async-storage/async-storage
   ```

#### **Step 4: Environment Configuration**

1. **Create environment file**:
   ```bash
   # Create .env file in the root directory
   cat > .env << 'EOF'
   GITHUB_TOKEN=your_github_personal_access_token_here
   GITHUB_USERNAME=Nadeem4380
   DATA_REPO_NAME=FitnessTracker-data
   EOF
   ```

2. **Update the environment file with your token**:
   - Open `.env` file in your text editor
   - Replace `your_github_personal_access_token_here` with your actual GitHub token

3. **Update app configuration** (if needed):
   ```javascript
   // In your github-api-handler.js or similar file
   const GITHUB_CONFIG = {
     owner: 'Nadeem4380',
     repo: 'FitnessTracker-data',
     token: process.env.GITHUB_TOKEN
   };
   ```

#### **Step 5: Project Dependencies Verification**

Ensure all required packages are installed:

```bash
# Check package.json dependencies
npm list --depth=0

# Install any missing packages
npm install react-native-chart-kit
npm install js-base64
npm install @react-native-async-storage/async-storage
npx expo install expo-linear-gradient
npx expo install @expo/vector-icons
```

#### **Step 6: Testing and Verification**

1. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

2. **Test on device/emulator**:
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

3. **Verify GitHub integration**:
   - Open the app
   - Try logging a workout
   - Check if data appears in your `FitnessTracker-data` repository

#### **Step 7: Final Configuration**

1. **Customize your profile**:
   - Open the app
   - Go to Profile tab
   - Update your personal information
   - Set your fitness goals

2. **Test all features**:
   - ✅ Log a workout
   - ✅ Update daily stats
   - ✅ View progress charts
   - ✅ Check data sync with GitHub

### 🔧 Development Commands

```bash
# Start development server
npx expo start

# Start with cleared cache
npx expo start --clear

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Build for production
npx expo build

# Check for updates
npx expo install --fix
```

### 🐛 Troubleshooting Guide

#### **Common Issues & Solutions**

**🚨 Issue: "Module not found" errors**
```bash
# Solution: Clear cache and reinstall
npm start -- --reset-cache
rm -rf node_modules
npm install
```

**🚨 Issue: GitHub API authentication fails**
- ✅ Verify your token has `repo` permissions
- ✅ Check token is correctly set in `.env` file
- ✅ Ensure no spaces around the token in `.env`
- ✅ Test token with: `curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user`

**🚨 Issue: Data not syncing to GitHub**
- ✅ Check repository exists: `FitnessTracker-data`
- ✅ Verify JSON files exist in data repo
- ✅ Check internet connection
- ✅ Verify app has correct repository name in config

**🚨 Issue: Expo app won't start**
```bash
# Solution: Update Expo CLI
npm install -g @expo/cli@latest
npx expo install --fix
```

**🚨 Issue: Charts not displaying**
```bash
# Solution: Reinstall chart package
npm uninstall react-native-chart-kit
npm install react-native-chart-kit
```

#### **Environment Variables Check**
```bash
# Check if .env is properly loaded
node -e "require('dotenv').config(); console.log(process.env.GITHUB_TOKEN ? 'Token loaded' : 'Token missing');"
```

#### **Network Debugging**
```bash
# Test GitHub API connectivity
curl -H "Authorization: token YOUR_TOKEN" \
     https://api.github.com/repos/Nadeem4380/FitnessTracker-data/contents/workouts.json
```

### 📂 Project Structure After Installation

```
FitnessTracker/
├── .env                    # Environment variables
├── .expo/                  # Expo configuration
├── node_modules/           # Dependencies
├── assets/                 # App assets (icons, images)
├── components/             # React components
├── screens/                # App screens
├── utils/                  # Utility functions
├── App.js                  # Main app component
├── package.json            # Dependencies and scripts
└── README.md              # This file

FitnessTracker-data/        # Data repository
├── workouts.json          # Workout entries
├── stats.json             # Daily statistics
├── goals.json             # Fitness goals
└── profile.json           # User profile
```

## 📁 Data Structure

The app stores data in your `FitnessTracker-data` GitHub repository:

### **workouts.json**
```json
[
  {
    "id": "1642678800000",
    "date": "2025-01-19",
    "exerciseType": "Running",
    "duration": 30,
    "calories": 360,
    "intensity": "medium",
    "notes": "Morning run in the park"
  }
]
```

### **stats.json**
```json
[
  {
    "date": "2025-01-19",
    "steps": 8500,
    "caloriesBurned": 450,
    "workoutMinutes": 45,
    "waterIntake": 6
  }
]
```

### **goals.json**
```json
{
  "dailySteps": 10000,
  "dailyCalories": 500,
  "dailyWorkouts": 60,
  "dailyWater": 8,
  "weeklyWorkouts": 5
}
```

### **profile.json**
```json
{
  "name": "Nadeem",
  "age": 25,
  "height": 170,
  "weight": 70,
  "activityLevel": "moderate",
  "avatar": "https://github.com/Nadeem4380.png"
}
```

## 🚀 Usage

### Getting Started
1. **Launch the app** - Open the FitnessTracker app on your device
2. **Dashboard Overview** - View your daily fitness summary and progress
3. **Log Workouts** - Tap "Log Workout" to record exercise sessions
4. **Update Stats** - Add daily steps and water intake
5. **Set Goals** - Configure personalized fitness targets
6. **Track Progress** - Monitor your fitness journey with detailed analytics

### Key Features Usage

#### 🏋️ **Workout Logging**
- Select from 10+ exercise types (Running, Cycling, Swimming, etc.)
- Set duration and intensity level
- Automatic calorie calculation based on exercise type
- Notes and additional details

#### 📈 **Progress Tracking**
- **Dashboard**: Real-time progress overview
- **Progress Tab**: Detailed analytics and charts
- **Weekly Trends**: Visual representation of your fitness journey
- **Goal Achievement**: Track daily and weekly objectives

#### ⚙️ **Profile Management**
- Personal information (age, height, weight)
- Activity level settings
- Goal customization
- GitHub avatar integration

## 🤝 Contributing

We welcome contributions to make FitnessTracker even better!

### How to Contribute
1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📸 Screenshots

*Coming soon - Add screenshots of your app here*

## 🐛 Known Issues

- None currently reported

## 🔮 Future Enhancements

- [ ] Social features and workout sharing
- [ ] Integration with fitness wearables
- [ ] Nutrition tracking
- [ ] Workout plan templates
- [ ] Achievement badges and rewards
- [ ] Export data to other fitness platforms

## 👤 Author

**Nadeem4380**
- GitHub: [@Nadeem4380](https://github.com/Nadeem4380)
- Project Link: [https://github.com/Nadeem4380/FitnessTracker](https://github.com/Nadeem4380/FitnessTracker)

## 🙏 Acknowledgments

- React Native and Expo communities
- Chart.js contributors for react-native-chart-kit
- GitHub for providing the API
- All fitness enthusiasts who inspired this project

---

⭐ **Star this repository if you found it helpful!** ⭐

*Built with ❤️ for the fitness community*

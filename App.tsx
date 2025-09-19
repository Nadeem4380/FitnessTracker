import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Dimensions,import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { LineChart, ProgressChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// FIXED IMPORT - Remove saveGithubJson, add all the new save functions
import { fetchGithubJson, saveWorkouts, saveStats, saveGoals, saveProfile, fetchGithubUser } from './githubData';


const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};
const chartWidth = Dimensions.get('window').width - 40;
const getStatusBarHeight = () => Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

const theme = {
  colors: {
    primary: '#667eea',
    primaryDark: '#5a67d8',
    primaryLight: '#764ba2',
    accent: '#f093fb',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#4299e1',
    background: '#f7fafc',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    text: '#2d3748',
    textSecondary: '#718096',
    textLight: '#a0aec0',
    border: '#e2e8f0',
    borderLight: '#f7fafc',
    white: '#ffffff',
    black: '#1a202c',
    gray50: '#f9fafb',
    gray100: '#f7fafc',
    gray200: '#edf2f7',
    gray300: '#e2e8f0',
    gray400: '#cbd5e0',
    gray500: '#a0aec0',
    gray600: '#718096',
    gray700: '#4a5568',
    gray800: '#2d3748',
    gray900: '#1a202c',
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
};

interface WorkoutEntry {
  id: string;
  date: string;
  exerciseType: string;
  duration: number;
  calories: number;
  intensity: 'low' | 'medium' | 'high';
  notes?: string;
}

interface DailyStats {
  date: string;
  steps: number;
  caloriesBurned: number;
  workoutMinutes: number;
  waterIntake: number;
  weight?: number;
}

interface UserGoals {
  dailySteps: number;
  dailyCalories: number;
  weeklyWorkouts: number;
  dailyWater: number;
}

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

const exerciseTypes = [
  { name: 'Running', icon: 'walk-outline', color: '#667eea', avgCalPerMin: 12 },
  { name: 'Walking', icon: 'walk', color: '#48bb78', avgCalPerMin: 5 },
  { name: 'Cycling', icon: 'bicycle-outline', color: '#ed8936', avgCalPerMin: 8 },
  { name: 'Swimming', icon: 'water-outline', color: '#4299e1', avgCalPerMin: 11 },
  { name: 'Weightlifting', icon: 'barbell-outline', color: '#9f7aea', avgCalPerMin: 6 },
  { name: 'Yoga', icon: 'leaf-outline', color: '#38b2ac', avgCalPerMin: 3 },
  { name: 'Pilates', icon: 'body-outline', color: '#ed64a6', avgCalPerMin: 4 },
  { name: 'CrossFit', icon: 'fitness-outline', color: '#f56565', avgCalPerMin: 10 },
  { name: 'Boxing', icon: 'hand-left-outline', color: '#d69e2e', avgCalPerMin: 9 },
  { name: 'Dancing', icon: 'musical-notes-outline', color: '#805ad5', avgCalPerMin: 6 }
];

export default function App() {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [goals, setGoals] = useState<UserGoals>({
    dailySteps: 10000,
    dailyCalories: 500,
    weeklyWorkouts: 5,
    dailyWater: 8,
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Nadeem4380',
    age: 25,
    height: 175,
    weight: 75,
    activityLevel: 'moderate',
  });
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  const [exerciseType, setExerciseType] = useState('Running');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [steps, setSteps] = useState('');
  const [water, setWater] = useState('');

  // Load from GitHub
  useEffect(() => {
  (async () => {
    try {
      const { content: workoutsData } = await fetchGithubJson('workouts.json');
      setWorkouts(workoutsData);
      const { content: statsData } = await fetchGithubJson('stats.json');
      setDailyStats(statsData);
      const { content: goalsData } = await fetchGithubJson('goals.json');
      setGoals(goalsData);
      const { content: profileData } = await fetchGithubJson('profile.json');
      setUserProfile(profileData);
      
      // Fetch GitHub avatar
      const githubUser = await fetchGithubUser();
      if (githubUser) {
        setUserAvatar(githubUser.avatar_url);
      }
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('GitHub Data Error', err.message);
      } else {
        Alert.alert('GitHub Data Error', String(err));
      }
    }
  })();
}, []);

  // Utility functions
  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getTodayStats = () => {
    const today = getTodayString();
    return dailyStats.find(stats => stats.date === today) || {
      date: today, steps: 0, caloriesBurned: 0, workoutMinutes: 0, waterIntake: 0,
    };
  };
  const calculateCalories = (type: string, duration: number, intensity: string): number => {
  const baseCalories: { [key: string]: number } = {
    'Running': 12, 'Walking': 5, 'Cycling': 8, 'Swimming': 11,
    'Weightlifting': 6, 'Yoga': 3, 'Pilates': 4, 'CrossFit': 10,
    'Boxing': 9, 'Dancing': 6
  };
  const intensityMultiplier: { [key: string]: number } = { 'low': 0.8, 'medium': 1.0, 'high': 1.3 };
  return Math.round(
    (baseCalories[type] ?? 6) * duration * (intensityMultiplier[intensity] ?? 1)
  );
};
  const getWeeklyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    return last7Days.map(date => {
      const stats = dailyStats.find(s => s.date === date);
      return {
        date: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
        steps: stats?.steps || 0,
        calories: stats?.caloriesBurned || 0,
      };
    });
  };
  const getExerciseBreakdown = () => {
    const exerciseStats = exerciseTypes.map(exercise => {
      const workoutsForExercise = workouts.filter(w => w.exerciseType === exercise.name);
      const totalMinutes = workoutsForExercise.reduce((sum, w) => sum + w.duration, 0);
      const totalCalories = workoutsForExercise.reduce((sum, w) => sum + w.calories, 0);
      const workoutCount = workoutsForExercise.length;
      return {
        ...exercise,
        totalMinutes,
        totalCalories,
        workoutCount,
        avgDuration: workoutCount > 0 ? Math.round(totalMinutes / workoutCount) : 0,
      };
    }).filter(exercise => exercise.workoutCount > 0);
    return exerciseStats.sort((a, b) => b.totalMinutes - a.totalMinutes);
  };
  const getIntensityBreakdown = () => {
    const intensityStats = {
      low: workouts.filter(w => w.intensity === 'low').length,
      medium: workouts.filter(w => w.intensity === 'medium').length,
      high: workouts.filter(w => w.intensity === 'high').length,
    };
    const total = intensityStats.low + intensityStats.medium + intensityStats.high;
    if (total === 0) return [];
    return [
      { name: 'Low', population: intensityStats.low, color: theme.colors.success, legendFontColor: theme.colors.text, legendFontSize: 12 },
      { name: 'Medium', population: intensityStats.medium, color: theme.colors.warning, legendFontColor: theme.colors.text, legendFontSize: 12 },
      { name: 'High', population: intensityStats.high, color: theme.colors.error, legendFontColor: theme.colors.text, legendFontSize: 12 },
    ];
  };

const handleAddWorkout = async () => {
  if (!duration || parseInt(duration) <= 0) {
    return Alert.alert('Invalid Input', 'Please enter a valid duration');
  }
  
  const workout: WorkoutEntry = {
    id: Date.now().toString(),
    date: getTodayString(),
    exerciseType,
    duration: parseInt(duration),
    calories: parseInt(calories) || calculateCalories(exerciseType, parseInt(duration), intensity),
    intensity,
  };
  
  try {
    // Fetch current workouts from GitHub
    const { content: currentWorkouts } = await fetchGithubJson('workouts.json');
    const updatedWorkouts = [...currentWorkouts, workout];
    
    // Save to GitHub first
    await saveWorkouts(updatedWorkouts);
    setWorkouts(updatedWorkouts);
    
    // Update stats with fresh data
    const today = getTodayString();
    const { content: currentStats } = await fetchGithubJson('stats.json');
    const todayStats = currentStats.find((stats: DailyStats) => stats.date === today) || {
      date: today, steps: 0, caloriesBurned: 0, workoutMinutes: 0, waterIntake: 0,
    };
    
    const updatedStats: DailyStats = {
      ...todayStats,
      date: today,
      caloriesBurned: todayStats.caloriesBurned + workout.calories,
      workoutMinutes: todayStats.workoutMinutes + workout.duration,
    };
    
    const statsIndex = currentStats.findIndex((stats: DailyStats) => stats.date === today);
    let updatedDailyStats = [...currentStats];
    if (statsIndex >= 0) updatedDailyStats[statsIndex] = updatedStats;
    else updatedDailyStats = [...currentStats, updatedStats];
    
    await saveStats(updatedDailyStats);
    setDailyStats(updatedDailyStats);

    setDuration(''); 
    setCalories('');
    setShowWorkoutModal(false);
    Alert.alert('Success! 🎉', 'Your workout has been logged successfully!');
  } catch (error) {
    console.error('Error saving workout:', error);
    Alert.alert("Error", "Failed to save workout: " + (error instanceof Error ? error.message : String(error)));
  }
};

const handleUpdateStats = async () => {
  try {
    const today = getTodayString();
    
    // Fetch fresh stats from GitHub
    const { content: currentStats } = await fetchGithubJson('stats.json');
    const todayStats = currentStats.find((stats: DailyStats) => stats.date === today) || {
      date: today, steps: 0, caloriesBurned: 0, workoutMinutes: 0, waterIntake: 0,
    };
    
    const updatedStats: DailyStats = {
      ...todayStats,
      date: today,
      steps: steps ? parseInt(steps) : todayStats.steps,
      waterIntake: water ? parseInt(water) : todayStats.waterIntake,
    };
    
    const statsIndex = currentStats.findIndex((stats: DailyStats) => stats.date === today);
    let updatedDailyStats = [...currentStats];
    if (statsIndex >= 0) updatedDailyStats[statsIndex] = updatedStats;
    else updatedDailyStats = [...currentStats, updatedStats];
    
    await saveStats(updatedDailyStats);
    setDailyStats(updatedDailyStats);
    
    setSteps(''); 
    setWater('');
    setShowStatsModal(false);
    Alert.alert('Updated! ✅', 'Your daily stats have been updated successfully!');
  } catch (error) {
    console.error('Error updating stats:', error);
    Alert.alert("Error", "Failed to update stats: " + (error instanceof Error ? error.message : String(error)));
  }
};

  const StatCard: React.FC<{
    title: string;
    value: string;
    goal?: string;
    icon: string;
    color: string;
    progress?: number;
    onPress?: () => void;
  }> = ({ title, value, goal, icon, color, progress, onPress }) => (
    <TouchableOpacity style={[styles.statCard, theme.shadows.medium]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.statCardHeader}>
        <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon as any} size={22} color={color} />
        </View>
        <View style={styles.statCardContent}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          {goal && <Text style={styles.statGoal}>Goal: {goal}</Text>}
        </View>
      </View>
      {progress !== undefined && (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color }]} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const ExerciseDetailCard: React.FC<{
    exercise: any;
    onPress?: () => void;
  }> = ({ exercise, onPress }) => (
    <TouchableOpacity style={[styles.exerciseDetailCard, theme.shadows.small]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.exerciseDetailHeader}>
        <View style={[styles.exerciseDetailIcon, { backgroundColor: exercise.color + '15' }]}>
          <Ionicons name={exercise.icon as any} size={24} color={exercise.color} />
        </View>
        <View style={styles.exerciseDetailContent}>
          <Text style={styles.exerciseDetailTitle}>{exercise.name}</Text>
          <Text style={styles.exerciseDetailSubtitle}>{exercise.workoutCount} workouts</Text>
        </View>
        <View style={styles.exerciseDetailStats}>
          <Text style={styles.exerciseDetailTime}>{exercise.totalMinutes}min</Text>
          <Text style={styles.exerciseDetailCalories}>{exercise.totalCalories} cal</Text>
        </View>
      </View>
      <View style={styles.exerciseDetailProgress}>
        <View style={styles.exerciseDetailProgressBar}>
          <View 
            style={[
              styles.exerciseDetailProgressFill, 
              { 
                width: `${Math.min((exercise.totalMinutes / 300) * 100, 100)}%`, 
                backgroundColor: exercise.color 
              }
            ]} 
          />
        </View>
        <Text style={styles.exerciseDetailAvg}>Avg: {exercise.avgDuration}min</Text>
      </View>
    </TouchableOpacity>
  );

  const WeeklyExerciseSummary: React.FC = () => {
    const totalThisWeek = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      return workoutDate >= weekStart;
    }).reduce((sum, w) => sum + w.duration, 0);
    
    const weeklyWorkoutCount = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      return workoutDate >= weekStart;
    }).length;
    
    return (
      <View style={[styles.summaryCard, theme.shadows.medium]}>
        <Text style={styles.summaryTitle}>This Week's Activity</Text>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{totalThisWeek}</Text>
            <Text style={styles.summaryStatLabel}>Total Minutes</Text>
          </View>
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{weeklyWorkoutCount}</Text>
            <Text style={styles.summaryStatLabel}>Workouts</Text>
          </View>
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{Math.round(totalThisWeek / 7)}</Text>
            <Text style={styles.summaryStatLabel}>Daily Avg</Text>
          </View>
        </View>
      </View>
    );
  };

  const TabButton: React.FC<{ tab: string; label: string; icon: string }> = ({ tab, label, icon }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
    >
      <View style={[styles.tabIconContainer, activeTab === tab && styles.activeTabIcon]}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={activeTab === tab ? theme.colors.primary : theme.colors.textSecondary} 
        />
      </View>
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{label}</Text>
    </TouchableOpacity>
  );

  const ActionButton: React.FC<{ title: string; icon: string; color: string; onPress: () => void }> = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.actionButton, theme.shadows.medium]} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[color, color + 'dd']}
        style={styles.actionButtonGradient}
      >
        <View style={styles.actionButtonIcon}>
          <Ionicons name={icon as any} size={24} color={theme.colors.white} />
        </View>
        <Text style={styles.actionButtonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderDashboard = () => {
    const todayStats = getTodayStats();
    const weeklyData = getWeeklyData();
    const todayWorkouts = workouts.filter(w => w.date === getTodayString());
    const exerciseBreakdown = getExerciseBreakdown();
    const intensityData = getIntensityBreakdown();

    const progressData = {
      labels: ['Steps', 'Calories', 'Water', 'Workouts'],
      data: [
        Math.min(todayStats.steps / goals.dailySteps, 1),
        Math.min(todayStats.caloriesBurned / goals.dailyCalories, 1),
        Math.min(todayStats.waterIntake / goals.dailyWater, 1),
        Math.min(todayWorkouts.length / (goals.weeklyWorkouts / 7), 1),
      ],
    };

    return (
      <View style={styles.screenContainer}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight]}
          style={styles.header}
        >
          <View style={styles.statusBarSpacer} />
          <View style={styles.headerContent}>
  <View>
    <Text style={styles.greeting}>Hello, {userProfile.name}! 👋</Text>
    <Text style={styles.date}>
      {new Date().toLocaleDateString('en', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      })}
    </Text>
  </View>
  <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
    {userAvatar ? (
      <Image 
        source={{ uri: userAvatar }} 
        style={styles.profileImage}
      />
    ) : (
      <LinearGradient
        colors={['#ffffff20', '#ffffff10']}
        style={styles.profileButtonGradient}
      >
        <Ionicons name="person-outline" size={24} color={theme.colors.white} />
      </LinearGradient>
    )}
  </TouchableOpacity>
</View>
        </LinearGradient>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              <StatCard
                title="Steps"
                value={todayStats.steps.toLocaleString()}
                goal={goals.dailySteps.toLocaleString()}
                icon="walk-outline"
                color={theme.colors.success}
                progress={todayStats.steps / goals.dailySteps}
                onPress={() => setShowStatsModal(true)}
              />
              <StatCard
                title="Calories"
                value={todayStats.caloriesBurned.toString()}
                goal={goals.dailyCalories.toString()}
                icon="flame-outline"
                color={theme.colors.warning}
                progress={todayStats.caloriesBurned / goals.dailyCalories}
              />
              <StatCard
                title="Water"
                value={`${todayStats.waterIntake}`}
                goal={`${goals.dailyWater} glasses`}
                icon="water-outline"
                color={theme.colors.info}
                progress={todayStats.waterIntake / goals.dailyWater}
                onPress={() => setShowStatsModal(true)}
              />
              <StatCard
                title="Workouts"
                value={todayWorkouts.length.toString()}
                goal={`${Math.round(goals.weeklyWorkouts / 7)} daily`}
                icon="barbell-outline"
                color={theme.colors.error}
                progress={todayWorkouts.length / (goals.weeklyWorkouts / 7)}
                onPress={() => setShowWorkoutModal(true)}
              />
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <WeeklyExerciseSummary />
          </View>

          {exerciseBreakdown.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Exercise Breakdown</Text>
              {exerciseBreakdown.slice(0, 5).map((exercise) => (
                <ExerciseDetailCard key={exercise.name} exercise={exercise} />
              ))}
            </View>
          )}

          <View style={styles.chartsContainer}>
            <View style={[styles.chartCard, theme.shadows.medium]}>
              <Text style={styles.chartTitle}>Today's Progress</Text>
              <View style={styles.chartWrapper}>
                <ProgressChart
                  data={progressData}
                  width={chartWidth}
                  height={200}
                  strokeWidth={12}
                  radius={32}
                  chartConfig={chartConfig}
                  hideLegend={false}
                  style={styles.chart}
                />
              </View>
            </View>

            <View style={[styles.chartCard, theme.shadows.medium]}>
              <Text style={styles.chartTitle}>Weekly Activity</Text>
              <View style={styles.chartWrapper}>
                <LineChart
                  data={{
                    labels: weeklyData.map(d => d.date),
                    datasets: [{ 
                      data: weeklyData.map(d => d.steps).length > 0 ? weeklyData.map(d => d.steps) : [0],
                      strokeWidth: 3,
                    }],
                  }}
                  width={chartWidth}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                  withInnerLines={false}
                  withOuterLines={false}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                />
              </View>
            </View>

            {intensityData.length > 0 && (
              <View style={[styles.chartCard, theme.shadows.medium]}>
                <Text style={styles.chartTitle}>Workout Intensity Distribution</Text>
                <View style={styles.chartWrapper}>
                  <PieChart
                    data={intensityData}
                    width={chartWidth}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    style={styles.chart}
                  />
                </View>
              </View>
            )}
          </View>

          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <ActionButton
                title="Log Workout"
                icon="barbell-outline"
                color={theme.colors.primary}
                onPress={() => setShowWorkoutModal(true)}
              />
              <ActionButton
                title="Update Stats"
                icon="trending-up"
                color={theme.colors.success}
                onPress={() => setShowStatsModal(true)}
              />
              <ActionButton
                title="Set Goals"
                icon="flag-outline"
                color={theme.colors.warning}
                onPress={() => setShowGoalsModal(true)}
              />
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    );
  };

  const renderProgress = () => {
    const weeklyData = getWeeklyData();
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);

    return (
      <View style={styles.screenContainer}>
        <View style={styles.statusBarSpacer} />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress & Analytics</Text>
            <Text style={styles.progressSubtitle}>Track your fitness journey</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              <StatCard title="Total Workouts" value={totalWorkouts.toString()} icon="barbell-outline" color={theme.colors.success} />
              <StatCard title="Total Calories" value={totalCalories.toLocaleString()} icon="flame-outline" color={theme.colors.warning} />
              <StatCard title="Avg. Daily Steps" value="8,500" icon="walk-outline" color={theme.colors.info} />
              <StatCard title="This Week" value={`${workouts.filter(w => {
                const workoutDate = new Date(w.date);
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - 7);
                return workoutDate >= weekStart;
              }).length} workouts`} icon="calendar-outline" color={theme.colors.error} />
            </View>
          </View>

          <View style={styles.chartsContainer}>
            <View style={[styles.chartCard, theme.shadows.medium]}>
              <Text style={styles.chartTitle}>Weekly Calories Burned</Text>
              <BarChart
                  data={{
                    labels: weeklyData.map(d => d.date),
                    datasets: [
                      {
                        data:
                          weeklyData.map(d => d.calories).length > 0
                            ? weeklyData.map(d => d.calories)
                            : [0]
                      }
                    ]
                  }}
                  width={chartWidth}
                  height={200}
                  chartConfig={chartConfig}
                  style={styles.chart}
                  withInnerLines={false}
                  yAxisLabel=""        
                  yAxisSuffix=" kcal"      
                  fromZero={true}          
                />
            </View>
          </View>

          <View style={styles.recentWorkoutsContainer}>
            <Text style={styles.sectionTitle}>Recent Workouts</Text>
            {workouts.slice(-5).reverse().map((workout) => (
              <View key={workout.id} style={[styles.workoutItem, theme.shadows.small]}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutTypeContainer}>
                    <View style={[styles.workoutIcon, { backgroundColor: exerciseTypes.find(e => e.name === workout.exerciseType)?.color + '15' || theme.colors.primary + '15' }]}>
                      <Ionicons 
                        name={exerciseTypes.find(e => e.name === workout.exerciseType)?.icon as any || 'fitness-outline'} 
                        size={20} 
                        color={exerciseTypes.find(e => e.name === workout.exerciseType)?.color || theme.colors.primary} 
                      />
                    </View>
                    <Text style={styles.workoutType}>{workout.exerciseType}</Text>
                  </View>
                  <Text style={styles.workoutDate}>{new Date(workout.date).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.workoutDetails}>
                  {workout.duration} min • {workout.calories} cal • {workout.intensity} intensity
                </Text>
              </View>
            ))}
            {workouts.length === 0 && (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="barbell-outline" size={48} color={theme.colors.textLight} />
                <Text style={styles.emptyText}>No workouts logged yet</Text>
                <Text style={styles.emptySubtext}>Start your fitness journey today!</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    );
  };

  const renderProfile = () => (
    <View style={styles.screenContainer}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={styles.profileHeader}
      >
        <View style={styles.statusBarSpacer} />
        <View style={styles.profileHeaderContent}>
          <View style={styles.avatarContainer}>
  {userAvatar ? (
    <Image 
      source={{ uri: userAvatar }} 
      style={styles.profileAvatarLarge}
    />
  ) : (
    <LinearGradient
      colors={['#ffffff30', '#ffffff20']}
      style={styles.avatar}
    >
      <Ionicons name="person-outline" size={40} color={theme.colors.white} />
    </LinearGradient>
  )}
</View>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileSubtitle}>Fitness Enthusiast</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <StatCard title="Age" value={`${userProfile.age} years`} icon="calendar-outline" color={theme.colors.info} />
            <StatCard title="Height" value={`${userProfile.height} cm`} icon="resize-outline" color={theme.colors.success} />
            <StatCard title="Weight" value={`${userProfile.weight} kg`} icon="scale-outline" color={theme.colors.warning} />
            <StatCard title="BMI" value={(userProfile.weight / Math.pow(userProfile.height / 100, 2)).toFixed(1)} icon="analytics-outline" color={theme.colors.error} />
          </View>
        </View>

        <View style={styles.goalsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Goals</Text>
            <TouchableOpacity 
              style={[styles.editButton, theme.shadows.small]} 
              onPress={() => setShowGoalsModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            <StatCard title="Daily Steps" value={goals.dailySteps.toLocaleString()} icon="walk-outline" color={theme.colors.success} />
            <StatCard title="Daily Calories" value={goals.dailyCalories.toString()} icon="flame-outline" color={theme.colors.warning} />
            <StatCard title="Weekly Workouts" value={goals.weeklyWorkouts.toString()} icon="barbell-outline" color={theme.colors.error} />
            <StatCard title="Daily Water" value={`${goals.dailyWater} glasses`} icon="water-outline" color={theme.colors.info} />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" translucent={false} />
      
      <View style={styles.container}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'progress' && renderProgress()}
        {activeTab === 'profile' && renderProfile()}

        <View style={[styles.bottomNav, theme.shadows.large]}>
          <LinearGradient
            colors={[theme.colors.white, theme.colors.gray50]}
            style={styles.bottomNavGradient}
          >
            <TabButton tab="dashboard" label="Dashboard" icon="grid-outline" />
            <TabButton tab="progress" label="Progress" icon="trending-up" />
            <TabButton tab="profile" label="Profile" icon="person-outline" />
          </LinearGradient>
        </View>

        <Modal visible={showWorkoutModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={[styles.modalContent, theme.shadows.large]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Log Workout</Text>
                  <TouchableOpacity 
                    style={styles.modalCloseButton} 
                    onPress={() => setShowWorkoutModal(false)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Exercise Type</Text>
                    <View style={styles.exerciseGrid}>
                      {exerciseTypes.slice(0, 6).map((type) => (
                        <TouchableOpacity
                          key={type.name}
                          style={[
                            styles.exerciseButton,
                            exerciseType === type.name && [styles.selectedExercise, { borderColor: type.color }]
                          ]}
                          onPress={() => setExerciseType(type.name)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name={type.icon as any} size={20} color={exerciseType === type.name ? type.color : theme.colors.textSecondary} />
                          <Text style={[
                            styles.exerciseText,
                            exerciseType === type.name && [styles.selectedExerciseText, { color: type.color }]
                          ]}>
                            {type.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Duration (minutes)</Text>
                    <TextInput
                      style={styles.input}
                      value={duration}
                      onChangeText={(text) => {
                        setDuration(text);
                        if (text) {
                          const estimatedCalories = calculateCalories(exerciseType, parseInt(text), intensity);
                          setCalories(estimatedCalories.toString());
                        }
                      }}
                      placeholder="Enter duration"
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Intensity Level</Text>
                    <View style={styles.intensityContainer}>
                      {[
                        { level: 'low', color: theme.colors.success, label: 'Low' },
                        { level: 'medium', color: theme.colors.warning, label: 'Medium' },
                        { level: 'high', color: theme.colors.error, label: 'High' }
                      ].map((item) => (
                        <TouchableOpacity
                          key={item.level}
                          style={[
                            styles.intensityButton,
                            { borderColor: item.color },
                            intensity === item.level && { backgroundColor: item.color + '15' }
                          ]}
                          onPress={() => {
                            setIntensity(item.level as any);
                            if (duration) {
                              const estimatedCalories = calculateCalories(exerciseType, parseInt(duration), item.level as any);
                              setCalories(estimatedCalories.toString());
                            }
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.intensityText,
                            intensity === item.level && { color: item.color, fontWeight: '600' }
                          ]}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Calories Burned</Text>
                    <TextInput
                      style={styles.input}
                      value={calories}
                      onChangeText={setCalories}
                      placeholder="Auto-calculated"
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.submitButton, theme.shadows.medium]} 
                    onPress={handleAddWorkout}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[theme.colors.primary, theme.colors.primaryDark]}
                      style={styles.submitButtonGradient}
                    >
                      <Ionicons name="add" size={20} color={theme.colors.white} />
                      <Text style={styles.submitText}>Log Workout</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </SafeAreaView>
          </View>
        </Modal>

        <Modal visible={showStatsModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={[styles.modalContent, theme.shadows.large]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Update Daily Stats</Text>
                  <TouchableOpacity 
                    style={styles.modalCloseButton} 
                    onPress={() => setShowStatsModal(false)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Steps Today</Text>
                    <TextInput
                      style={styles.input}
                      value={steps}
                      onChangeText={setSteps}
                      placeholder="Enter steps count"
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Water Intake (glasses)</Text>
                    <TextInput
                      style={styles.input}
                      value={water}
                      onChangeText={setWater}
                      placeholder="Enter glasses of water"
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.submitButton, theme.shadows.medium]} 
                    onPress={handleUpdateStats}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[theme.colors.success, theme.colors.success + 'dd']}
                      style={styles.submitButtonGradient}
                    >
                      <Ionicons name="save-outline" size={20} color={theme.colors.white} />
                      <Text style={styles.submitText}>Update Stats</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </Modal>

        <Modal visible={showGoalsModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={[styles.modalContent, theme.shadows.large]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Goals</Text>
                  <TouchableOpacity 
                    style={styles.modalCloseButton} 
                    onPress={() => setShowGoalsModal(false)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Daily Steps Goal</Text>
                    <TextInput
                      style={styles.input}
                      value={goals.dailySteps.toString()}
                      onChangeText={(text) => setGoals({ ...goals, dailySteps: parseInt(text) || 0 })}
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Daily Calories Goal</Text>
                    <TextInput
                      style={styles.input}
                      value={goals.dailyCalories.toString()}
                      onChangeText={(text) => setGoals({ ...goals, dailyCalories: parseInt(text) || 0 })}
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Weekly Workouts Goal</Text>
                    <TextInput
                      style={styles.input}
                      value={goals.weeklyWorkouts.toString()}
                      onChangeText={(text) => setGoals({ ...goals, weeklyWorkouts: parseInt(text) || 0 })}
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Daily Water Goal (glasses)</Text>
                    <TextInput
                      style={styles.input}
                      value={goals.dailyWater.toString()}
                      onChangeText={(text) => setGoals({ ...goals, dailyWater: parseInt(text) || 0 })}
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.submitButton, theme.shadows.medium]} 
                    onPress={() => {
                      setShowGoalsModal(false);
                      Alert.alert('Success! 🎯', 'Your goals have been updated successfully!', [
                        { text: 'Perfect!', style: 'default' }
                      ]);
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[theme.colors.warning, theme.colors.warning + 'dd']}
                      style={styles.submitButtonGradient}
                    >
                      <Ionicons name="save-outline" size={20} color={theme.colors.white} />
                      <Text style={styles.submitText}>Save Goals</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  statusBarSpacer: {
    height: getStatusBarHeight(),
  },
  content: {
    flex: 1,
    marginBottom: 90,
  },
  scrollContent: {
    flex: 1,
    marginBottom: 90,
  },
  header: {
    paddingBottom: theme.spacing.xxl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: theme.colors.white,
    opacity: 0.9,
    fontWeight: '500',
  },
  profileButton: {
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  profileButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
  },
  statCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    minHeight: 140,
    overflow: 'visible',
    position: 'relative',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
    flex: 1,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    flexShrink: 0,
  },
  statCardContent: {
    flex: 1,
    minWidth: 0,
  },
  statTitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  statGoal: {
    fontSize: 11,
    color: theme.colors.textLight,
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  progressBarContainer: {
    marginTop: theme.spacing.md,
    width: '100%',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: theme.colors.gray200,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  sectionContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  exerciseDetailCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  exerciseDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  exerciseDetailIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  exerciseDetailContent: {
    flex: 1,
  },
  exerciseDetailTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  exerciseDetailSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  exerciseDetailStats: {
    alignItems: 'flex-end',
  },
  exerciseDetailTime: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  exerciseDetailCalories: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  exerciseDetailProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseDetailProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.gray200,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
  },
  exerciseDetailProgressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  exerciseDetailAvg: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  chartsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    paddingHorizontal: theme.spacing.sm,
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  actionButtonIcon: {
    marginBottom: theme.spacing.sm,
  },
  actionButtonText: {
    fontSize: 13,
    color: theme.colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  progressTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  progressSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  recentWorkoutsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  workoutItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  workoutTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  workoutType: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  workoutDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  workoutDetails: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  profileHeader: {
    paddingBottom: theme.spacing.xxl,
  },
  profileHeaderContent: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  avatarContainer: {
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  profileSubtitle: {
    fontSize: 16,
    color: theme.colors.white,
    opacity: 0.9,
    fontWeight: '500',
  },
  goalsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  bottomNavGradient: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: theme.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileAvatarLarge: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  activeTab: {},
  activeTabIcon: {
    backgroundColor: theme.colors.primary + '15',
  },
  tabText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSafeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    fontSize: 16,
    backgroundColor: theme.colors.gray50,
    color: theme.colors.text,
    fontWeight: '500',
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exerciseButton: {
    width: '48%',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.gray50,
  },
  selectedExercise: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
  },
  exerciseText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: theme.spacing.sm,
  },
  selectedExerciseText: {
    fontWeight: '700',
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    backgroundColor: theme.colors.gray50,
  },
  intensityText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  submitButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginTop: theme.spacing.md,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  submitText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: theme.spacing.sm,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LineChart, ProgressChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchGithubJson, saveGithubJson } from './githubData';

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // line color
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // label color
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};
const chartWidth = Dimensions.get('window').width - 40;
const getStatusBarHeight = () => Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

const theme = {
  colors: {
    primary: '#667eea',
    primaryDark: '#5a67d8',
    primaryLight: '#764ba2',
    accent: '#f093fb',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#4299e1',
    background: '#f7fafc',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    text: '#2d3748',
    textSecondary: '#718096',
    textLight: '#a0aec0',
    border: '#e2e8f0',
    borderLight: '#f7fafc',
    white: '#ffffff',
    black: '#1a202c',
    gray50: '#f9fafb',
    gray100: '#f7fafc',
    gray200: '#edf2f7',
    gray300: '#e2e8f0',
    gray400: '#cbd5e0',
    gray500: '#a0aec0',
    gray600: '#718096',
    gray700: '#4a5568',
    gray800: '#2d3748',
    gray900: '#1a202c',
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
};

interface WorkoutEntry {
  id: string;
  date: string;
  exerciseType: string;
  duration: number;
  calories: number;
  intensity: 'low' | 'medium' | 'high';
  notes?: string;
}

interface DailyStats {
  date: string;
  steps: number;
  caloriesBurned: number;
  workoutMinutes: number;
  waterIntake: number;
  weight?: number;
}

interface UserGoals {
  dailySteps: number;
  dailyCalories: number;
  weeklyWorkouts: number;
  dailyWater: number;
}

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

const exerciseTypes = [
  { name: 'Running', icon: 'walk-outline', color: '#667eea', avgCalPerMin: 12 },
  { name: 'Walking', icon: 'walk', color: '#48bb78', avgCalPerMin: 5 },
  { name: 'Cycling', icon: 'bicycle-outline', color: '#ed8936', avgCalPerMin: 8 },
  { name: 'Swimming', icon: 'water-outline', color: '#4299e1', avgCalPerMin: 11 },
  { name: 'Weightlifting', icon: 'barbell-outline', color: '#9f7aea', avgCalPerMin: 6 },
  { name: 'Yoga', icon: 'leaf-outline', color: '#38b2ac', avgCalPerMin: 3 },
  { name: 'Pilates', icon: 'body-outline', color: '#ed64a6', avgCalPerMin: 4 },
  { name: 'CrossFit', icon: 'fitness-outline', color: '#f56565', avgCalPerMin: 10 },
  { name: 'Boxing', icon: 'hand-left-outline', color: '#d69e2e', avgCalPerMin: 9 },
  { name: 'Dancing', icon: 'musical-notes-outline', color: '#805ad5', avgCalPerMin: 6 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [workoutsSha, setWorkoutsSha] = useState('');
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [statsSha, setStatsSha] = useState('');
  const [goals, setGoals] = useState<UserGoals>({
    dailySteps: 10000,
    dailyCalories: 500,
    weeklyWorkouts: 5,
    dailyWater: 8,
  });
  const [goalsSha, setGoalsSha] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Nadeem4380',
    age: 25,
    height: 175,
    weight: 75,
    activityLevel: 'moderate',
  });
  const [profileSha, setProfileSha] = useState('');

  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  const [exerciseType, setExerciseType] = useState('Running');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [steps, setSteps] = useState('');
  const [water, setWater] = useState('');

  // Load from GitHub
  useEffect(() => {
  (async () => {
    try {
      const { content: workoutsData, sha: wSha } = await fetchGithubJson('workouts.json');
      setWorkouts(workoutsData); setWorkoutsSha(wSha);
      const { content: statsData, sha: sSha } = await fetchGithubJson('stats.json');
      setDailyStats(statsData); setStatsSha(sSha);
      const { content: goalsData, sha: gSha } = await fetchGithubJson('goals.json');
      setGoals(goalsData); setGoalsSha(gSha);
      const { content: profileData, sha: pSha } = await fetchGithubJson('profile.json');
      setUserProfile(profileData); setProfileSha(pSha);
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('GitHub Data Error', err.message);
      } else {
        Alert.alert('GitHub Data Error', String(err));
      }
    }
  })();
}, []);

  // Save helpers
  const saveWorkouts = async (newWorkouts: WorkoutEntry[]) => {
  // Fetch latest SHA before saving!
  const { sha: latestSha } = await fetchGithubJson('workouts.json');
  await saveGithubJson('workouts.json', newWorkouts, latestSha);
  setWorkouts(newWorkouts);
  setWorkoutsSha(latestSha);
};

const saveStats = async (newStats: DailyStats[]) => {
  await saveGithubJson('stats.json', newStats, statsSha);
  setDailyStats(newStats);
  const { sha } = await fetchGithubJson('stats.json');
  setStatsSha(sha);
};

const saveGoals = async (newGoals: UserGoals) => {
  await saveGithubJson('goals.json', newGoals, goalsSha);
  setGoals(newGoals);
  const { sha } = await fetchGithubJson('goals.json');
  setGoalsSha(sha);
};

const saveProfile = async (newProfile: UserProfile) => {
  await saveGithubJson('profile.json', newProfile, profileSha);
  setUserProfile(newProfile);
  const { sha } = await fetchGithubJson('profile.json');
  setProfileSha(sha);
};

  // Utility functions
  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getTodayStats = () => {
    const today = getTodayString();
    return dailyStats.find(stats => stats.date === today) || {
      date: today, steps: 0, caloriesBurned: 0, workoutMinutes: 0, waterIntake: 0,
    };
  };
  const calculateCalories = (type: string, duration: number, intensity: string): number => {
  const baseCalories: { [key: string]: number } = {
    'Running': 12, 'Walking': 5, 'Cycling': 8, 'Swimming': 11,
    'Weightlifting': 6, 'Yoga': 3, 'Pilates': 4, 'CrossFit': 10,
    'Boxing': 9, 'Dancing': 6
  };
  const intensityMultiplier: { [key: string]: number } = { 'low': 0.8, 'medium': 1.0, 'high': 1.3 };
  return Math.round(
    (baseCalories[type] ?? 6) * duration * (intensityMultiplier[intensity] ?? 1)
  );
};
  const getWeeklyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    return last7Days.map(date => {
      const stats = dailyStats.find(s => s.date === date);
      return {
        date: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
        steps: stats?.steps || 0,
        calories: stats?.caloriesBurned || 0,
      };
    });
  };
  const getExerciseBreakdown = () => {
    const exerciseStats = exerciseTypes.map(exercise => {
      const workoutsForExercise = workouts.filter(w => w.exerciseType === exercise.name);
      const totalMinutes = workoutsForExercise.reduce((sum, w) => sum + w.duration, 0);
      const totalCalories = workoutsForExercise.reduce((sum, w) => sum + w.calories, 0);
      const workoutCount = workoutsForExercise.length;
      return {
        ...exercise,
        totalMinutes,
        totalCalories,
        workoutCount,
        avgDuration: workoutCount > 0 ? Math.round(totalMinutes / workoutCount) : 0,
      };
    }).filter(exercise => exercise.workoutCount > 0);
    return exerciseStats.sort((a, b) => b.totalMinutes - a.totalMinutes);
  };
  const getIntensityBreakdown = () => {
    const intensityStats = {
      low: workouts.filter(w => w.intensity === 'low').length,
      medium: workouts.filter(w => w.intensity === 'medium').length,
      high: workouts.filter(w => w.intensity === 'high').length,
    };
    const total = intensityStats.low + intensityStats.medium + intensityStats.high;
    if (total === 0) return [];
    return [
      { name: 'Low', population: intensityStats.low, color: theme.colors.success, legendFontColor: theme.colors.text, legendFontSize: 12 },
      { name: 'Medium', population: intensityStats.medium, color: theme.colors.warning, legendFontColor: theme.colors.text, legendFontSize: 12 },
      { name: 'High', population: intensityStats.high, color: theme.colors.error, legendFontColor: theme.colors.text, legendFontSize: 12 },
    ];
  };

  // Main handlers (GitHub storage)
  const handleAddWorkout = async () => {
    if (!duration || parseInt(duration) <= 0) return Alert.alert('Invalid Input', 'Please enter a valid duration');
    const workout: WorkoutEntry = {
      id: Date.now().toString(),
      date: getTodayString(),
      exerciseType,
      duration: parseInt(duration),
      calories: parseInt(calories) || calculateCalories(exerciseType, parseInt(duration), intensity),
      intensity,
    };
    const updatedWorkouts = [...workouts, workout];
    await saveWorkouts(updatedWorkouts);
    // Update stats
    const today = getTodayString();
    const currentStats = getTodayStats();
    const updatedStats: DailyStats = {
      ...currentStats,
      date: today,
      caloriesBurned: currentStats.caloriesBurned + workout.calories,
      workoutMinutes: currentStats.workoutMinutes + workout.duration,
    };
    const statsIndex = dailyStats.findIndex(stats => stats.date === today);
    let updatedDailyStats = [...dailyStats];
    if (statsIndex >= 0) updatedDailyStats[statsIndex] = updatedStats;
    else updatedDailyStats = [...dailyStats, updatedStats];
    await saveStats(updatedDailyStats);

    setDuration(''); setCalories('');
    setShowWorkoutModal(false);
    Alert.alert('Success! 🎉', 'Your workout has been logged successfully!');
  };

  const handleUpdateStats = async () => {
    const today = getTodayString();
    const currentStats = getTodayStats();
    const updatedStats: DailyStats = {
      ...currentStats,
      date: today,
      steps: steps ? parseInt(steps) : currentStats.steps,
      waterIntake: water ? parseInt(water) : currentStats.waterIntake,
    };
    const statsIndex = dailyStats.findIndex(stats => stats.date === today);
    let updatedDailyStats = [...dailyStats];
    if (statsIndex >= 0) updatedDailyStats[statsIndex] = updatedStats;
    else updatedDailyStats = [...dailyStats, updatedStats];
    await saveStats(updatedDailyStats);
    setSteps(''); setWater('');
    setShowStatsModal(false);
    Alert.alert('Updated! ✅', 'Your daily stats have been updated successfully!');
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    goal?: string;
    icon: string;
    color: string;
    progress?: number;
    onPress?: () => void;
  }> = ({ title, value, goal, icon, color, progress, onPress }) => (
    <TouchableOpacity style={[styles.statCard, theme.shadows.medium]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.statCardHeader}>
        <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon as any} size={22} color={color} />
        </View>
        <View style={styles.statCardContent}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          {goal && <Text style={styles.statGoal}>Goal: {goal}</Text>}
        </View>
      </View>
      {progress !== undefined && (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color }]} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const ExerciseDetailCard: React.FC<{
    exercise: any;
    onPress?: () => void;
  }> = ({ exercise, onPress }) => (
    <TouchableOpacity style={[styles.exerciseDetailCard, theme.shadows.small]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.exerciseDetailHeader}>
        <View style={[styles.exerciseDetailIcon, { backgroundColor: exercise.color + '15' }]}>
          <Ionicons name={exercise.icon as any} size={24} color={exercise.color} />
        </View>
        <View style={styles.exerciseDetailContent}>
          <Text style={styles.exerciseDetailTitle}>{exercise.name}</Text>
          <Text style={styles.exerciseDetailSubtitle}>{exercise.workoutCount} workouts</Text>
        </View>
        <View style={styles.exerciseDetailStats}>
          <Text style={styles.exerciseDetailTime}>{exercise.totalMinutes}min</Text>
          <Text style={styles.exerciseDetailCalories}>{exercise.totalCalories} cal</Text>
        </View>
      </View>
      <View style={styles.exerciseDetailProgress}>
        <View style={styles.exerciseDetailProgressBar}>
          <View 
            style={[
              styles.exerciseDetailProgressFill, 
              { 
                width: `${Math.min((exercise.totalMinutes / 300) * 100, 100)}%`, 
                backgroundColor: exercise.color 
              }
            ]} 
          />
        </View>
        <Text style={styles.exerciseDetailAvg}>Avg: {exercise.avgDuration}min</Text>
      </View>
    </TouchableOpacity>
  );

  const WeeklyExerciseSummary: React.FC = () => {
    const totalThisWeek = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      return workoutDate >= weekStart;
    }).reduce((sum, w) => sum + w.duration, 0);
    
    const weeklyWorkoutCount = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      return workoutDate >= weekStart;
    }).length;
    
    return (
      <View style={[styles.summaryCard, theme.shadows.medium]}>
        <Text style={styles.summaryTitle}>This Week's Activity</Text>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{totalThisWeek}</Text>
            <Text style={styles.summaryStatLabel}>Total Minutes</Text>
          </View>
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{weeklyWorkoutCount}</Text>
            <Text style={styles.summaryStatLabel}>Workouts</Text>
          </View>
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{Math.round(totalThisWeek / 7)}</Text>
            <Text style={styles.summaryStatLabel}>Daily Avg</Text>
          </View>
        </View>
      </View>
    );
  };

  const TabButton: React.FC<{ tab: string; label: string; icon: string }> = ({ tab, label, icon }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
    >
      <View style={[styles.tabIconContainer, activeTab === tab && styles.activeTabIcon]}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={activeTab === tab ? theme.colors.primary : theme.colors.textSecondary} 
        />
      </View>
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{label}</Text>
    </TouchableOpacity>
  );

  const ActionButton: React.FC<{ title: string; icon: string; color: string; onPress: () => void }> = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.actionButton, theme.shadows.medium]} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[color, color + 'dd']}
        style={styles.actionButtonGradient}
      >
        <View style={styles.actionButtonIcon}>
          <Ionicons name={icon as any} size={24} color={theme.colors.white} />
        </View>
        <Text style={styles.actionButtonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderDashboard = () => {
    const todayStats = getTodayStats();
    const weeklyData = getWeeklyData();
    const todayWorkouts = workouts.filter(w => w.date === getTodayString());
    const exerciseBreakdown = getExerciseBreakdown();
    const intensityData = getIntensityBreakdown();

    const progressData = {
      labels: ['Steps', 'Calories', 'Water', 'Workouts'],
      data: [
        Math.min(todayStats.steps / goals.dailySteps, 1),
        Math.min(todayStats.caloriesBurned / goals.dailyCalories, 1),
        Math.min(todayStats.waterIntake / goals.dailyWater, 1),
        Math.min(todayWorkouts.length / (goals.weeklyWorkouts / 7), 1),
      ],
    };

    return (
      <View style={styles.screenContainer}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight]}
          style={styles.header}
        >
          <View style={styles.statusBarSpacer} />
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hello, {userProfile.name}! 👋</Text>
              <Text style={styles.date}>
                {new Date().toLocaleDateString('en', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#ffffff20', '#ffffff10']}
                style={styles.profileButtonGradient}
              >
                <Ionicons name="person-outline" size={24} color={theme.colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              <StatCard
                title="Steps"
                value={todayStats.steps.toLocaleString()}
                goal={goals.dailySteps.toLocaleString()}
                icon="walk-outline"
                color={theme.colors.success}
                progress={todayStats.steps / goals.dailySteps}
                onPress={() => setShowStatsModal(true)}
              />
              <StatCard
                title="Calories"
                value={todayStats.caloriesBurned.toString()}
                goal={goals.dailyCalories.toString()}
                icon="flame-outline"
                color={theme.colors.warning}
                progress={todayStats.caloriesBurned / goals.dailyCalories}
              />
              <StatCard
                title="Water"
                value={`${todayStats.waterIntake}`}
                goal={`${goals.dailyWater} glasses`}
                icon="water-outline"
                color={theme.colors.info}
                progress={todayStats.waterIntake / goals.dailyWater}
                onPress={() => setShowStatsModal(true)}
              />
              <StatCard
                title="Workouts"
                value={todayWorkouts.length.toString()}
                goal={`${Math.round(goals.weeklyWorkouts / 7)} daily`}
                icon="barbell-outline"
                color={theme.colors.error}
                progress={todayWorkouts.length / (goals.weeklyWorkouts / 7)}
                onPress={() => setShowWorkoutModal(true)}
              />
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <WeeklyExerciseSummary />
          </View>

          {exerciseBreakdown.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Exercise Breakdown</Text>
              {exerciseBreakdown.slice(0, 5).map((exercise) => (
                <ExerciseDetailCard key={exercise.name} exercise={exercise} />
              ))}
            </View>
          )}

          <View style={styles.chartsContainer}>
            <View style={[styles.chartCard, theme.shadows.medium]}>
              <Text style={styles.chartTitle}>Today's Progress</Text>
              <View style={styles.chartWrapper}>
                <ProgressChart
                  data={progressData}
                  width={chartWidth}
                  height={200}
                  strokeWidth={12}
                  radius={32}
                  chartConfig={chartConfig}
                  hideLegend={false}
                  style={styles.chart}
                />
              </View>
            </View>

            <View style={[styles.chartCard, theme.shadows.medium]}>
              <Text style={styles.chartTitle}>Weekly Activity</Text>
              <View style={styles.chartWrapper}>
                <LineChart
                  data={{
                    labels: weeklyData.map(d => d.date),
                    datasets: [{ 
                      data: weeklyData.map(d => d.steps).length > 0 ? weeklyData.map(d => d.steps) : [0],
                      strokeWidth: 3,
                    }],
                  }}
                  width={chartWidth}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                  withInnerLines={false}
                  withOuterLines={false}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                />
              </View>
            </View>

            {intensityData.length > 0 && (
              <View style={[styles.chartCard, theme.shadows.medium]}>
                <Text style={styles.chartTitle}>Workout Intensity Distribution</Text>
                <View style={styles.chartWrapper}>
                  <PieChart
                    data={intensityData}
                    width={chartWidth}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    style={styles.chart}
                  />
                </View>
              </View>
            )}
          </View>

          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <ActionButton
                title="Log Workout"
                icon="barbell-outline"
                color={theme.colors.primary}
                onPress={() => setShowWorkoutModal(true)}
              />
              <ActionButton
                title="Update Stats"
                icon="trending-up"
                color={theme.colors.success}
                onPress={() => setShowStatsModal(true)}
              />
              <ActionButton
                title="Set Goals"
                icon="flag-outline"
                color={theme.colors.warning}
                onPress={() => setShowGoalsModal(true)}
              />
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    );
  };

  const renderProgress = () => {
    const weeklyData = getWeeklyData();
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);

    return (
      <View style={styles.screenContainer}>
        <View style={styles.statusBarSpacer} />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress & Analytics</Text>
            <Text style={styles.progressSubtitle}>Track your fitness journey</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              <StatCard title="Total Workouts" value={totalWorkouts.toString()} icon="barbell-outline" color={theme.colors.success} />
              <StatCard title="Total Calories" value={totalCalories.toLocaleString()} icon="flame-outline" color={theme.colors.warning} />
              <StatCard title="Avg. Daily Steps" value="8,500" icon="walk-outline" color={theme.colors.info} />
              <StatCard title="This Week" value={`${workouts.filter(w => {
                const workoutDate = new Date(w.date);
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - 7);
                return workoutDate >= weekStart;
              }).length} workouts`} icon="calendar-outline" color={theme.colors.error} />
            </View>
          </View>

          <View style={styles.chartsContainer}>
            <View style={[styles.chartCard, theme.shadows.medium]}>
              <Text style={styles.chartTitle}>Weekly Calories Burned</Text>
              <BarChart
                  data={{
                    labels: weeklyData.map(d => d.date),
                    datasets: [
                      {
                        data:
                          weeklyData.map(d => d.calories).length > 0
                            ? weeklyData.map(d => d.calories)
                            : [0]
                      }
                    ]
                  }}
                  width={chartWidth}
                  height={200}
                  chartConfig={chartConfig}
                  style={styles.chart}
                  withInnerLines={false}
                  yAxisLabel=""        
                  yAxisSuffix=" kcal"      
                  fromZero={true}          
                />
            </View>
          </View>

          <View style={styles.recentWorkoutsContainer}>
            <Text style={styles.sectionTitle}>Recent Workouts</Text>
            {workouts.slice(-5).reverse().map((workout) => (
              <View key={workout.id} style={[styles.workoutItem, theme.shadows.small]}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutTypeContainer}>
                    <View style={[styles.workoutIcon, { backgroundColor: exerciseTypes.find(e => e.name === workout.exerciseType)?.color + '15' || theme.colors.primary + '15' }]}>
                      <Ionicons 
                        name={exerciseTypes.find(e => e.name === workout.exerciseType)?.icon as any || 'fitness-outline'} 
                        size={20} 
                        color={exerciseTypes.find(e => e.name === workout.exerciseType)?.color || theme.colors.primary} 
                      />
                    </View>
                    <Text style={styles.workoutType}>{workout.exerciseType}</Text>
                  </View>
                  <Text style={styles.workoutDate}>{new Date(workout.date).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.workoutDetails}>
                  {workout.duration} min • {workout.calories} cal • {workout.intensity} intensity
                </Text>
              </View>
            ))}
            {workouts.length === 0 && (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="barbell-outline" size={48} color={theme.colors.textLight} />
                <Text style={styles.emptyText}>No workouts logged yet</Text>
                <Text style={styles.emptySubtext}>Start your fitness journey today!</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    );
  };

  const renderProfile = () => (
    <View style={styles.screenContainer}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={styles.profileHeader}
      >
        <View style={styles.statusBarSpacer} />
        <View style={styles.profileHeaderContent}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#ffffff30', '#ffffff20']}
              style={styles.avatar}
            >
              <Ionicons name="person-outline" size={40} color={theme.colors.white} />
            </LinearGradient>
          </View>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileSubtitle}>Fitness Enthusiast</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <StatCard title="Age" value={`${userProfile.age} years`} icon="calendar-outline" color={theme.colors.info} />
            <StatCard title="Height" value={`${userProfile.height} cm`} icon="resize-outline" color={theme.colors.success} />
            <StatCard title="Weight" value={`${userProfile.weight} kg`} icon="scale-outline" color={theme.colors.warning} />
            <StatCard title="BMI" value={(userProfile.weight / Math.pow(userProfile.height / 100, 2)).toFixed(1)} icon="analytics-outline" color={theme.colors.error} />
          </View>
        </View>

        <View style={styles.goalsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Goals</Text>
            <TouchableOpacity 
              style={[styles.editButton, theme.shadows.small]} 
              onPress={() => setShowGoalsModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            <StatCard title="Daily Steps" value={goals.dailySteps.toLocaleString()} icon="walk-outline" color={theme.colors.success} />
            <StatCard title="Daily Calories" value={goals.dailyCalories.toString()} icon="flame-outline" color={theme.colors.warning} />
            <StatCard title="Weekly Workouts" value={goals.weeklyWorkouts.toString()} icon="barbell-outline" color={theme.colors.error} />
            <StatCard title="Daily Water" value={`${goals.dailyWater} glasses`} icon="water-outline" color={theme.colors.info} />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" translucent={false} />
      
      <View style={styles.container}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'progress' && renderProgress()}
        {activeTab === 'profile' && renderProfile()}

        <View style={[styles.bottomNav, theme.shadows.large]}>
          <LinearGradient
            colors={[theme.colors.white, theme.colors.gray50]}
            style={styles.bottomNavGradient}
          >
            <TabButton tab="dashboard" label="Dashboard" icon="grid-outline" />
            <TabButton tab="progress" label="Progress" icon="trending-up" />
            <TabButton tab="profile" label="Profile" icon="person-outline" />
          </LinearGradient>
        </View>

        <Modal visible={showWorkoutModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={[styles.modalContent, theme.shadows.large]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Log Workout</Text>
                  <TouchableOpacity 
                    style={styles.modalCloseButton} 
                    onPress={() => setShowWorkoutModal(false)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Exercise Type</Text>
                    <View style={styles.exerciseGrid}>
                      {exerciseTypes.slice(0, 6).map((type) => (
                        <TouchableOpacity
                          key={type.name}
                          style={[
                            styles.exerciseButton,
                            exerciseType === type.name && [styles.selectedExercise, { borderColor: type.color }]
                          ]}
                          onPress={() => setExerciseType(type.name)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name={type.icon as any} size={20} color={exerciseType === type.name ? type.color : theme.colors.textSecondary} />
                          <Text style={[
                            styles.exerciseText,
                            exerciseType === type.name && [styles.selectedExerciseText, { color: type.color }]
                          ]}>
                            {type.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Duration (minutes)</Text>
                    <TextInput
                      style={styles.input}
                      value={duration}
                      onChangeText={(text) => {
                        setDuration(text);
                        if (text) {
                          const estimatedCalories = calculateCalories(exerciseType, parseInt(text), intensity);
                          setCalories(estimatedCalories.toString());
                        }
                      }}
                      placeholder="Enter duration"
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Intensity Level</Text>
                    <View style={styles.intensityContainer}>
                      {[
                        { level: 'low', color: theme.colors.success, label: 'Low' },
                        { level: 'medium', color: theme.colors.warning, label: 'Medium' },
                        { level: 'high', color: theme.colors.error, label: 'High' }
                      ].map((item) => (
                        <TouchableOpacity
                          key={item.level}
                          style={[
                            styles.intensityButton,
                            { borderColor: item.color },
                            intensity === item.level && { backgroundColor: item.color + '15' }
                          ]}
                          onPress={() => {
                            setIntensity(item.level as any);
                            if (duration) {
                              const estimatedCalories = calculateCalories(exerciseType, parseInt(duration), item.level as any);
                              setCalories(estimatedCalories.toString());
                            }
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.intensityText,
                            intensity === item.level && { color: item.color, fontWeight: '600' }
                          ]}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Calories Burned</Text>
                    <TextInput
                      style={styles.input}
                      value={calories}
                      onChangeText={setCalories}
                      placeholder="Auto-calculated"
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.submitButton, theme.shadows.medium]} 
                    onPress={handleAddWorkout}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[theme.colors.primary, theme.colors.primaryDark]}
                      style={styles.submitButtonGradient}
                    >
                      <Ionicons name="add" size={20} color={theme.colors.white} />
                      <Text style={styles.submitText}>Log Workout</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </SafeAreaView>
          </View>
        </Modal>

        <Modal visible={showStatsModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={[styles.modalContent, theme.shadows.large]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Update Daily Stats</Text>
                  <TouchableOpacity 
                    style={styles.modalCloseButton} 
                    onPress={() => setShowStatsModal(false)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Steps Today</Text>
                    <TextInput
                      style={styles.input}
                      value={steps}
                      onChangeText={setSteps}
                      placeholder="Enter steps count"
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Water Intake (glasses)</Text>
                    <TextInput
                      style={styles.input}
                      value={water}
                      onChangeText={setWater}
                      placeholder="Enter glasses of water"
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.submitButton, theme.shadows.medium]} 
                    onPress={handleUpdateStats}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[theme.colors.success, theme.colors.success + 'dd']}
                      style={styles.submitButtonGradient}
                    >
                      <Ionicons name="save-outline" size={20} color={theme.colors.white} />
                      <Text style={styles.submitText}>Update Stats</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </Modal>

        <Modal visible={showGoalsModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={[styles.modalContent, theme.shadows.large]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Goals</Text>
                  <TouchableOpacity 
                    style={styles.modalCloseButton} 
                    onPress={() => setShowGoalsModal(false)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Daily Steps Goal</Text>
                    <TextInput
                      style={styles.input}
                      value={goals.dailySteps.toString()}
                      onChangeText={(text) => setGoals({ ...goals, dailySteps: parseInt(text) || 0 })}
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Daily Calories Goal</Text>
                    <TextInput
                      style={styles.input}
                      value={goals.dailyCalories.toString()}
                      onChangeText={(text) => setGoals({ ...goals, dailyCalories: parseInt(text) || 0 })}
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Weekly Workouts Goal</Text>
                    <TextInput
                      style={styles.input}
                      value={goals.weeklyWorkouts.toString()}
                      onChangeText={(text) => setGoals({ ...goals, weeklyWorkouts: parseInt(text) || 0 })}
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Daily Water Goal (glasses)</Text>
                    <TextInput
                      style={styles.input}
                      value={goals.dailyWater.toString()}
                      onChangeText={(text) => setGoals({ ...goals, dailyWater: parseInt(text) || 0 })}
                      keyboardType="numeric"
                      placeholderTextColor={theme.colors.textLight}
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.submitButton, theme.shadows.medium]} 
                    onPress={() => {
                      setShowGoalsModal(false);
                      Alert.alert('Success! 🎯', 'Your goals have been updated successfully!', [
                        { text: 'Perfect!', style: 'default' }
                      ]);
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[theme.colors.warning, theme.colors.warning + 'dd']}
                      style={styles.submitButtonGradient}
                    >
                      <Ionicons name="save-outline" size={20} color={theme.colors.white} />
                      <Text style={styles.submitText}>Save Goals</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  statusBarSpacer: {
    height: getStatusBarHeight(),
  },
  content: {
    flex: 1,
    marginBottom: 90,
  },
  scrollContent: {
    flex: 1,
    marginBottom: 90,
  },
  header: {
    paddingBottom: theme.spacing.xxl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: theme.colors.white,
    opacity: 0.9,
    fontWeight: '500',
  },
  profileButton: {
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  profileButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
  },
  statCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    minHeight: 140,
    overflow: 'visible',
    position: 'relative',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
    flex: 1,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    flexShrink: 0,
  },
  statCardContent: {
    flex: 1,
    minWidth: 0,
  },
  statTitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  statGoal: {
    fontSize: 11,
    color: theme.colors.textLight,
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  progressBarContainer: {
    marginTop: theme.spacing.md,
    width: '100%',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: theme.colors.gray200,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  sectionContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  exerciseDetailCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  exerciseDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  exerciseDetailIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  exerciseDetailContent: {
    flex: 1,
  },
  exerciseDetailTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  exerciseDetailSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  exerciseDetailStats: {
    alignItems: 'flex-end',
  },
  exerciseDetailTime: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  exerciseDetailCalories: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  exerciseDetailProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseDetailProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.gray200,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
  },
  exerciseDetailProgressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  exerciseDetailAvg: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  chartsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    paddingHorizontal: theme.spacing.sm,
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  actionButtonIcon: {
    marginBottom: theme.spacing.sm,
  },
  actionButtonText: {
    fontSize: 13,
    color: theme.colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  progressTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  progressSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  recentWorkoutsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  workoutItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  workoutTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  workoutType: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  workoutDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  workoutDetails: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  profileHeader: {
    paddingBottom: theme.spacing.xxl,
  },
  profileHeaderContent: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  avatarContainer: {
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  profileSubtitle: {
    fontSize: 16,
    color: theme.colors.white,
    opacity: 0.9,
    fontWeight: '500',
  },
  goalsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  bottomNavGradient: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: theme.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  activeTab: {},
  activeTabIcon: {
    backgroundColor: theme.colors.primary + '15',
  },
  tabText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSafeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    fontSize: 16,
    backgroundColor: theme.colors.gray50,
    color: theme.colors.text,
    fontWeight: '500',
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exerciseButton: {
    width: '48%',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.gray50,
  },
  selectedExercise: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
  },
  exerciseText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: theme.spacing.sm,
  },
  selectedExerciseText: {
    fontWeight: '700',
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    backgroundColor: theme.colors.gray50,
  },
  intensityText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  submitButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginTop: theme.spacing.md,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  submitText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: theme.spacing.sm,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});

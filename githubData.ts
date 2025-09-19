import { Base64 } from 'js-base64';
import { GITHUB_TOKEN } from '@env';
import { Alert } from 'react-native';

const OWNER = "Nadeem4380";
const REPO = "FitnessTracker-data";
const BRANCH = "main";

const HEADERS = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  'Cache-Control': 'no-cache', // Force no caching
};

export async function fetchGithubJson(filename: string) {
  // Add timestamp to prevent caching
  const timestamp = Date.now();
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filename}?ref=${BRANCH}&t=${timestamp}`;
  
  try {
    const res = await fetch(url, { 
      headers: HEADERS,
      cache: 'no-store' // Prevent browser caching
    });
    
    if (res.status === 404) {
      if (filename === "goals.json") {
        return {
          content: {
            dailySteps: 10000,
            dailyCalories: 500,
            weeklyWorkouts: 5,
            dailyWater: 8,
          },
          sha: "",
        };
      }
      if (filename === "profile.json") {
        return {
          content: {
            name: "Nadeem4380",
            age: 25,
            height: 175,
            weight: 75,
            activityLevel: "moderate",
          },
          sha: "",
        };
      }
      return { content: [], sha: "" };
    }
    
    const data = await res.json();
    const content = JSON.parse(Base64.decode(data.content));
    return { content, sha: data.sha };
  } catch (err) {
    Alert.alert("GitHub Fetch Error", err instanceof Error ? err.message : String(err));
    throw err;
  }
}

export async function saveGithubJson(filename: string, content: any, existingSha: string) {
  const timestamp = Date.now();
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filename}?t=${timestamp}`;
  
  try {
    const body: any = {
      message: `Update ${filename} - ${new Date().toISOString()}`,
      content: Base64.encode(JSON.stringify(content, null, 2)),
      branch: BRANCH,
    };
    
    if (existingSha) {
      body.sha = existingSha;
    }
    
    const res = await fetch(url, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("GitHub Save Error Response:", errorText);
      Alert.alert("GitHub Save Error", errorText);
      throw new Error(errorText);
    }
    
    const data = await res.json();
    return data;
  } catch (err) {
    Alert.alert("GitHub Save Error", err instanceof Error ? err.message : String(err));
    throw err;
  }
}

// ULTRA-SAFE save functions
export async function saveWorkouts(updatedWorkouts: any[]) {
  try {
    console.log("Saving workouts...");
    // Always fetch the absolute latest SHA
    const { sha: latestSha } = await fetchGithubJson("workouts.json");
    console.log("Latest SHA:", latestSha);
    
    await saveGithubJson("workouts.json", updatedWorkouts, latestSha);
    console.log("Workouts saved successfully");
  } catch (error) {
    console.error("Error saving workouts:", error);
    throw error;
  }
}

export async function saveStats(updatedStats: any[]) {
  try {
    console.log("Saving stats...");
    const { sha: latestSha } = await fetchGithubJson("stats.json");
    console.log("Latest stats SHA:", latestSha);
    
    await saveGithubJson("stats.json", updatedStats, latestSha);
    console.log("Stats saved successfully");
  } catch (error) {
    console.error("Error saving stats:", error);
    throw error;
  }
}

export async function saveGoals(updatedGoals: any) {
  try {
    const { sha: latestSha } = await fetchGithubJson("goals.json");
    await saveGithubJson("goals.json", updatedGoals, latestSha);
  } catch (error) {
    console.error("Error saving goals:", error);
    throw error;
  }
}

export async function saveProfile(updatedProfile: any) {
  try {
    const { sha: latestSha } = await fetchGithubJson("profile.json");
    await saveGithubJson("profile.json", updatedProfile, latestSha);
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
}
export async function fetchGithubUser() {
  const url = `https://api.github.com/users/${OWNER}`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (res.ok) {
      const userData = await res.json();
      return {
        avatar_url: userData.avatar_url,
        name: userData.name || userData.login,
        bio: userData.bio,
      };
    }
    return null;
  } catch (err) {
    console.error("Error fetching GitHub user:", err);
    return null;
  }
}

import { Base64 } from 'js-base64';
import { GITHUB_TOKEN } from '@env';
import { Alert } from 'react-native';

// Set these to your own GitHub username and repository
const OWNER = "Nadeem4380"; // <-- REPLACE with your GitHub username
const REPO = "FitnessTracker-data";        // <-- REPLACE with your repository name
const BRANCH = "main";                // <-- REPLACE if your branch is different

const HEADERS = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

export async function fetchGithubJson(filename: string) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filename}?ref=${BRANCH}`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (res.status === 404) {
      // File does not exist, return sensible defaults
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
      // For workouts.json and stats.json, return empty array
      return { content: [], sha: "" };
    }
    const data = await res.json();
    // decode base64 content using js-base64
    const content = JSON.parse(Base64.decode(data.content));
    return { content, sha: data.sha };
  } catch (err) {
    Alert.alert("GitHub Fetch Error", err instanceof Error ? err.message : String(err));
    throw err;
  }
}

export async function saveGithubJson(filename: string, content: any, existingSha: string) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filename}`;
  try {
    const body: any = {
      message: `Update ${filename}`,
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

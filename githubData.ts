import { GITHUB_TOKEN } from '@env';
import { Alert } from 'react-native';

const OWNER = "Nadeem4380"; // Change this to your GitHub username
const REPO = "FitnessTracker-data"; // Change this to your repo name
const BRANCH = "main"; // Or "master" or whichever branch you want to edit

const HEADERS = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

export async function fetchGithubJson(filename: string) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filename}?ref=${BRANCH}`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (res.status === 404) {
      // File does not exist, return default
      return { content: filename.endsWith('.json') ? [] : {}, sha: '' };
    }
    const data = await res.json();
    // decode base64 content
    const content = JSON.parse(
      Buffer.from(data.content, "base64").toString()
    );
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
      content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
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

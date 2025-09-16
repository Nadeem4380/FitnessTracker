export async function fetchGithubJson(file: string): Promise<any> {
  // Implement API call to fetch JSON from your GitHub repo
  // Example: fetch from raw.githubusercontent.com
  const GITHUB_OWNER = "YourGitHubUsername";
  const GITHUB_REPO = "fitness-app-data";
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${file}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return await response.json();
}

export async function saveGithubJson(file: string, data: any, githubToken: string): Promise<void> {
  // Implement GitHub API call to save JSON to your repo
  const GITHUB_OWNER = "Nadeem4380";
  const GITHUB_REPO = "FitnessTracker";
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${file}`;
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `token ${githubToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update " + file,
      content,
    }),
  });
  if (!res.ok) throw new Error("Failed to save data");
}
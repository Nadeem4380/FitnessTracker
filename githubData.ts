const GITHUB_TOKEN = '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';

export async function fetchGithubJson(file: string): Promise<any> {
  const GITHUB_OWNER = "Nadeem4380";
  const GITHUB_REPO = "FitnessTracker";
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${file}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return await response.json();
}

export async function saveGithubJson(file: string, data: any): Promise<void> {
  const GITHUB_OWNER = "YourGitHubUsername";
  const GITHUB_REPO = "fitness-app-data";
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${file}`;
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `token ${GITHUB_TOKEN}`, // <-- Use your token here!
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update " + file,
      content,
    }),
  });
  if (!res.ok) throw new Error("Failed to save data");
}

const GITHUB_TOKEN = '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';

export async function fetchGithubJson(file: string): Promise<any> {
  const GITHUB_OWNER = "Nadeem4380";
  const GITHUB_REPO = "FitnessTracker-data";
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${file}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return await response.json();
}

export async function saveGithubJson(filename: string, data: any, sha: string) {
 
  const response = await fetch(`https://api.github.com/repos/<OWNER>/<REPO>/contents/${filename}`, {
    method: 'PUT',
    headers: {
      'Authorization': `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`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Update ${filename}`,
      content: Buffer.from(JSON.stringify(data)).toString('base64'),
      sha: sha,
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update ${filename}: ${response.statusText}`);
  }
  return await response.json();
}

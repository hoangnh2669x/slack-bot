/**
 * GitLab API Client
 * Handles all GitLab API interactions
 */

const GITLAB_URL = process.env.GITLAB_URL || 'https://gitlab.com';
const GITLAB_TOKEN = process.env.GITLAB_TOKEN;

/**
 * Make GitLab API request
 * @param {string} endpoint - API endpoint (e.g., '/projects/123/merge_requests')
 * @param {object} options - Fetch options
 * @returns {Promise<object>} API response
 */
async function gitlabRequest(endpoint, options = {}) {
  if (!GITLAB_TOKEN) {
    throw new Error('GITLAB_TOKEN not configured');
  }

  const url = `${GITLAB_URL}/api/v4${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'PRIVATE-TOKEN': GITLAB_TOKEN,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitLab API error ${response.status}: ${errorText}`);
  }

  return await response.json();
}

/**
 * List merge requests for a project
 * @param {string} projectPath - GitLab project path (e.g., "AT/wa2.newcr")
 * @param {string} state - MR state: 'opened', 'closed', 'merged', 'all'
 * @returns {Promise<Array>} List of merge requests
 */
export async function listMergeRequests(projectPath, state = 'opened') {
  const encodedPath = encodeURIComponent(projectPath);
  return await gitlabRequest(`/projects/${encodedPath}/merge_requests?state=${state}`);
}

/**
 * Get merge request changes/diff
 * @param {string} projectPath - GitLab project path
 * @param {number} mrIid - Merge request IID
 * @returns {Promise<object>} MR changes with diff
 */
export async function getMergeRequestChanges(projectPath, mrIid) {
  const encodedPath = encodeURIComponent(projectPath);
  return await gitlabRequest(`/projects/${encodedPath}/merge_requests/${mrIid}/changes`);
}

/**
 * Get merge request notes/comments
 * @param {string} projectPath - GitLab project path
 * @param {number} mrIid - Merge request IID
 * @returns {Promise<Array>} List of notes
 */
export async function getMergeRequestNotes(projectPath, mrIid) {
  const encodedPath = encodeURIComponent(projectPath);
  return await gitlabRequest(`/projects/${encodedPath}/merge_requests/${mrIid}/notes`);
}

/**
 * Get merge request commits
 * @param {string} projectPath - GitLab project path
 * @param {number} mrIid - Merge request IID
 * @returns {Promise<Array>} List of commits
 */
export async function getMergeRequestCommits(projectPath, mrIid) {
  const encodedPath = encodeURIComponent(projectPath);
  return await gitlabRequest(`/projects/${encodedPath}/merge_requests/${mrIid}/commits`);
}

/**
 * Post a comment to merge request
 * @param {number} projectId - GitLab project ID
 * @param {number} mrIid - Merge request IID
 * @param {string} body - Comment text
 * @returns {Promise<object>} Created note
 */
export async function postMergeRequestNote(projectId, mrIid, body) {
  return await gitlabRequest(`/projects/${projectId}/merge_requests/${mrIid}/notes`, {
    method: 'POST',
    body: JSON.stringify({ body })
  });
}

/**
 * Post inline comment to merge request
 * @param {number} projectId - GitLab project ID
 * @param {number} mrIid - Merge request IID
 * @param {string} body - Comment text
 * @param {object} position - Position object with file path and line number
 * @returns {Promise<object>} Created discussion
 */
export async function postMergeRequestInlineComment(projectId, mrIid, body, position) {
  return await gitlabRequest(`/projects/${projectId}/merge_requests/${mrIid}/discussions`, {
    method: 'POST',
    body: JSON.stringify({
      body,
      position
    })
  });
}

/**
 * Approve merge request
 * @param {number} projectId - GitLab project ID
 * @param {number} mrIid - Merge request IID
 * @returns {Promise<object>} Approval response
 */
export async function approveMergeRequest(projectId, mrIid) {
  return await gitlabRequest(`/projects/${projectId}/merge_requests/${mrIid}/approve`, {
    method: 'POST'
  });
}

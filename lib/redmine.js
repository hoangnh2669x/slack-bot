/**
 * Redmine Integration Module
 * Handles creation of issues/tasks in Redmine via REST API
 */

/**
 * Create a new issue in Redmine
 * @param {Object} args - Issue parameters
 * @param {string} args.subject - Issue title (required)
 * @param {string} args.description - Issue description (optional)
 * @param {number} args.priority_id - Priority: 3=Low, 4=Normal, 5=High, 6=Urgent, 7=Immediate
 * @param {number} args.tracker_id - Tracker: 1=Bug, 2=Feature, 3=Support
 * @param {number} args.estimated_hours - Estimated hours (optional)
 * @returns {Promise<Object>} Result object with success status and issue details
 */
export async function executeCreateRedmineIssue(args) {
  const {
    subject,
    description,
    priority_id = 4, // Default: Normal
    tracker_id = 2,  // Default: Feature
    estimated_hours
  } = args;

  console.log(`[REDMINE] Creating issue: ${subject}`);

  // Get Redmine config from env
  const redmineUrl = process.env.REDMINE_URL;
  const redmineApiKey = process.env.REDMINE_API_KEY;
  const projectId = process.env.REDMINE_DEFAULT_PROJECT_ID;

  // Validate config
  if (!redmineUrl || !redmineApiKey || !projectId) {
    console.error('[REDMINE] Missing configuration');
    return {
      success: false,
      message: 'Redmine chưa được cấu hình. Cần set REDMINE_URL, REDMINE_API_KEY, và REDMINE_DEFAULT_PROJECT_ID'
    };
  }

  try {
    // Build issue payload
    const issueData = {
      issue: {
        project_id: parseInt(projectId),
        subject: subject,
        tracker_id: tracker_id,
        priority_id: priority_id
      }
    };

    // Add optional fields
    if (description) {
      issueData.issue.description = description;
    }
    if (estimated_hours) {
      issueData.issue.estimated_hours = estimated_hours;
    }

    console.log('[REDMINE] Payload:', JSON.stringify(issueData));

    // Call Redmine API
    const response = await fetch(`${redmineUrl}/issues.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Redmine-API-Key': redmineApiKey
      },
      body: JSON.stringify(issueData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[REDMINE] API error:', response.status, errorText);
      return {
        success: false,
        message: `Lỗi khi tạo issue: ${response.status} - ${errorText}`
      };
    }

    const result = await response.json();
    const issueId = result.issue?.id;
    const issueUrl = `${redmineUrl}/issues/${issueId}`;

    console.log('[REDMINE] Issue created:', issueId);

    return {
      success: true,
      message: `Đã tạo issue #${issueId} thành công`,
      issue: {
        id: issueId,
        url: issueUrl,
        subject: subject,
        priority: getPriorityName(priority_id),
        tracker: getTrackerName(tracker_id)
      }
    };
  } catch (error) {
    console.error('[REDMINE] Error:', error);
    return {
      success: false,
      message: `Lỗi khi tạo issue: ${error.message}`
    };
  }
}

/**
 * Get priority name from ID
 * @param {number} id - Priority ID
 * @returns {string} Priority name
 */
function getPriorityName(id) {
  const priorities = {
    3: 'Low',
    4: 'Normal',
    5: 'High',
    6: 'Urgent',
    7: 'Immediate'
  };
  return priorities[id] || 'Normal';
}

/**
 * Get tracker name from ID
 * @param {number} id - Tracker ID
 * @returns {string} Tracker name
 */
function getTrackerName(id) {
  const trackers = {
    1: 'Bug',
    2: 'Feature',
    3: 'Support'
  };
  return trackers[id] || 'Feature';
}

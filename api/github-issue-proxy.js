// GitHub Issue Proxy for GitHub Pages
// This file simulates the GitHub Actions workflow for development

const GITHUB_REPO = 'SalyyS1/20thang10-gift'; // Repository của SalyyS1
const GITHUB_TOKEN = 'your_github_token'; // This should be in environment variables

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const data = await request.json();

    if (data.event_type === 'create_issue') {
      // Simulate creating an issue
      const issueData = {
        title: `Gift Selection - ${data.client_payload.timestamp}`,
        body: `**Box Number:** ${data.client_payload.boxNumber}\n\n**Name:** ${data.client_payload.name}\n\n**Phone:** ${data.client_payload.phone}\n\n**Address:** ${data.client_payload.address}\n\n**Timestamp:** ${data.client_payload.timestamp}`
      };

      // In a real implementation, this would call GitHub API
      // For now, we'll just log it and return success
      console.log('Issue would be created:', issueData);

      return new Response(JSON.stringify({ success: true, message: 'Issue created successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Invalid event type', { status: 400 });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// For GitHub Pages, we need to handle this differently
// This is a placeholder that will be replaced by the actual GitHub Actions workflow
if (typeof window !== 'undefined') {
  // Browser environment - this won't work on GitHub Pages
  console.warn('GitHub Issue Proxy is not available in browser environment');
}

export { handleRequest };

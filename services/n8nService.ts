
const N8N_WEBHOOK_URL = 'https://n8n.n8nattadeep.dpdns.org/webhook/calender-agent';

export async function sendToN8n(message: string, sessionId: string): Promise<string> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n webhook error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // The n8n workflow returns a JSON object: {"text": "Response message"}
    // This change extracts the text content to display it cleanly in the UI.
    if (data && typeof data.text === 'string') {
      return data.text;
    }

    // Fallback if the response format is unexpected, to aid in debugging.
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error sending message to n8n:', error);

    // Provide a more specific and helpful error message for CORS issues.
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return 'Error: Connection to the agent failed. This could be a network issue or a cross-origin (CORS) problem.';
    }

    return `Error: Unable to connect to n8n or process response. ${error instanceof Error ? error.message : String(error)}`;
  }
}

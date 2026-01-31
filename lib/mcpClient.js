/**
 * MCP Client for Redmine Server (SSE Transport)
 * Connects to MCP server deployed at Vercel
 */

const MCP_SERVER_URL = 'https://redmine-mcp-server.vercel.app/api/mcp';

/**
 * Call MCP tool via HTTP (SSE response format)
 * @param {string} toolName - Tool name from MCP server
 * @param {Object} args - Tool arguments
 * @returns {Promise<Object>} Tool result
 */
export async function callMCPTool(toolName, args = {}) {
  try {
    console.log(`[MCP] Calling tool: ${toolName}`, JSON.stringify(args));

    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args
        }
      })
    });

    if (!response.ok) {
      console.error(`[MCP] HTTP error: ${response.status}`);
      throw new Error(`MCP HTTP error: ${response.status}`);
    }

    const text = await response.text();
    console.log('[MCP] Raw response:', text.substring(0, 200));

    // Parse SSE format: "event: message\ndata: {...}"
    const dataMatch = text.match(/data: ({.*})/);
    if (!dataMatch) {
      console.error('[MCP] Invalid SSE format');
      throw new Error('Invalid SSE response format');
    }

    const data = JSON.parse(dataMatch[1]);
    console.log('[MCP] Parsed result:', JSON.stringify(data.result).substring(0, 200));

    // Extract text content from MCP response
    if (data.result?.content?.[0]?.text) {
      return {
        success: true,
        message: data.result.content[0].text,
        data: data.result.content[0].text
      };
    }

    // Check for error in result
    if (data.result?.content?.[0]?.text?.includes('❌ Error')) {
      return {
        success: false,
        message: data.result.content[0].text
      };
    }

    return {
      success: true,
      data: data.result,
      message: 'Tool executed successfully'
    };

  } catch (error) {
    console.error('[MCP] Error calling tool:', error);
    return {
      success: false,
      error: error.message,
      message: `Lỗi khi gọi MCP tool: ${error.message}`
    };
  }
}

/**
 * List available MCP tools (for debugging)
 * @returns {Promise<Array>} List of tools
 */
export async function listMCPTools() {
  try {
    console.log('[MCP] Listing available tools');

    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/list',
        params: {}
      })
    });

    const text = await response.text();
    const dataMatch = text.match(/data: ({.*})/);
    const data = JSON.parse(dataMatch[1]);

    const tools = data.result?.tools || [];
    console.log(`[MCP] Found ${tools.length} tools:`, tools.map(t => t.name).join(', '));

    return tools;

  } catch (error) {
    console.error('[MCP] Error listing tools:', error);
    return [];
  }
}

/**
 * Smart Light Control Module
 * Handles smart light operations (mock implementation)
 */

/**
 * Control smart light
 * @param {Object} args - Control parameters
 * @param {string} args.action - Action: 'on' or 'off'
 * @param {number} args.brightness - Brightness level 0-100 (optional, only for 'on')
 * @returns {Object} Result object with success status and state
 */
export function executeControlLight(args) {
  const { action, brightness } = args;

  console.log(`[LIGHT CONTROL] Action: ${action}, Brightness: ${brightness || 'N/A'}`);

  if (action === 'on') {
    const level = brightness || 100;
    return {
      success: true,
      message: `Đã bật đèn với độ sáng ${level}%`,
      state: {
        power: 'on',
        brightness: level
      }
    };
  } else if (action === 'off') {
    return {
      success: true,
      message: 'Đã tắt đèn',
      state: {
        power: 'off',
        brightness: 0
      }
    };
  } else {
    return {
      success: false,
      message: 'Hành động không hợp lệ'
    };
  }
}

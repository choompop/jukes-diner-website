/**
 * Weather icon and color mapping utilities
 * Maps weather conditions to appropriate Lucide icons and color schemes
 */

/**
 * Get the appropriate Lucide icon name for a weather condition
 * @param {string} condition - Weather condition string (e.g., 'Clear', 'Rainy', 'Snowy')
 * @returns {string} - Lucide icon name ('Sun', 'Cloud', 'CloudRain', etc.)
 */
export function getWeatherIcon(condition) {
  // Normalize the condition string (case-insensitive)
  const normalized = (condition || '').trim().toLowerCase();

  // Map conditions to icon names
  if (normalized === 'clear' || normalized === 'sunny') {
    return 'Sun';
  }
  if (normalized === 'partly cloudy' || normalized === 'cloudy') {
    return 'Cloud';
  }
  if (normalized === 'rainy') {
    return 'CloudRain';
  }
  if (normalized === 'snowy') {
    return 'CloudSnow';
  }
  if (normalized === 'foggy') {
    return 'CloudFog';
  }
  
  // Safe fallback for unknown conditions
  return 'Cloud';
}

/**
 * Get the appropriate MetricCard color for a weather condition
 * Maps to MetricCard's allowed colors: 'red' | 'teal' | 'orange' | 'purple' | 'blue'
 * @param {string} condition - Weather condition string
 * @returns {string} - MetricCard color name
 */
export function getWeatherColor(condition) {
  // Normalize the condition string (case-insensitive)
  const normalized = (condition || '').trim().toLowerCase();

  // Map conditions to MetricCard-compatible colors
  if (normalized === 'clear' || normalized === 'sunny') {
    return 'orange'; // amber/yellow → orange (closest warm color)
  }
  if (normalized === 'rainy') {
    return 'blue';
  }
  if (normalized === 'snowy') {
    return 'blue'; // slate/blue → blue
  }
  if (normalized === 'partly cloudy' || normalized === 'cloudy') {
    return 'blue'; // slate/gray → blue (cool neutral)
  }
  if (normalized === 'foggy') {
    return 'blue'; // gray → blue
  }
  
  // Blue for unknown (safe neutral default)
  return 'blue';
}

/**
 * Get combined icon and color configuration for a weather condition
 * @param {string} condition - Weather condition string
 * @returns {{ icon: string, color: string }} - Icon name and color
 */
export function getWeatherIconConfig(condition) {
  return {
    icon: getWeatherIcon(condition),
    color: getWeatherColor(condition),
  };
}

/**
 * Weather icon and color mapping utilities
 * Maps weather conditions to appropriate Lucide icons and color schemes
 */

// MetricCard allowed colors
export type MetricCardColor = 'red' | 'teal' | 'orange' | 'purple' | 'blue';

// Weather icon names from Lucide
export type WeatherIconName = 'Sun' | 'Cloud' | 'CloudRain' | 'CloudSnow' | 'CloudFog';

/**
 * Get the appropriate Lucide icon name for a weather condition
 * @param condition - Weather condition string (e.g., 'Clear', 'Rainy', 'Snowy')
 * @returns Lucide icon name
 */
export function getWeatherIcon(condition: string): WeatherIconName;

/**
 * Get the appropriate MetricCard color for a weather condition
 * Maps to MetricCard's allowed colors: 'red' | 'teal' | 'orange' | 'purple' | 'blue'
 * @param condition - Weather condition string
 * @returns MetricCard color name
 */
export function getWeatherColor(condition: string): MetricCardColor;

/**
 * Get combined icon and color configuration for a weather condition
 * @param condition - Weather condition string
 * @returns Icon name and color
 */
export function getWeatherIconConfig(condition: string): {
  icon: WeatherIconName;
  color: MetricCardColor;
};

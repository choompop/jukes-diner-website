import test from 'node:test';
import assert from 'node:assert/strict';
import { getWeatherIconConfig } from '../lib/weather-icons.mjs';

test('getWeatherIconConfig returns Sun icon for Clear condition', () => {
  const config = getWeatherIconConfig('Clear');
  assert.equal(config.icon, 'Sun');
  assert.equal(config.color, 'orange');
});

test('getWeatherIconConfig returns Sun icon for Sunny condition', () => {
  const config = getWeatherIconConfig('Sunny');
  assert.equal(config.icon, 'Sun');
  assert.equal(config.color, 'orange');
});

test('getWeatherIconConfig returns Cloud icon for Partly Cloudy condition', () => {
  const config = getWeatherIconConfig('Partly Cloudy');
  assert.equal(config.icon, 'Cloud');
  assert.equal(config.color, 'blue');
});

test('getWeatherIconConfig returns CloudRain icon for Rainy condition', () => {
  const config = getWeatherIconConfig('Rainy');
  assert.equal(config.icon, 'CloudRain');
  assert.equal(config.color, 'blue');
});

test('getWeatherIconConfig returns CloudSnow icon for Snowy condition', () => {
  const config = getWeatherIconConfig('Snowy');
  assert.equal(config.icon, 'CloudSnow');
  assert.equal(config.color, 'blue');
});

test('getWeatherIconConfig returns CloudFog icon for Foggy condition', () => {
  const config = getWeatherIconConfig('Foggy');
  assert.equal(config.icon, 'CloudFog');
  assert.equal(config.color, 'blue');
});

test('getWeatherIconConfig returns Cloud icon for unknown condition', () => {
  const config = getWeatherIconConfig('Unknown Weather');
  assert.equal(config.icon, 'Cloud');
  assert.equal(config.color, 'blue');
});

test('getWeatherIconConfig handles empty string gracefully', () => {
  const config = getWeatherIconConfig('');
  assert.equal(config.icon, 'Cloud');
  assert.equal(config.color, 'blue');
});

test('getWeatherIconConfig is case-insensitive', () => {
  const config = getWeatherIconConfig('SUNNY');
  assert.equal(config.icon, 'Sun');
  assert.equal(config.color, 'orange');
});

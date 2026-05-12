import test from 'node:test';
import assert from 'node:assert/strict';
import { getWeatherIcon, getWeatherColor } from '../lib/weather-icons.mjs';

/**
 * Tests for weather icon helper (getWeatherIcon)
 * Following TDD: tests written first, now validating implementation
 */

test('getWeatherIcon returns Sun for Clear condition', () => {
  const icon = getWeatherIcon('Clear');
  assert.equal(icon, 'Sun');
});

test('getWeatherIcon returns Sun for Sunny condition (fallback)', () => {
  const icon = getWeatherIcon('Sunny');
  assert.equal(icon, 'Sun');
});

test('getWeatherIcon returns Cloud for Partly Cloudy condition', () => {
  const icon = getWeatherIcon('Partly Cloudy');
  assert.equal(icon, 'Cloud');
});

test('getWeatherIcon returns CloudRain for Rainy condition', () => {
  const icon = getWeatherIcon('Rainy');
  assert.equal(icon, 'CloudRain');
});

test('getWeatherIcon returns CloudSnow for Snowy condition', () => {
  const icon = getWeatherIcon('Snowy');
  assert.equal(icon, 'CloudSnow');
});

test('getWeatherIcon returns CloudFog for Foggy condition', () => {
  const icon = getWeatherIcon('Foggy');
  assert.equal(icon, 'CloudFog');
});

test('getWeatherIcon returns default Cloud for unknown condition', () => {
  const icon = getWeatherIcon('Unknown');
  assert.equal(icon, 'Cloud');
});

test('getWeatherColor returns orange for Clear/Sunny conditions', () => {
  assert.equal(getWeatherColor('Clear'), 'orange');
  assert.equal(getWeatherColor('Sunny'), 'orange');
});

test('getWeatherColor returns blue for Partly Cloudy condition', () => {
  assert.equal(getWeatherColor('Partly Cloudy'), 'blue');
});

test('getWeatherColor returns blue for Rainy condition', () => {
  assert.equal(getWeatherColor('Rainy'), 'blue');
});

test('getWeatherColor returns blue for Snowy condition', () => {
  assert.equal(getWeatherColor('Snowy'), 'blue');
});

test('getWeatherColor returns blue for Foggy condition', () => {
  assert.equal(getWeatherColor('Foggy'), 'blue');
});

test('getWeatherColor returns blue for unknown condition (safe default)', () => {
  assert.equal(getWeatherColor('Unknown'), 'blue');
});

// Agent Outputs registry for managing agent drafts and handoffs
// Provides CRUD operations, filtering, and validation for agent outputs

import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

const OUTPUTS_FILE = path.join(process.cwd(), 'data', 'agent-outputs.json');

// Valid output types
const OUTPUT_TYPES = [
  'outreach_draft',
  'booking_handoff',
  'qa_finding',
  'build_summary',
  'research_note',
  'finance_note',
  'brand_content_draft',
];

// Valid output statuses
const OUTPUT_STATUSES = ['pending', 'approved', 'rejected', 'archived'];

// In-memory cache for outputs (reloaded from file on each operation)
let outputsCache = null;

/**
 * Load outputs from JSON file
 */
function loadOutputs() {
  if (outputsCache) {
    return outputsCache;
  }
  
  try {
    const raw = readFileSync(OUTPUTS_FILE, 'utf8');
    const data = JSON.parse(raw);
    outputsCache = data.outputs || [];
    return outputsCache;
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

/**
 * Save outputs to JSON file
 */
function saveOutputs(outputs) {
  const data = {
    outputs,
    lastUpdated: new Date().toISOString(),
  };
  writeFileSync(OUTPUTS_FILE, JSON.stringify(data, null, 2), 'utf8');
  outputsCache = outputs;
}

/**
 * Get all valid output types
 */
export function getOutputTypes() {
  return OUTPUT_TYPES;
}

/**
 * Get all valid output statuses
 */
export function getOutputStatuses() {
  return OUTPUT_STATUSES;
}

/**
 * Get all outputs
 */
export function getAllOutputs() {
  return loadOutputs();
}

/**
 * Get output by ID
 */
export function getOutputById(id) {
  const outputs = loadOutputs();
  const found = outputs.find((output) => output.id === id);
  return found || null;
}

/**
 * Generate a unique ID for outputs
 */
function generateOutputId() {
  return `out_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new output
 */
export function createOutput(outputData) {
  const outputs = loadOutputs();
  
  const newOutput = {
    id: generateOutputId(),
    ...outputData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  outputs.push(newOutput);
  saveOutputs(outputs);
  
  return newOutput;
}

/**
 * Update an existing output
 */
export function updateOutput(id, updates) {
  const outputs = loadOutputs();
  const index = outputs.findIndex((output) => output.id === id);
  
  if (index === -1) {
    return null;
  }
  
  outputs[index] = {
    ...outputs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveOutputs(outputs);
  
  return outputs[index];
}

/**
 * Delete an output
 */
export function deleteOutput(id) {
  const outputs = loadOutputs();
  const index = outputs.findIndex((output) => output.id === id);
  
  if (index === -1) {
    return false;
  }
  
  outputs.splice(index, 1);
  saveOutputs(outputs);
  
  return true;
}

/**
 * Filter outputs by criteria
 */
export function filterOutputs(filters = {}) {
  const outputs = loadOutputs();
  
  if (Object.keys(filters).length === 0) {
    return outputs;
  }
  
  return outputs.filter((output) => {
    if (filters.type && output.type !== filters.type) {
      return false;
    }
    if (filters.status && output.status !== filters.status) {
      return false;
    }
    if (filters.producingAgent && output.producingAgent !== filters.producingAgent) {
      return false;
    }
    return true;
  });
}

/**
 * Validate an output object
 */
export function validateOutput(output) {
  const errors = [];
  
  // Check required fields
  const requiredFields = [
    'type',
    'title',
    'summary',
    'body',
    'producingAgent',
    'status',
    'approvalRequired',
  ];
  
  for (const field of requiredFields) {
    if (output[field] === undefined || output[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate type
  if (output.type && !OUTPUT_TYPES.includes(output.type)) {
    errors.push(`Invalid type: ${output.type}. Must be one of: ${OUTPUT_TYPES.join(', ')}`);
  }
  
  // Validate status
  if (output.status && !OUTPUT_STATUSES.includes(output.status)) {
    errors.push(`Invalid status: ${output.status}. Must be one of: ${OUTPUT_STATUSES.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Agent Outputs registry for managing agent drafts and handoffs
// Server-side module - imports from .mjs files
import {
  getAllOutputs as getAll,
  getOutputTypes as getTypes,
  getOutputStatuses as getStatuses,
  filterOutputs as filter,
} from './agent-outputs.mjs';

export function getAllOutputs() {
  return getAll();
}

export function getOutputTypes() {
  return getTypes();
}

export function getOutputStatuses() {
  return getStatuses();
}

export function filterOutputs(filters) {
  return filter(filters);
}

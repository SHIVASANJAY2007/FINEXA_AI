/**
 * hsaController.js
 * 
 * Re-routed to FINEXA Rule Induction Classifier (RIPPER / CBA Decision Engine).
 */

import { classifyWithRIPPER } from './ripperController.js';

export const optimizeWithHSA = classifyWithRIPPER;
export const classifyWithHSA = classifyWithRIPPER;

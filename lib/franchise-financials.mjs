import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const DEFAULT_FINANCIALS_FILE_PATH = path.join(process.cwd(), 'data', 'franchise-financials.json');

const DEFAULT_FINANCIAL_MANAGEMENT = {
  version: 1,
  title: "Juke's Diner Financial Management",
  updatedAt: '2026-05-08',
  period: {
    label: 'Current operating week',
    startDate: '2026-05-04',
    endDate: '2026-05-10',
  },
  units: [
    {
      id: 'event-truck',
      name: 'Event Truck',
      type: 'mobile',
      owner: 'Event Operator',
      stripe: { mode: 'connect', accountKey: 'STRIPE_ACCOUNT_EVENT_TRUCK', accountId: null, status: 'not_connected' },
      weekly: { sales: 18450, cogs: 5351, labor: 3911, fixedOperations: 800, royalties: 1107, marketingFund: 369, taxesReserve: 1476, otherVariableCosts: 161 },
    },
    {
      id: 'trailer-park',
      name: 'Trailer Park',
      type: 'location',
      owner: 'Trailer Park Operator',
      stripe: { mode: 'connect', accountKey: 'STRIPE_ACCOUNT_TRAILER_PARK', accountId: null, status: 'not_connected' },
      weekly: { sales: 9800, cogs: 3136, labor: 2254, fixedOperations: 3150, royalties: 588, marketingFund: 196, taxesReserve: 784, otherVariableCosts: 112 },
    },
    {
      id: 'east-nashville',
      name: 'East Nashville',
      type: 'location',
      owner: 'East Nashville GM',
      stripe: { mode: 'connect', accountKey: 'STRIPE_ACCOUNT_EAST_NASHVILLE', accountId: null, status: 'not_connected' },
      weekly: { sales: 17350, cogs: 5032, labor: 3817, fixedOperations: 2299, royalties: 1041, marketingFund: 347, taxesReserve: 1388, otherVariableCosts: 205 },
    },
    {
      id: 'corporate-account',
      name: 'Corporate Account',
      type: 'corporate',
      owner: 'Owner/CFO',
      stripe: { mode: 'connect', accountKey: 'STRIPE_ACCOUNT_CORPORATE', accountId: null, status: 'not_connected' },
      weekly: { sales: 4500, cogs: 900, labor: 900, fixedOperations: 1300, royalties: 0, marketingFund: 0, taxesReserve: 360, otherVariableCosts: 56 },
    },
  ],
  snapshot: {
    weeklySales: 8420,
    averageTicket: 18.75,
    transactions: 449,
    cashOnHand: 38400,
    foodCostPercent: 28.4,
    laborCostPercent: 18.2,
    controllableOpsPercent: 12,
    estimatedOperatingProfitPercent: 32,
    royaltyPercent: 6,
    marketingFundPercent: 2,
    debtServiceWeekly: 725,
  },
  obligations: [
    { id: 'sales-tax-reserve', title: 'Sales tax reserve', amount: 1850, dueDate: '2026-05-15', priority: 'high', owner: 'Owner/CFO', status: 'open' },
    { id: 'royalty-payment', title: 'Royalty payment', amount: 505, dueDate: '2026-05-12', priority: 'normal', owner: 'Franchisor', status: 'open' },
    { id: 'marketing-fund-payment', title: 'Marketing fund payment', amount: 168, dueDate: '2026-05-12', priority: 'low', owner: 'Franchisor', status: 'open' },
    { id: 'vendor-produce-invoice', title: 'Produce vendor invoice', amount: 1597, dueDate: '2026-05-10', priority: 'urgent', owner: 'Operator', status: 'open' },
  ],
  documents: [
    { id: 'pos-sales-summary', title: 'POS sales summary', category: 'sales', required: true, status: 'complete', owner: 'Operator' },
    { id: 'deposit-proof', title: 'Deposit proof', category: 'cash', required: true, status: 'complete', owner: 'Operator' },
    { id: 'refund-discount-report', title: 'Refund and discount report', category: 'sales', required: true, status: 'complete', owner: 'Operator' },
    { id: 'catering-invoices', title: 'Catering invoices', category: 'revenue', required: true, status: 'complete', owner: 'Catering Owner' },
    { id: 'tax-reserve-record', title: 'Tax reserve record', category: 'compliance', required: true, status: 'complete', owner: 'Owner/CFO' },
    { id: 'labor-report', title: 'Labor report', category: 'labor', required: true, status: 'missing', owner: 'Operator' },
    { id: 'vendor-invoices', title: 'Vendor invoices', category: 'food-cost', required: true, status: 'missing', owner: 'Kitchen/Ops' },
    { id: 'royalty-calculation', title: 'Royalty calculation', category: 'franchise', required: true, status: 'missing', owner: 'Franchisor' },
  ],
  financeActions: [
    { id: 'review-labor-schedule', title: 'Review next week labor schedule against sales forecast', priority: 'urgent', owner: 'Operator', status: 'open', source: 'exception' },
    { id: 'attach-source-docs', title: 'Attach missing finance source documents before weekly close', priority: 'high', owner: 'Flo + Finance Lead', status: 'open', source: 'document-readiness' },
  ],
  layers: [
    {
      id: 'sales-and-cash',
      name: 'Sales + Cash Visibility',
      summary: 'Daily sales, deposits, cash runway, receivables, and close-of-day variance.',
      metrics: [
        { id: 'weekly-sales', label: 'Weekly Sales', value: 8420, format: 'currency', target: 9000, direction: 'higher', owner: 'Operator' },
        { id: 'average-ticket', label: 'Average Ticket', value: 18.75, format: 'currency', target: 20, direction: 'higher', owner: 'Operator' },
        { id: 'cash-on-hand', label: 'Cash On Hand', value: 38400, format: 'currency', target: 30000, direction: 'higher', owner: 'Owner/CFO' },
      ],
    },
    {
      id: 'prime-costs',
      name: 'Prime Cost Control',
      summary: 'Food cost, labor cost, waste, overtime, scheduling discipline, and substitution pressure.',
      metrics: [
        { id: 'food-cost-percent', label: 'Food Cost %', value: 28.4, format: 'percent', target: 30, direction: 'lower', owner: 'Kitchen/Ops' },
        { id: 'labor-cost-percent', label: 'Labor Cost %', value: 18.2, format: 'percent', target: 17, direction: 'lower', owner: 'Operator' },
        { id: 'prime-cost-percent', label: 'Prime Cost %', value: 46.6, format: 'percent', target: 55, direction: 'lower', owner: 'Operator' },
      ],
    },
    {
      id: 'unit-economics',
      name: 'Unit Economics',
      summary: 'Contribution margin, catering close rate, breakeven sales, four-wall EBITDA, and payback visibility.',
      metrics: [
        { id: 'operating-profit-percent', label: 'Operating Profit %', value: 32, format: 'percent', target: 25, direction: 'higher', owner: 'Owner/CFO' },
        { id: 'breakeven-weekly-sales', label: 'Weekly Breakeven Sales', value: 5200, format: 'currency', target: 5000, direction: 'lower', owner: 'Owner/CFO' },
        { id: 'catering-close-rate', label: 'Catering Close Rate', value: 24, format: 'percent', target: 35, direction: 'higher', owner: 'Catering Owner' },
      ],
    },
    {
      id: 'compliance-and-royalties',
      name: 'Compliance + Royalties',
      summary: 'Royalty, marketing fund, tax reserve, insurance, licensing, and document readiness.',
      metrics: [
        { id: 'royalty-percent', label: 'Royalty %', value: 6, format: 'percent', target: 6, direction: 'fixed', owner: 'Franchisor' },
        { id: 'marketing-fund-percent', label: 'Marketing Fund %', value: 2, format: 'percent', target: 2, direction: 'fixed', owner: 'Franchisor' },
        { id: 'tax-reserve-percent', label: 'Tax Reserve %', value: 8, format: 'percent', target: 8, direction: 'higher', owner: 'Owner/CFO' },
      ],
    },
  ],
  visibilitySections: [
    {
      id: 'operator-daily-view',
      title: 'Operator Daily View',
      owner: 'Unit Operator',
      summary: 'What changed today and what needs correction before tomorrow.',
      questions: ['Did sales beat plan?', 'Did labor or food cost drift?', 'Are deposits and close-out clean?'],
    },
    {
      id: 'owner-cash-view',
      title: 'Owner Cash View',
      owner: 'Owner/CFO',
      summary: 'Cash runway, upcoming obligations, debt service, and distribution readiness.',
      questions: ['How many weeks of cash runway remain?', 'What bills or taxes are due?', 'Can cash be distributed safely?'],
    },
    {
      id: 'franchisor-scoreboard',
      title: 'Franchisor Scoreboard',
      owner: 'Franchise Support',
      summary: 'Comparable unit health, royalty visibility, coaching needs, and repeatable best practices.',
      questions: ['Which units are off-model?', 'Where is coaching needed?', 'What best practice should be copied?'],
    },
    {
      id: 'exception-review',
      title: 'Exception Review',
      owner: 'Flo + Finance Lead',
      summary: 'Only the variances and missing documents that require human attention.',
      questions: ['What is outside threshold?', 'Who owns the fix?', 'What source document is missing?'],
    },
  ],
  referenceFiles: [
    {
      id: 'weekly-finance-rhythm',
      title: 'Weekly Finance Rhythm',
      path: 'brain/files/weekly-finance-rhythm.md',
      summary: 'Operator cadence for sales, deposits, cost review, royalties, and cash decisions.',
      tags: ['finance', 'weekly', 'cash'],
    },
    {
      id: 'financial-kpi-dictionary',
      title: 'Financial KPI Dictionary',
      path: 'brain/files/financial-kpi-dictionary.md',
      summary: 'Definitions for prime cost, four-wall EBITDA, breakeven, royalty, and cash runway.',
      tags: ['finance', 'kpi', 'definitions'],
    },
    {
      id: 'document-retention-checklist',
      title: 'Financial Document Retention Checklist',
      path: 'brain/files/document-retention-checklist.md',
      summary: 'What receipts, invoices, statements, tax docs, licenses, and media evidence must be stored.',
      tags: ['documents', 'compliance', 'storage'],
    },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

export function createDefaultFinancialManagement() {
  return clone(DEFAULT_FINANCIAL_MANAGEMENT);
}

export function normalizeFinancialManagement(model = {}) {
  const defaultModel = createDefaultFinancialManagement();
  return {
    version: model.version ?? defaultModel.version,
    title: model.title ?? defaultModel.title,
    updatedAt: model.updatedAt ?? defaultModel.updatedAt,
    period: model.period ?? defaultModel.period,
    snapshot: { ...defaultModel.snapshot, ...(model.snapshot || {}) },
    units: Array.isArray(model.units) && model.units.length ? model.units : defaultModel.units,
    obligations: Array.isArray(model.obligations) ? model.obligations : defaultModel.obligations,
    documents: Array.isArray(model.documents) ? model.documents : defaultModel.documents,
    financeActions: Array.isArray(model.financeActions) ? model.financeActions : defaultModel.financeActions,
    layers: Array.isArray(model.layers) && model.layers.length ? model.layers : defaultModel.layers,
    visibilitySections: Array.isArray(model.visibilitySections) && model.visibilitySections.length
      ? model.visibilitySections
      : defaultModel.visibilitySections,
    referenceFiles: Array.isArray(model.referenceFiles) && model.referenceFiles.length
      ? model.referenceFiles
      : defaultModel.referenceFiles,
  };
}

export async function readFinancialManagement(filePath = DEFAULT_FINANCIALS_FILE_PATH) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return normalizeFinancialManagement(JSON.parse(raw));
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.name === 'SyntaxError')) {
      return createDefaultFinancialManagement();
    }
    throw error;
  }
}

export async function writeFinancialManagement(model, filePath = DEFAULT_FINANCIALS_FILE_PATH) {
  const normalized = normalizeFinancialManagement(model);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  return normalized;
}

export function getFinancialManagementStats(model) {
  const normalized = normalizeFinancialManagement(model);
  const snapshot = normalized.snapshot;
  return {
    weeklySales: snapshot.weeklySales,
    averageTicket: snapshot.averageTicket,
    transactions: snapshot.transactions,
    cashOnHand: snapshot.cashOnHand,
    foodCostPercent: snapshot.foodCostPercent,
    laborCostPercent: snapshot.laborCostPercent,
    primeCostPercent: round1(snapshot.foodCostPercent + snapshot.laborCostPercent),
    estimatedOperatingProfitPercent: snapshot.estimatedOperatingProfitPercent,
    royaltyDollars: round1(snapshot.weeklySales * (snapshot.royaltyPercent / 100)),
    marketingFundDollars: round1(snapshot.weeklySales * (snapshot.marketingFundPercent / 100)),
  };
}

export function getFinancialScorecard(model) {
  const normalized = normalizeFinancialManagement(model);
  const stats = getFinancialManagementStats(normalized);
  const alerts = [];
  if (stats.laborCostPercent > 17) {
    alerts.push({ title: 'Labor cost is above model', severity: 'watch', owner: 'Operator' });
  }
  if (stats.foodCostPercent > 30) {
    alerts.push({ title: 'Food cost is above target', severity: 'urgent', owner: 'Kitchen/Ops' });
  }
  if (stats.cashOnHand < 30000) {
    alerts.push({ title: 'Cash reserve below target', severity: 'urgent', owner: 'Owner/CFO' });
  }

  return {
    status: alerts.some((alert) => alert.severity === 'urgent') ? 'needs-attention' : alerts.length ? 'healthy-watch' : 'healthy',
    alerts,
    nextActions: [
      'Review weekly cash runway before approving owner draws.',
      'Compare labor schedule to sales forecast before the next high-volume service.',
      'Attach source documents for deposits, invoices, royalties, and tax reserve.',
    ],
  };
}

export function getFinancialVisibilitySections(model) {
  return normalizeFinancialManagement(model).visibilitySections;
}

function priorityRank(priority) {
  return { urgent: 0, high: 1, normal: 2, low: 3 }[priority] ?? 4;
}

export function getFinancialObligationSummary(model) {
  const normalized = normalizeFinancialManagement(model);
  const items = (normalized.obligations || []).filter((item) => item.status !== 'paid' && item.status !== 'archived');
  return {
    totalDue: round1(items.reduce((sum, item) => sum + Number(item.amount || 0), 0)),
    dueSoon: items.filter((item) => ['urgent', 'high', 'normal'].includes(item.priority)).length,
    items: items.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || String(a.dueDate).localeCompare(String(b.dueDate))),
  };
}

export function getFinancialDocumentReadiness(model) {
  const normalized = normalizeFinancialManagement(model);
  const requiredDocs = (normalized.documents || []).filter((doc) => doc.required);
  const completeDocs = requiredDocs.filter((doc) => doc.status === 'complete');
  const missing = requiredDocs.filter((doc) => doc.status !== 'complete');
  return {
    required: requiredDocs.length,
    complete: completeDocs.length,
    missing,
    percentComplete: requiredDocs.length ? round1((completeDocs.length / requiredDocs.length) * 100) : 100,
  };
}

export function getFinancialActionQueue(model) {
  const normalized = normalizeFinancialManagement(model);
  const obligationActions = getFinancialObligationSummary(normalized).items.map((item) => ({
    id: `obligation-${item.id}`,
    title: `Resolve ${item.title}`,
    priority: item.priority,
    owner: item.owner,
    status: item.status,
    source: 'obligation',
    dueDate: item.dueDate,
  }));
  const missingDocActions = getFinancialDocumentReadiness(normalized).missing.map((doc) => ({
    id: `missing-${doc.id}`,
    title: `Attach ${doc.title}`,
    priority: doc.id === 'royalty-calculation' ? 'high' : 'normal',
    owner: doc.owner,
    status: 'open',
    source: 'missing-document',
  }));
  return [
    ...(normalized.financeActions || []),
    ...obligationActions,
    ...missingDocActions,
  ].filter((item) => item.status !== 'done' && item.status !== 'archived').sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
}

function getUnitWeeklyNumbers(unit = {}) {
  const weekly = unit.weekly || {};
  const sales = Number(weekly.sales || 0);
  const cogs = Number(weekly.cogs || 0);
  const labor = Number(weekly.labor || 0);
  const fixedOperations = Number(weekly.fixedOperations || 0);
  const royalties = Number(weekly.royalties || 0);
  const marketingFund = Number(weekly.marketingFund || 0);
  const taxesReserve = Number(weekly.taxesReserve || 0);
  const otherVariableCosts = Number(weekly.otherVariableCosts || 0);
  const totalOutflows = cogs + labor + fixedOperations + royalties + marketingFund + taxesReserve + otherVariableCosts;
  const netCashflow = round1(sales - totalOutflows);
  return {
    sales: round1(sales),
    cogs: round1(cogs),
    labor: round1(labor),
    fixedOperations: round1(fixedOperations),
    royalties: round1(royalties),
    marketingFund: round1(marketingFund),
    taxesReserve: round1(taxesReserve),
    otherVariableCosts: round1(otherVariableCosts),
    totalOutflows: round1(totalOutflows),
    netCashflow,
    cashflowStatus: netCashflow >= 0 ? 'positive' : 'negative',
    cogsPercent: sales ? round1((cogs / sales) * 100) : 0,
    laborPercent: sales ? round1((labor / sales) * 100) : 0,
    fixedOpsPercent: sales ? round1((fixedOperations / sales) * 100) : 0,
    actionRequired: netCashflow < 0 || (sales ? (cogs + labor) / sales > 0.55 : false),
  };
}

export function getFinancialUnits(model) {
  return normalizeFinancialManagement(model).units.map((unit) => ({
    ...unit,
    weeklyCashflow: getUnitWeeklyNumbers(unit),
  }));
}

export function getWeeklyUnitCashflow(model, unitId) {
  const unit = getFinancialUnits(model).find((candidate) => candidate.id === unitId);
  if (!unit) throw new Error(`Unknown financial unit: ${unitId}`);
  return {
    id: unit.id,
    name: unit.name,
    owner: unit.owner,
    type: unit.type,
    stripe: unit.stripe,
    ...unit.weeklyCashflow,
  };
}

export function getConsolidatedWeeklyCashflow(model) {
  const unitCashflows = getFinancialUnits(model).map((unit) => ({
    id: unit.id,
    name: unit.name,
    owner: unit.owner,
    ...unit.weeklyCashflow,
  }));
  const totals = unitCashflows.reduce((acc, unit) => {
    for (const key of ['sales', 'cogs', 'labor', 'fixedOperations', 'royalties', 'marketingFund', 'taxesReserve', 'otherVariableCosts', 'totalOutflows', 'netCashflow']) {
      acc[key] = round1((acc[key] || 0) + Number(unit[key] || 0));
    }
    return acc;
  }, {});
  return {
    units: unitCashflows.length,
    ...totals,
    cashflowStatus: (totals.netCashflow || 0) >= 0 ? 'positive' : 'negative',
    negativeUnits: unitCashflows.filter((unit) => unit.cashflowStatus === 'negative'),
    actionUnits: unitCashflows.filter((unit) => unit.actionRequired),
  };
}

function envValuePresent(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getStripeAccountReadiness(model, env = process.env) {
  const units = getFinancialUnits(model);
  const secretKeyPresent = envValuePresent(env.STRIPE_SECRET_KEY);
  const publishableKeyPresent = envValuePresent(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const webhookSecretPresent = envValuePresent(env.STRIPE_WEBHOOK_SECRET);
  return {
    secretKeyPresent,
    publishableKeyPresent,
    webhookSecretPresent,
    readyForLiveSync: false,
    accounts: units.map((unit) => ({
      id: unit.id,
      name: unit.name,
      accountIdEnv: unit.stripe.accountKey,
      accountIdPresent: envValuePresent(env[unit.stripe.accountKey]),
      mode: unit.stripe.mode,
      status: unit.stripe.status || 'not_connected',
    })),
    guardrail: 'Stripe keys and account ids are presence-checked only; no secret values are printed and no live money movement is enabled.',
  };
}

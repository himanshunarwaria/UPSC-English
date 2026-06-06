// ─────────────────────────────────────────────────────────────────────────────
// Connector Bank — UPSC English Sentence Connectors & Linking Words
// 25 Essential Connectors: categories, purposes, usage patterns
// ─────────────────────────────────────────────────────────────────────────────

export const CONNECTOR_BANK = [
  // ── Addition (5 items) ────────────────────────────────────────────────
  {
    id: 'conn_add_001',
    connector: 'And',
    category: 'Addition',
    purpose: 'Add similar ideas with equal weight',
    example: 'The policy is effective and affordable.',
    common_mistake: 'Using "and" to connect contrasting ideas (should use "but")',
    level: 2,
  },
  {
    id: 'conn_add_002',
    connector: 'Moreover',
    category: 'Addition',
    purpose: 'Add a more important point; formal addition',
    example: 'The proposal is cost-effective. Moreover, it ensures sustainability.',
    common_mistake: 'Using at sentence start without semicolon/new sentence',
    level: 5,
  },
  {
    id: 'conn_add_003',
    connector: 'Furthermore',
    category: 'Addition',
    purpose: 'Add supporting evidence; stronger than "and"',
    example: 'The data supports this claim. Furthermore, expert consensus agrees.',
    common_mistake: 'Overusing in short texts; using instead of simple "and"',
    level: 5,
  },
  {
    id: 'conn_add_004',
    connector: 'In addition',
    category: 'Addition',
    purpose: 'Add another point or detail; semi-formal',
    example: 'The law protects consumers. In addition, it regulates markets.',
    common_mistake: 'Using comma instead of semicolon/period before it',
    level: 4,
  },
  {
    id: 'conn_add_005',
    connector: 'Also',
    category: 'Addition',
    purpose: 'Simple, informal addition of ideas',
    example: 'The city is developing. Also, unemployment is decreasing.',
    common_mistake: 'Using in formal academic writing (should use "moreover")',
    level: 3,
  },

  // ── Contrast (5 items) ───────────────────────────────────────────────
  {
    id: 'conn_con_001',
    connector: 'But',
    category: 'Contrast',
    purpose: 'Show direct opposition between ideas',
    example: 'The plan is ambitious but realistic.',
    common_mistake: 'Double connector: "although...but" (redundant)',
    level: 2,
  },
  {
    id: 'conn_con_002',
    connector: 'However',
    category: 'Contrast',
    purpose: 'Formal contrast; often sentence-initial',
    example: 'The evidence is compelling. However, critics raise concerns.',
    common_mistake: 'Using comma before it in mid-sentence (needs semicolon)',
    level: 4,
  },
  {
    id: 'conn_con_003',
    connector: 'Although',
    category: 'Contrast',
    purpose: 'Show contrast with subordination; cannot use with "but"',
    example: 'Although expensive, the solution is necessary.',
    common_mistake: 'Pairing with "but" — "although...but" is grammatically wrong',
    level: 4,
  },
  {
    id: 'conn_con_004',
    connector: 'Yet',
    category: 'Contrast',
    purpose: 'Strong contrast; slightly formal',
    example: 'The system is efficient yet affordable.',
    common_mistake: 'Using without understanding its emphatic contrast function',
    level: 4,
  },
  {
    id: 'conn_con_005',
    connector: 'Despite',
    category: 'Contrast',
    purpose: 'Show contrast despite a circumstance; preposition form',
    example: 'Despite high costs, adoption rates are increasing.',
    common_mistake: 'Using "despite of" (double preposition error)',
    level: 4,
  },

  // ── Cause-Effect (5 items) ───────────────────────────────────────────
  {
    id: 'conn_ce_001',
    connector: 'Because',
    category: 'Cause-effect',
    purpose: 'Introduce direct reason for something',
    example: 'The project succeeded because of proper planning.',
    common_mistake: 'Using as main clause reason (should subordinate)',
    level: 2,
  },
  {
    id: 'conn_ce_002',
    connector: 'Therefore',
    category: 'Cause-effect',
    purpose: 'Show logical conclusion; formal effect indicator',
    example: 'The evidence is clear. Therefore, the hypothesis is valid.',
    common_mistake: 'Using in informal speech; needs semicolon/period before it',
    level: 5,
  },
  {
    id: 'conn_ce_003',
    connector: 'As a result',
    category: 'Cause-effect',
    purpose: 'Show consequence semi-formally',
    example: 'Policies changed. As a result, outcomes improved.',
    common_mistake: 'Using comma before it instead of semicolon',
    level: 4,
  },
  {
    id: 'conn_ce_004',
    connector: 'Since',
    category: 'Cause-effect',
    purpose: 'Show cause with time-based or logical reasoning',
    example: 'Since the market shifted, companies adapted quickly.',
    common_mistake: 'Confusion with "since" meaning "from that time onward"',
    level: 3,
  },
  {
    id: 'conn_ce_005',
    connector: 'Consequently',
    category: 'Cause-effect',
    purpose: 'Formal result indicator; similar to "therefore"',
    example: 'The budget increased. Consequently, services improved.',
    common_mistake: 'Overuse in same text as "therefore"',
    level: 5,
  },

  // ── Example (5 items) ────────────────────────────────────────────────
  {
    id: 'conn_ex_001',
    connector: 'For example',
    category: 'Example',
    purpose: 'Introduce a specific instance',
    example: 'Many sectors are improving. For example, agriculture productivity increased.',
    common_mistake: 'Using "for an example" or "e.g." without explanation',
    level: 3,
  },
  {
    id: 'conn_ex_002',
    connector: 'Such as',
    category: 'Example',
    purpose: 'List examples within a clause',
    example: 'Several nations, such as India and Brazil, lead development.',
    common_mistake: 'Using comma incorrectly; "such as" needs restrictive context',
    level: 3,
  },
  {
    id: 'conn_ex_003',
    connector: 'In particular',
    category: 'Example',
    purpose: 'Specify an instance of special importance',
    example: 'Tech sectors thrive globally. In particular, AI development accelerates.',
    common_mistake: 'Using too frequently; varying with "for instance"',
    level: 4,
  },
  {
    id: 'conn_ex_004',
    connector: 'Specifically',
    category: 'Example',
    purpose: 'Narrow focus to particular case',
    example: 'The reforms address multiple issues. Specifically, taxation improved.',
    common_mistake: 'Misusing when "generally" would be more appropriate',
    level: 4,
  },
  {
    id: 'conn_ex_005',
    connector: 'Including',
    category: 'Example',
    purpose: 'Introduce examples as part of a larger group',
    example: 'Several factors apply, including policy changes and market dynamics.',
    common_mistake: 'Using without clear enumeration of examples',
    level: 4,
  },

  // ── Conclusion (5 items) ─────────────────────────────────────────────
  {
    id: 'conn_cl_001',
    connector: 'In conclusion',
    category: 'Conclusion',
    purpose: 'Signal final summary; formal closing',
    example: 'The evidence is clear. In conclusion, reform is urgent.',
    common_mistake: 'Using in short texts where it sounds excessive',
    level: 4,
  },
  {
    id: 'conn_cl_002',
    connector: 'Overall',
    category: 'Conclusion',
    purpose: 'Summarize general impression or main point',
    example: 'The plan has challenges. Overall, benefits outweigh costs.',
    common_mistake: 'Using when "generally" or "on balance" fits better',
    level: 4,
  },
  {
    id: 'conn_cl_003',
    connector: 'In summary',
    category: 'Conclusion',
    purpose: 'Provide condensed final statement',
    example: 'Multiple factors influenced the decision. In summary, timing was critical.',
    common_mistake: 'Using with insufficient prior information to summarize',
    level: 4,
  },
  {
    id: 'conn_cl_004',
    connector: 'Thus',
    category: 'Conclusion',
    purpose: 'Formal conclusion or result; similar to "therefore"',
    example: 'The research is comprehensive. Thus, conclusions are reliable.',
    common_mistake: 'Overuse in academic writing; varying with "therefore"',
    level: 5,
  },
  {
    id: 'conn_cl_005',
    connector: 'Ultimately',
    category: 'Conclusion',
    purpose: 'Final perspective after considering multiple points',
    example: 'The costs are high. Ultimately, investment remains essential.',
    common_mistake: 'Using when position is not the actual ultimate conclusion',
    level: 5,
  },
];

// ── Export functions ────────────────────────────────────────────────────────

export function getConnectorBank() {
  return CONNECTOR_BANK;
}

export function getConnectorById(id) {
  return CONNECTOR_BANK.find(c => c.id === id);
}

export function getConnectorsByCategory(category) {
  return CONNECTOR_BANK.filter(c => c.category === category);
}

export function getAllConnectorCategories() {
  return [...new Set(CONNECTOR_BANK.map(c => c.category))];
}

export function getConnectorsByLevel(level) {
  return CONNECTOR_BANK.filter(c => c.level === level);
}

export function searchConnectors(query) {
  const q = query.toLowerCase();
  return CONNECTOR_BANK.filter(c =>
    c.connector.toLowerCase().includes(q) ||
    c.purpose.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q)
  );
}

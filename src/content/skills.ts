export interface Skill {
  id: string;
  name: string;
  category: string;
  status: 'shipped' | 'working' | 'learning';
  projects: string[];
}

export const skills: Skill[] = [
  // Geospatial data
  { id: 'fusionx', name: 'FusionX (map editing)', category: 'Geospatial data', status: 'shipped', projects: ['tcs'] },
  { id: 'lane-data', name: 'Lane-level road data', category: 'Geospatial data', status: 'shipped', projects: ['tcs'] },
  { id: 'map-qa', name: 'Map data QA', category: 'Geospatial data', status: 'shipped', projects: ['tcs'] },
  { id: 'layer-editing', name: 'Layer-based editing', category: 'Geospatial data', status: 'shipped', projects: ['tcs'] },

  // Data & analysis
  { id: 'data-quality', name: 'Data quality & validation', category: 'Data & analysis', status: 'shipped', projects: ['tcs', 'vaultiq'] },
  { id: 'structured-data', name: 'Structured data at scale', category: 'Data & analysis', status: 'shipped', projects: ['tcs'] },

  // AI & agents
  { id: 'rag', name: 'RAG pipelines', category: 'AI & agents', status: 'shipped', projects: ['vaultiq', 'prisim'] },
  { id: 'langchain', name: 'LangChain / LangGraph', category: 'AI & agents', status: 'shipped', projects: ['waza', 'prisim'] },
  { id: 'crewai', name: 'CrewAI', category: 'AI & agents', status: 'shipped', projects: ['marketcrew'] },
  { id: 'llm-ops', name: 'LLM orchestration', category: 'AI & agents', status: 'working', projects: ['kobra', 'waza'] },
  { id: 'voice-ai', name: 'Voice AI (STT/TTS/wake word)', category: 'AI & agents', status: 'shipped', projects: ['kobra'] },

  // Backend
  { id: 'fastapi', name: 'FastAPI', category: 'Backend', status: 'shipped', projects: ['waza', 'prisim', 'marketcrew'] },
  { id: 'supabase', name: 'Supabase / Postgres', category: 'Backend', status: 'shipped', projects: ['waza'] },
  { id: 'docker', name: 'Docker', category: 'Backend', status: 'learning', projects: [] },
  { id: 'aws', name: 'AWS', category: 'Backend', status: 'learning', projects: [] },

  // Frontend & mobile
  { id: 'react', name: 'React / TypeScript', category: 'Frontend & mobile', status: 'shipped', projects: ['vaultiq', 'wayward', 'kobra'] },
  { id: 'react-native', name: 'React Native', category: 'Frontend & mobile', status: 'shipped', projects: ['wayward'] },
  { id: 'vite', name: 'Vite', category: 'Frontend & mobile', status: 'shipped', projects: ['vaultiq', 'kobra'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend & mobile', status: 'shipped', projects: ['vaultiq'] },

  // Tooling
  { id: 'git', name: 'Git / GitHub', category: 'Tooling', status: 'shipped', projects: ['all'] },
  { id: 'ci-cd', name: 'CI/CD (Vercel, GitHub Actions)', category: 'Tooling', status: 'shipped', projects: ['vaultiq', 'waza'] },
];

export const skillCategories = [
  'Geospatial data',
  'Data & analysis',
  'AI & agents',
  'Backend',
  'Frontend & mobile',
  'Tooling'
] as const;

export const getSkillsByCategory = () => {
  const grouped: Record<string, Skill[]> = {};
  skillCategories.forEach(cat => grouped[cat] = []);
  skills.forEach(skill => grouped[skill.category].push(skill));
  return grouped;
};

export const getSkillSymbol = (status: Skill['status']) => {
  switch (status) {
    case 'shipped': return '●';
    case 'working': return '◐';
    case 'learning': return '○';
  }
};
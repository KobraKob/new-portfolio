export interface Project {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  status: 'DEPLOYED' | 'WORKING' | 'IN BUILD' | 'PROTOTYPE';
  featured: boolean;
  repoUrl?: string;
  demoUrl?: string;
  caseStudy?: {
    problem: string;
    approach: string;
    architecture: string;
    learned: string;
    next: string;
  };
}

export const projects: Project[] = [
  {
    slug: 'vaultiq',
    name: 'VAULTIQ',
    description: 'RAG knowledge base',
    stack: ['HuggingFace Spaces', 'Vercel'],
    status: 'DEPLOYED',
    featured: true,
    demoUrl: undefined,
    caseStudy: {
      problem: 'Teams need a dependable way to search their own reference material without losing the source context behind an answer.',
      approach: 'VAULTIQ indexes supplied documents and retrieves the most relevant passages before producing a grounded response.',
      architecture: 'The prototype combines an embedding-backed retrieval layer with a lightweight web interface and deployment workflow.',
      learned: 'Retrieval quality depends on document preparation and chunking; concise, traceable answers matter more than simply returning more context.',
      next: 'Expand evaluation coverage and refine source citations before a wider release.'
    }
  },
  {
    slug: 'kobra',
    name: 'KOBRA',
    description: 'Voice assistant with custom command layer. v4/v5 spec: neural cognitive architecture, unified memory layers, proactive morning-briefing engine',
    stack: ['Porcupine', 'faster-whisper', 'edge-tts', 'Groq'],
    status: 'WORKING',
    featured: true,
    caseStudy: {
      problem: 'Voice interfaces need to stay responsive while coordinating speech recognition, intent handling, memory, and spoken replies.',
      approach: 'KOBRA keeps the command layer modular so each capability can evolve without making everyday interactions brittle.',
      architecture: 'A wake-word listener feeds transcription and command routing, with separate services for text-to-speech and model-powered responses.',
      learned: 'Latency and interruption handling shape the experience as much as model quality.',
      next: 'Continue hardening the unified memory model and proactive briefing flow.'
    }
  },
  {
    slug: 'waza',
    name: 'WAZA',
    description: 'WhatsApp AI agent for Indian SMBs',
    stack: ['Meta Cloud API', 'LangChain', 'FastAPI', 'Supabase'],
    status: 'IN BUILD',
    featured: true,
    caseStudy: {
      problem: 'Small businesses need a practical way to respond to customer questions and routine requests in the channel their customers already use.',
      approach: 'WAZA connects WhatsApp conversations to a focused AI workflow tailored to common SMB operations.',
      architecture: 'The system pairs the Meta Cloud API with a FastAPI backend, agent orchestration, and persistent application data.',
      learned: 'Reliable handoff, message state, and concise responses are essential in a conversational business workflow.',
      next: 'Complete the first business workflows and validate them with real conversation scenarios.'
    }
  },
  {
    slug: 'prisim',
    name: 'PRISIM',
    description: 'Multi-source research agent',
    stack: ['LangGraph'],
    status: 'WORKING',
    featured: false,
  },
  {
    slug: 'marketcrew',
    name: 'MARKETCREW',
    description: 'Multi-agent content-automation system',
    stack: ['CrewAI', 'SambaNova'],
    status: 'WORKING',
    featured: false,
  },
  {
    slug: 'wayward',
    name: 'WAYWARD',
    description: 'Adventure app',
    stack: ['React Native'],
    status: 'WORKING',
    featured: false,
  }
];

export const getFeaturedProjects = () => projects.filter(p => p.featured);
export const getCompactProjects = () => projects.filter(p => !p.featured);
export const getProjectBySlug = (slug: string) => projects.find(p => p.slug === slug);

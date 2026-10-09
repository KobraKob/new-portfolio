export const copy = {
  meta: {
    name: 'Balavanth',
    handle: 'KobraKob',
    location: 'Bengaluru, India',
    coordinates: '12.9716° N, 77.5946° E',
    github: 'https://github.com/KobraKob',
    linkedin: 'https://linkedin.com/in/balavanth',
    email: 'balavanthko@gmail.com',
    positioning: 'Maps-trained data person who builds AI tools, and writes dark fantasy on the side.',
  },

  hero: {
    name: 'BALAVANTH',
    role: 'Geospatial data specialist → data analyst & AI builder. Bengaluru.',
    status: 'OPEN TO WORK · Data Analyst · Operations Coordination · Precision Mapping',
    actions: {
      work: 'View work',
      resume: 'Résumé (PDF)',
      email: 'Email'
    },
    marginalia: {
      sheet: 'SHEET 1 OF 8'
    }
  },

  nav: {
    sections: [
      { id: 'index', label: '00 Index', subtitle: '' },
      { id: 'substrate', label: '01 Substrate', subtitle: 'About' },
      { id: 'waypoints', label: '02 Waypoints', subtitle: 'Selected work' },
      { id: 'fieldnotes', label: '03 Field Notes', subtitle: 'Experience' },
      { id: 'legend', label: '04 Legend', subtitle: 'Skills' },
      { id: 'erevan', label: '05 Erevan', subtitle: 'Writing' },
      { id: 'offroute', label: '06 Off-Route', subtitle: 'Beyond work' },
      { id: 'transmit', label: '07 Transmit', subtitle: 'Contact' }
    ],
    toggleLabel: 'GROUND ◐ EREVAN'
  },

  substrate: {
    title: '01 Substrate',
    subtitle: 'About',
    body: [
      'I spent a year making maps correct at Apple Maps via TCS — lane geometry, layer-based editing, precision QA across Substrate, Drive Coding, Lane Guidance, Substrate Plus.',
      'Now I build AI tools: voice assistants (KOBRA), RAG systems (VAULTIQ), WhatsApp agents (WAZA), multi-agent research (PRISIM) and content automation (MARKETCREW).',
      'I write dark fantasy set in Erevan — The Bound and the Hollow, protagonist Roen Dourne. It has been through several editorial rounds.',
      'Solo bike trips and story-driven RPGs keep the navigation instincts sharp.',
      'I like selling the shovel.'
    ],
    marginalia: 'Precision is a habit, not a metric.'
  },

  waypoints: {
    title: '02 Waypoints',
    subtitle: 'Selected work',
    titleBlockLabels: {
      project: 'PROJECT',
      status: 'STATUS',
      stack: 'STACK',
      sheet: 'SHEET',
      scale: 'SCALE'
    }
  },

  fieldnotes: {
    title: '03 Field Notes',
    subtitle: 'Experience',
    routeLabel: 'ROUTE'
  },

  legend: {
    title: '04 Legend',
    subtitle: 'Skills',
    categories: [
      'Geospatial data',
      'Data & analysis',
      'AI & agents',
      'Backend',
      'Frontend & mobile',
      'Tooling'
    ],
    symbolKey: {
      shipped: '● Used in shipped work',
      working: '◐ Working knowledge',
      learning: '○ Learning'
    }
  },

  erevan: {
    title: '05 Erevan',
    subtitle: 'Writing',
    novel: {
      title: 'The Bound and the Hollow',
      world: 'Erevan',
      protagonist: 'Roen Dourne',
      status: 'In progress',
      premise: 'A dark fantasy of fractured oaths, old powers, and the choices that bind a man to the world he wants to escape.',
      excerpt: 'Roen Dourne reached the city before dawn, when Erevan still belonged to the fog. The gates stood open, their iron teeth wet with rain, and every lantern along the wall burned blue. He had seen that colour once before, on the night his father vanished into the hollow.\n\nNo guard stopped him. No bell announced his name. Only the wind followed, carrying the thin sound of something singing beneath the stones. Roen kept one hand on the hilt at his side and walked toward the silence at the heart of the city.'
    },
    visualBible: {
      label: 'Visual Bible',
      placeholder: 'Visual-development studies are in progress.'
    }
  },

  offroute: {
    title: '06 Off-Route',
    subtitle: 'Beyond work',
    items: [
      { icon: 'bike', label: 'Solo bike trips', description: 'Long-distance, self-supported. The scroll-as-route concept comes from here.' },
      { icon: 'gamepad', label: 'Story-driven RPGs', description: 'Planescape: Torment, Disco Elysium, Baldur\'s Gate 3. Narrative as system.' },
      { icon: 'github', label: 'Building in public', description: 'Ship small, stay independent. Derek Sivers and Pieter Levels are the model.' }
    ]
  },

  transmit: {
    title: '07 Transmit',
    subtitle: 'Contact',
    emailLabel: 'Email',
    availability: 'Available for Data Analyst, Operations Coordination, Precision Mapping, and AI builder roles.',
    links: {
      github: 'GitHub',
      linkedin: 'LinkedIn',
      resume: 'Résumé (PDF)',
      copyEmail: 'Copy email'
    },
    footer: {
      copyright: '© 2026 Balavanth · Bengaluru · 12.9716° N, 77.5946° E',
      buildStamp: 'Build: portfolio edition'
    }
  },

  notFound: {
    title: '404',
    message: 'This coordinate isn\'t on the map.',
    action: 'Return to Index'
  },

  palette: {
    title: 'Command Palette',
    placeholder: 'Type a command or search…',
    shortcuts: '⌘K / Ctrl+K / /',
    commands: [
      { id: 'index', label: 'Go to Index', section: 'index' },
      { id: 'substrate', label: 'Go to Substrate', section: 'substrate' },
      { id: 'waypoints', label: 'Go to Waypoints', section: 'waypoints' },
      { id: 'fieldnotes', label: 'Go to Field Notes', section: 'fieldnotes' },
      { id: 'legend', label: 'Go to Legend', section: 'legend' },
      { id: 'erevan', label: 'Go to Erevan', section: 'erevan' },
      { id: 'offroute', label: 'Go to Off-Route', section: 'offroute' },
      { id: 'transmit', label: 'Go to Transmit', section: 'transmit' },
      { id: 'toggle', label: 'Toggle Ground / Erevan', action: 'toggle-theme' },
      { id: 'copy-email', label: 'Copy email', action: 'copy-email' },
      { id: 'open-resume', label: 'Open résumé', action: 'open-resume' },
      { id: 'open-github', label: 'Open GitHub', action: 'open-github' },
      { id: 'open-linkedin', label: 'Open LinkedIn', action: 'open-linkedin' }
    ],
    easterEggTrigger: 'kobra'
  },

  clock: {
    timezone: 'IST',
    label: 'Bengaluru'
  }
};

export type Copy = typeof copy;

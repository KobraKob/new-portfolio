export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  description: string[];
  subWaypoints?: { label: string; description: string }[];
}

export const experience: ExperienceItem[] = [
  {
    id: 'tcs',
    role: 'Geospatial Data Specialist',
    organization: 'Tata Consultancy Services (embedded in Apple Maps program via Altice)',
    period: 'Aug 2025 – Aug 2026',
    location: 'Bengaluru, India',
    description: [
      'Worked across map data layers: Substrate, Drive Coding, Lane Guidance, Substrate Plus',
      'Used internal tool FusionX for layer-based editing and precision QA',
      'Focus: map data quality, lane-level road data, structured data at scale'
    ],
    subWaypoints: [
      { label: 'Substrate', description: 'Foundational map layer: geometry, topology, attribution' },
      { label: 'Drive Coding', description: 'Road network encoding: connectivity, directionality, restrictions' },
      { label: 'Lane Guidance', description: 'Lane-level detail: geometry, markings, turn guidance' },
      { label: 'Substrate Plus', description: 'Enriched substrate: 3D features, elevation, semantic enrichment' }
    ]
  },
  {
    id: 'bca',
    role: 'Bachelor of Computer Applications (BCA)',
    organization: 'Institution details available on request',
    period: 'Recent graduate',
    location: 'Bengaluru, India',
    description: [
      'CGPA: 7.8',
      'Focus: Computer applications, programming fundamentals, data structures'
    ]
  }
];

export const getExperience = () => experience;

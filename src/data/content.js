// All editable content lives here. Replace the placeholders with your own details.

export const profile = {
  name: 'Your Name',
  title: 'Full-Stack Developer',
  intro:
    'I design, build and ship web products from database to interface. My work centres on React, Node.js and cloud infrastructure, with a focus on speed, accessibility and code a team can maintain.',
  email: 'hello@your-domain.com',
  phone: '+1 (555) 010-2030',
  avatar: '/images/avatar.svg',
  resume: '/resume.pdf', // drop your PDF into /public/resume.pdf
  location: { label: 'San Francisco, CA', lat: 37.7749, lon: -122.4194 },
  socials: {
    github: 'https://github.com/yourname',
    linkedin: 'https://linkedin.com/in/yourname',
    twitter: 'https://x.com/yourname',
  },
}

export const nav = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
]

export const about = {
  bio: [
    'I am a full-stack developer with 6+ years of experience turning unclear problems into reliable products. I have shipped SaaS platforms, internal tools and public APIs for startups and established teams.',
    'I care about the details people notice only when they are missing: fast loads, clear error messages, keyboard support and tests that catch regressions before users do.',
  ],
  goals:
    'I am looking to lead product engineering on a team that values craft, and to keep growing in system design, developer experience and applied AI.',
  interests: ['Open source', 'Design systems', 'Performance', 'Developer tooling', 'Mentoring'],
  strengths: [
    'Owns features end to end, from schema to UI',
    'Writes clear docs and reviews that unblock teammates',
    'Cuts load times and cloud costs with measured changes',
  ],
  stats: [
    { value: '6+', label: 'Years building' },
    { value: '40+', label: 'Projects shipped' },
    { value: '12', label: 'Teams worked with' },
    { value: '98', label: 'Avg. Lighthouse score' },
  ],
}

export const skills = [
  {
    category: 'Frontend',
    icon: 'Layout',
    items: [
      { name: 'React / Next.js', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Framer Motion', level: 80 },
    ],
  },
  {
    category: 'Backend',
    icon: 'Server',
    items: [
      { name: 'Node.js / Express', level: 92 },
      { name: 'REST & GraphQL', level: 90 },
      { name: 'Python / FastAPI', level: 75 },
      { name: 'Auth & security', level: 85 },
    ],
  },
  {
    category: 'Databases',
    icon: 'Database',
    items: [
      { name: 'PostgreSQL', level: 90 },
      { name: 'MongoDB', level: 85 },
      { name: 'Redis', level: 78 },
      { name: 'Prisma / SQL', level: 88 },
    ],
  },
  {
    category: 'Cloud & DevOps',
    icon: 'Cloud',
    items: [
      { name: 'AWS', level: 85 },
      { name: 'Docker', level: 90 },
      { name: 'CI/CD pipelines', level: 88 },
      { name: 'Terraform', level: 70 },
    ],
  },
  {
    category: 'Tools & Technologies',
    icon: 'Wrench',
    badges: ['Git', 'GitHub Actions', 'Figma', 'Jest', 'Playwright', 'Vite', 'Storybook', 'Sentry', 'Linux', 'Postman'],
  },
]

export const projects = [
  {
    title: 'Orbit Analytics',
    description:
      'A privacy-first analytics dashboard with real-time event streaming, custom funnels and team workspaces.',
    image: '/images/project-1.svg',
    tags: ['React', 'Node.js', 'PostgreSQL', 'WebSockets'],
    github: 'https://github.com/yourname/orbit',
    demo: 'https://example.com/orbit',
  },
  {
    title: 'Cartly Storefront',
    description:
      'Headless e-commerce platform with Stripe checkout, inventory sync and a sub-second product search.',
    image: '/images/project-2.svg',
    tags: ['Next.js', 'Stripe', 'Redis', 'Docker'],
    github: 'https://github.com/yourname/cartly',
    demo: 'https://example.com/cartly',
  },
  {
    title: 'Pulse API Gateway',
    description:
      'Rate-limited API gateway with OAuth2, request tracing and auto-generated OpenAPI documentation.',
    image: '/images/project-3.svg',
    tags: ['TypeScript', 'Express', 'AWS', 'Terraform'],
    github: 'https://github.com/yourname/pulse',
    demo: 'https://example.com/pulse',
  },
  {
    title: 'Taskwell',
    description:
      'Collaborative project planner with offline support, drag-and-drop boards and live cursors.',
    image: '/images/project-4.svg',
    tags: ['React', 'MongoDB', 'Socket.IO', 'PWA'],
    github: 'https://github.com/yourname/taskwell',
    demo: 'https://example.com/taskwell',
  },
]

export const timeline = [
  {
    type: 'work',
    title: 'Senior Full-Stack Developer',
    org: 'Northwind Labs',
    period: '2023 – Present',
    summary: 'Lead engineer on a SaaS platform used by 20k+ teams.',
    details: [
      'Cut median page load from 3.2s to 1.1s by splitting bundles and caching API responses.',
      'Introduced a shared component library adopted by four product teams.',
      'Mentor three junior developers through code review and pairing.',
    ],
  },
  {
    type: 'work',
    title: 'Full-Stack Developer',
    org: 'Brightpath Studio',
    period: '2020 – 2023',
    summary: 'Built client web apps and APIs across fintech and health.',
    details: [
      'Delivered 15+ client projects on time with React, Node.js and PostgreSQL.',
      'Set up CI/CD with automated tests, reducing release time from days to minutes.',
    ],
  },
  {
    type: 'work',
    title: 'Software Engineering Intern',
    org: 'Helio Systems',
    period: 'Summer 2019',
    summary: 'Built internal dashboards and fixed production bugs.',
    details: ['Shipped an admin dashboard that replaced a manual spreadsheet workflow.'],
  },
  {
    type: 'education',
    title: 'B.Sc. Computer Science',
    org: 'University Name',
    period: '2016 – 2020',
    summary: 'Graduated with honours. Focus on distributed systems and HCI.',
    details: ['Capstone: real-time collaborative editor built with CRDTs.'],
  },
]

export const services = [
  {
    icon: 'Code2',
    title: 'Web Development',
    text: 'Fast, accessible websites and web apps built with React and modern tooling, ready to scale.',
  },
  {
    icon: 'PenTool',
    title: 'UI/UX Design',
    text: 'Wireframes, prototypes and design systems that look sharp and are easy to use.',
  },
  {
    icon: 'Webhook',
    title: 'API Development',
    text: 'Secure REST and GraphQL APIs with clear documentation, testing and monitoring.',
  },
  {
    icon: 'Lightbulb',
    title: 'Consulting',
    text: 'Architecture reviews, performance audits and technical roadmaps for your team.',
  },
]

export const testimonials = [
  {
    name: 'Amelia Carter',
    role: 'CTO, Northwind Labs',
    quote:
      'Delivered our dashboard rebuild two weeks early and made the whole codebase easier to work in. Communication was excellent throughout.',
  },
  {
    name: 'Daniel Okafor',
    role: 'Founder, Cartly',
    quote:
      'Our checkout conversion rose 18% after the redesign. Clear, calm and thorough. I would hire again without hesitation.',
  },
  {
    name: 'Sofia Lindgren',
    role: 'Product Lead, Brightpath',
    quote:
      'Rare mix of strong engineering and product sense. Raised the quality bar for everyone on the team.',
  },
]

// Fallback shown if the API is offline. Live data comes from the backend (/admin).
export const certificates = [
  { id: 'aws', title: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', date: '2022', credentialUrl: '', file: '' },
]

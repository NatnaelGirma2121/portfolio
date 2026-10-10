import crypto from 'node:crypto'

const id = () => crypto.randomUUID()
const now = () => new Date().toISOString()

// Starter data so the site is not empty on first run. Edit or delete it in /admin.
export default function seed() {
  const p = (title, description, tags, n) => ({
    id: id(), title, description, tags,
    github: 'https://github.com/yourname', demo: 'https://example.com',
    images: [`/images/project-${n}.svg`], video: '', createdAt: now(),
  })
  const s = (category, name, level = null) => ({ id: id(), category, name, level, createdAt: now() })

  return {
    profile: {
      name: 'Your Name',
      title: 'Full-Stack Developer',
      intro:
        'I design, build and ship web products from database to interface. My work centres on React, Node.js and cloud infrastructure, with a focus on speed, accessibility and code a team can maintain.',
      email: 'hello@your-domain.com',
      phone: '+1 (555) 010-2030',
      avatar: '/images/avatar.svg',
      resume: '/resume.pdf',
      location: { label: 'San Francisco, CA', lat: 37.7749, lon: -122.4194 },
      socials: { github: 'https://github.com/yourname', linkedin: 'https://linkedin.com/in/yourname', twitter: 'https://x.com/yourname' },
      about: {
        bio: [
          'I am a full-stack developer with 6+ years of experience turning unclear problems into reliable products. I have shipped SaaS platforms, internal tools and public APIs for startups and established teams.',
          'I care about the details people notice only when they are missing: fast loads, clear error messages, keyboard support and tests that catch regressions before users do.',
        ],
        goals: 'I am looking to lead product engineering on a team that values craft, and to keep growing in system design, developer experience and applied AI.',
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
      },
    },
    experience: [
      { id: id(), type: 'work', title: 'Senior Full-Stack Developer', org: 'Northwind Labs', period: '2023 – Present', summary: 'Lead engineer on a SaaS platform used by 20k+ teams.', details: ['Cut median page load from 3.2s to 1.1s by splitting bundles and caching API responses.', 'Introduced a shared component library adopted by four product teams.', 'Mentor three junior developers through code review and pairing.'], createdAt: now() },
      { id: id(), type: 'work', title: 'Full-Stack Developer', org: 'Brightpath Studio', period: '2020 – 2023', summary: 'Built client web apps and APIs across fintech and health.', details: ['Delivered 15+ client projects on time with React, Node.js and PostgreSQL.', 'Set up CI/CD with automated tests, reducing release time from days to minutes.'], createdAt: now() },
      { id: id(), type: 'work', title: 'Software Engineering Intern', org: 'Helio Systems', period: 'Summer 2019', summary: 'Built internal dashboards and fixed production bugs.', details: ['Shipped an admin dashboard that replaced a manual spreadsheet workflow.'], createdAt: now() },
      { id: id(), type: 'education', title: 'B.Sc. Computer Science', org: 'University Name', period: '2016 – 2020', summary: 'Graduated with honours. Focus on distributed systems and HCI.', details: ['Capstone: real-time collaborative editor built with CRDTs.'], createdAt: now() },
    ],
    services: [
      { id: id(), icon: 'Code2', title: 'Web Development', text: 'Fast, accessible websites and web apps built with React and modern tooling, ready to scale.', createdAt: now() },
      { id: id(), icon: 'PenTool', title: 'UI/UX Design', text: 'Wireframes, prototypes and design systems that look sharp and are easy to use.', createdAt: now() },
      { id: id(), icon: 'Webhook', title: 'API Development', text: 'Secure REST and GraphQL APIs with clear documentation, testing and monitoring.', createdAt: now() },
      { id: id(), icon: 'Lightbulb', title: 'Consulting', text: 'Architecture reviews, performance audits and technical roadmaps for your team.', createdAt: now() },
    ],
    testimonials: [
      { id: id(), name: 'Amelia Carter', role: 'CTO, Northwind Labs', quote: 'Delivered our dashboard rebuild two weeks early and made the whole codebase easier to work in. Communication was excellent throughout.', createdAt: now() },
      { id: id(), name: 'Daniel Okafor', role: 'Founder, Cartly', quote: 'Our checkout conversion rose 18% after the redesign. Clear, calm and thorough. I would hire again without hesitation.', createdAt: now() },
      { id: id(), name: 'Sofia Lindgren', role: 'Product Lead, Brightpath', quote: 'Rare mix of strong engineering and product sense. Raised the quality bar for everyone on the team.', createdAt: now() },
    ],
    projects: [
      p('Orbit Analytics', 'A privacy-first analytics dashboard with real-time event streaming and team workspaces.', ['React', 'Node.js', 'PostgreSQL'], 1),
      p('Cartly Storefront', 'Headless e-commerce platform with Stripe checkout and sub-second product search.', ['Next.js', 'Stripe', 'Redis'], 2),
      p('Pulse API Gateway', 'Rate-limited API gateway with OAuth2, request tracing and generated OpenAPI docs.', ['TypeScript', 'Express', 'AWS'], 3),
      p('Taskwell', 'Collaborative planner with offline support, drag-and-drop boards and live cursors.', ['React', 'MongoDB', 'PWA'], 4),
    ],
    skills: [
      s('Frontend', 'React / Next.js', 95), s('Frontend', 'TypeScript', 90), s('Frontend', 'Tailwind CSS', 92), s('Frontend', 'Framer Motion', 80),
      s('Backend', 'Node.js / Express', 92), s('Backend', 'REST & GraphQL', 90), s('Backend', 'Python / FastAPI', 75), s('Backend', 'Auth & security', 85),
      s('Databases', 'PostgreSQL', 90), s('Databases', 'MongoDB', 85), s('Databases', 'Redis', 78), s('Databases', 'Prisma / SQL', 88),
      s('Cloud & DevOps', 'AWS', 85), s('Cloud & DevOps', 'Docker', 90), s('Cloud & DevOps', 'CI/CD pipelines', 88), s('Cloud & DevOps', 'Terraform', 70),
      ...['Git', 'GitHub Actions', 'Figma', 'Jest', 'Playwright', 'Vite', 'Storybook', 'Sentry', 'Linux', 'Postman'].map((n) => s('Tools & Technologies', n)),
    ],
    certificates: [
      { id: id(), title: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', date: '2022', credentialUrl: '', file: '', createdAt: now() },
    ],
  }
}

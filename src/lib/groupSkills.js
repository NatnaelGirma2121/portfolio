const icons = { Frontend: 'Layout', Backend: 'Server', Databases: 'Database', 'Cloud & DevOps': 'Cloud' }

// Turns a flat list [{category, name, level}] into the grouped shape the Skills section renders.
// Skills with a level become progress bars; skills without one become badges.
export default function groupSkills(list) {
  const map = new Map()
  list.forEach((s) => {
    if (!map.has(s.category)) map.set(s.category, [])
    map.get(s.category).push(s)
  })
  return [...map].map(([category, arr]) => ({
    category,
    icon: icons[category] || 'Wrench',
    items: arr.filter((s) => s.level != null).map(({ name, level }) => ({ name, level })),
    badges: arr.filter((s) => s.level == null).map((s) => s.name),
  }))
}

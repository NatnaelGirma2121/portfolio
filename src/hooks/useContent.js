import { useEffect, useState } from 'react'
import { about, certificates, profile, projects, services, skills, testimonials, timeline } from '../data/content'
import { request } from '../lib/api'
import groupSkills from '../lib/groupSkills'

const normalize = (list) =>
  list.map((p) => ({ ...p, images: p.images ?? (p.image ? [p.image] : []), video: p.video ?? '' }))

// Starts with the static content so the page renders instantly, then swaps in live data from the API.
export default function useContent() {
  const [data, setData] = useState({
    projects: normalize(projects),
    skills,
    certificates,
    profile,
    about,
    experience: timeline,
    services,
    testimonials,
  })

  useEffect(() => {
    let off = false
    Promise.all([request('/projects'), request('/skills'), request('/certificates'), request('/profile'),
      request('/experience'), request('/services'), request('/testimonials')])
      .then(([p, s, c, pr, ex, sv, te]) => {
        if (!off) setData({ projects: normalize(p), skills: groupSkills(s), certificates: c, profile: pr, about: pr.about, experience: ex, services: sv, testimonials: te })
      })
      .catch(() => {
        /* API offline: keep the static content */
      })
    return () => {
      off = true
    }
  }, [])

  return data
}

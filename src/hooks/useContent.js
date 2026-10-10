import { useEffect, useState } from 'react'
import { about, certificates, profile, projects, services, skills, testimonials, timeline } from '../data/content'
import { request } from '../lib/api'
import groupSkills from '../lib/groupSkills'

// VITE_STATIC=true (see .env.static) builds the site for static hosts such as Vercel.
// It reads /data/content.json, created by `npm run export`, instead of calling the API.
export const STATIC = import.meta.env.VITE_STATIC === 'true'

const normalize = (list) =>
  list.map((p) => ({ ...p, images: p.images ?? (p.image ? [p.image] : []), video: p.video ?? '' }))

const shape = (d) => ({
  projects: normalize(d.projects),
  skills: groupSkills(d.skills),
  certificates: d.certificates,
  profile: d.profile,
  about: d.profile.about,
  experience: d.experience,
  services: d.services,
  testimonials: d.testimonials,
})

async function fetchLive() {
  const [projects, skills, certificates, profile, experience, services, testimonials] = await Promise.all([
    request('/projects'), request('/skills'), request('/certificates'), request('/profile'),
    request('/experience'), request('/services'), request('/testimonials'),
  ])
  return { projects, skills, certificates, profile, experience, services, testimonials }
}

async function fetchStatic() {
  const res = await fetch('/data/content.json')
  if (!res.ok) throw new Error('No exported content')
  return res.json()
}

// Starts with the built-in content so the page renders instantly, then swaps in the real data.
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
    ;(STATIC ? fetchStatic() : fetchLive())
      .then((d) => {
        if (!off) setData(shape(d))
      })
      .catch(() => {
        /* keep the built-in content */
      })
    return () => {
      off = true
    }
  }, [])

  return data
}

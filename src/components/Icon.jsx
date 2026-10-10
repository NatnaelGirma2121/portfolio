import { Cloud, Code2, Database, Layout, Lightbulb, PenTool, Server, Sparkles, Webhook, Wrench } from 'lucide-react'

// Named imports keep the bundle small (tree-shaking).
const map = { Layout, Server, Database, Cloud, Wrench, Code2, PenTool, Webhook, Lightbulb }

export default function Icon({ name, ...props }) {
  const C = map[name] || Sparkles
  return <C aria-hidden="true" {...props} />
}

import { Award, ExternalLink, FileText } from 'lucide-react'
import Section, { Reveal } from './Section'

const isPdf = (u) => u?.toLowerCase().endsWith('.pdf')

export default function Certificates({ certificates }) {
  return (
    <Section id="certificates" title="Certificates" intro="Credentials I've earned. Open one to see the original.">
      {certificates.length === 0 && <p className="text-muted">No certificates added yet.</p>}
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c, i) => (
          <li key={c.id}>
            <Reveal delay={(i % 3) * 0.06} className="h-full">
              <article className="glass flex h-full flex-col overflow-hidden rounded-3xl transition-colors hover:border-accent/50">
                {c.file && !isPdf(c.file) && (
                  <a href={c.file} target="_blank" rel="noopener noreferrer" aria-label={`Open ${c.title} certificate image (new tab)`}>
                    <img src={c.file} alt={`${c.title} certificate`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  </a>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl text-accent" style={{ backgroundColor: 'rgb(var(--accent) / 0.12)' }}>
                    <Award size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {[c.issuer, c.date].filter(Boolean).join(' • ')}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-3 pt-5">
                    {c.file && isPdf(c.file) && (
                      <a href={c.file} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2">
                        <FileText size={16} aria-hidden="true" /> View PDF
                      </a>
                    )}
                    {c.credentialUrl && (
                      <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2">
                        <ExternalLink size={16} aria-hidden="true" /> Verify
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}

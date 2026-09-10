import { Navbar } from '@/components/navbar'
import { ConceptSection } from '@/components/concept-section'
import { MapSection } from '@/components/map-section'
import { ShowcaseSection, type ShowcaseSectionProps } from '@/components/showcase-section'
import { PresentationSection } from '@/components/presentation-section'
import { SiteFooter } from '@/components/site-footer'

const showcases: ShowcaseSectionProps[] = [
  {
    id: 'ai-image',
    index: '03',
    kicker: 'AI Image',
    title: 'From tourist snapshot to sci-fi dream',
    description:
      'The same subject, reimagined. We started with a literal Bangkok landscape, then pushed the prompt toward a neon fantasy of flying tuk-tuks and holographic temples.',
    initial: {
      label: 'Initial',
      caption:
        'A standard, photoreal Bangkok landscape — accurate but expected. Grand Palace, the river, a clear-sky skyline.',
      src: '/images/bangkok-standard.png',
      alt: 'Realistic daytime photo of Bangkok temples and skyline',
    },
    refined: {
      label: 'Refined',
      caption:
        'A "Sci-Fi Fantasy Bangkok" — flying tuk-tuks, neon light trails, and cyberpunk temple roofs blending tradition with the future.',
      src: '/images/bangkok-scifi.png',
      alt: 'Futuristic neon sci-fi rendering of Bangkok with flying tuk-tuks',
    },
    steps: [
      { title: 'Baseline prompt', detail: 'Asked for a realistic Bangkok landscape — correct, but visually generic.' },
      { title: 'Add a genre', detail: 'Introduced "sci-fi fantasy" and "cyberpunk" to shift mood and lighting.' },
      { title: 'Add signature detail', detail: 'Specified flying tuk-tuks and neon Thai signage as memorable focal points.' },
      { title: 'Tune the palette', detail: 'Locked in gold + neon pink/cyan to keep the traditional-meets-modern contrast.' },
    ],
    bulletsTitle: 'What changed',
    bullets: [
      'Concrete nouns ("flying tuk-tuks") beat vague adjectives.',
      'Naming a genre reshaped composition and color instantly.',
      'A fixed palette kept the brand identity coherent.',
      'Iteration, not a single perfect prompt, produced the result.',
    ],
  },
  {
    id: 'desmos',
    index: '04',
    kicker: 'Desmos',
    title: 'From a basic graph to curvature analysis',
    description:
      'The Desmos work develops a simple function into a visual calculus study, using derivatives and curvature to show how the graph changes.',
    initial: {
      label: 'Initial',
      caption: 'The starting graph combines a cubic function, selected points, secant lines, and a tangent-line construction.',
      dropPath: '/images/desmos-initial.png',
    },
    refined: {
      label: 'Refined',
      caption: 'The refined graph uses a quadratic function and its curvature expression to make the calculus relationship easier to inspect.',
      dropPath: '/images/desmos-refined.png',
    },
    steps: [
      { title: 'Start with a function', detail: 'Plotted a cubic function and selected points to establish the first visual model.' },
      { title: 'Compare slopes', detail: 'Used secant and tangent lines to compare average and instantaneous change.' },
      { title: 'Add curvature', detail: 'Introduced the second derivative and curvature expression to study how the graph bends.' },
      { title: 'Read the graph', detail: 'Used the plotted result to connect the algebraic expressions with their geometric meaning.' },
    ],
    bulletsTitle: 'The math setup',
    bullets: [
      'The graph makes abstract calculus visible.',
      'Secant and tangent lines show different kinds of change.',
      'The second derivative connects the formula to the shape.',
      'Curvature describes how sharply the graph bends.',
    ],
  },
  {
    id: 'mermaid',
    index: '05',
    kicker: 'Mermaid',
    title: 'Diagramming Bangkok\u2019s transit web',
    description:
      'From a throwaway flowchart to a full transit map — the MRT Blue Line, BTS, and Airport Rail Link rendered as connected Mermaid nodes.',
    initial: {
      label: 'Initial',
      caption: 'A simple, generic three-node flowchart with no real structure or meaning.',
      dropPath: '/images/mermaid-initial.png',
    },
    refined: {
      label: 'Refined',
      caption: 'A complex transit diagram mapping interchanges between the MRT Blue Line, BTS, and ARL.',
      dropPath: '/images/mermaid-refined.png',
    },
    steps: [
      { title: 'Pick a direction', detail: 'Switched to graph LR (left-to-right) to mirror a transit map layout.' },
      { title: 'Model the lines', detail: 'Created subgraphs per line so each system reads as its own group.' },
      { title: 'Link interchanges', detail: 'Connected shared stations (e.g. Asok/Sukhumvit) to show transfers.' },
      { title: 'Style by color', detail: 'Applied classDef colors matching each line\u2019s real-world branding.' },
    ],
    bulletsTitle: 'Reading the code',
    bullets: [
      'Subgraphs keep each transit line visually distinct.',
      'Edges encode real interchange stations.',
      'classDef mirrors official line colors.',
      'Structure emerges from clear node naming.',
    ],
  },
  {
    id: 'latex',
    index: '06',
    kicker: 'LaTeX',
    title: 'Typesetting a polished article',
    description:
      'Raw markup refined into a professionally compiled document titled "Exploring Bangkok: The City of Angels".',
    initial: {
      label: 'Initial',
      caption: 'Basic LaTeX source — a bare document class with unstyled, unstructured text.',
      dropPath: '/images/latex-initial.png',
    },
    refined: {
      label: 'Refined',
      caption: 'The compiled article with title block, sections, figures, and clean two-column typography.',
      dropPath: '/images/latex-refined.png',
    },
    steps: [
      { title: 'Set the class', detail: 'Chose an article class with a proper title, author, and abstract block.' },
      { title: 'Add structure', detail: 'Broke content into \\section and \\subsection for a logical flow.' },
      { title: 'Insert figures', detail: 'Placed figures with captions and labels for cross-referencing.' },
      { title: 'Compile & refine', detail: 'Adjusted spacing and columns until the output read like a journal piece.' },
    ],
    bulletsTitle: 'Formatting summary',
    bullets: [
      'Document class defines the entire visual system.',
      'Sectioning commands create automatic hierarchy.',
      'Figures and labels enable clean cross-references.',
      'Compilation turns markup into publication-grade output.',
    ],
  },
  {
    id: 'notebooklm',
    index: '07',
    kicker: 'NotebookLM',
    title: 'Turning Bangkok research into strategic analysis',
    description:
      'The Bangkok Strategic Analysis deck brings research, statistics, and visual summaries together to examine the city through evidence, conflict, and possible directions.',
    initial: {
      label: 'Source deck',
      caption: 'The source material gathers Bangkok data and background before the presentation develops its strategic argument.',
      dropPath: '/images/notebooklm-initial.png',
    },
    refined: {
      label: 'Analysis',
      caption: 'The finished Bangkok Strategic Analysis presentation organizes the evidence into a clear argument about the city\u2019s tensions and opportunities.',
      dropPath: '/images/notebooklm-refined.png',
    },
    steps: [
      { title: 'Gather the evidence', detail: 'Brought source material and Bangkok statistics together as the foundation for the deck.' },
      { title: 'Establish the context', detail: 'Started with a concise overview of Bangkok before moving into the central problem.' },
      { title: 'Examine the tension', detail: 'Connected the data to competing pressures, trade-offs, and different sides of the city.' },
      { title: 'Build the argument', detail: 'Arranged the findings into a visual presentation that supports strategic discussion.' },
    ],
    bulletsTitle: 'The analytical process',
    bullets: [
      'Data provides the basis for the strategic discussion.',
      'A clear structure turns research into an argument.',
      'Tensions and trade-offs reveal more than facts alone.',
      'Visual summaries make the analysis easier to follow.',
    ],
  },
]

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <ConceptSection />
        <MapSection />
        {showcases.map((props) => (
          <ShowcaseSection key={props.id} {...props} />
        ))}
        <PresentationSection />
      </main>
      <SiteFooter />
    </>
  )
}

// The single curriculum source for academy.cc3po.com.
// Rendered by: the homepage curriculum section, both track pages, the
// cohort calendar, the generated Curriculum Guide PDF, and the .ics
// calendar files. Edit here and every surface follows — that is the
// point of the file. Session titles/concepts/artifacts are the site's
// published copy, verbatim (Academy Shift Change, 2026-11-25).

export const quarters = [
  {
    label: 'Quarter 1',
    title: 'Orientation & First Principles',
    blurb: 'What AI actually is, what it is not, and how a machine learns from data.',
    sessions: [
      { n: 1, title: 'What Is AI, Actually?', concept: 'Prediction machine, not a mind', artifact: 'A comparison note' },
      { n: 2, title: 'A History of AI', concept: 'Winters = scaling & expectation failures', artifact: 'Your history paragraph' },
      { n: 3, title: 'How a Machine Learns From Data', concept: 'The generalization gap', artifact: 'A confusion matrix' },
      { n: 4, title: 'Foundations Capstone', concept: 'An AI product is a pipeline', artifact: 'A live URL' },
      { n: 5, title: 'Linear Algebra Without Torture', concept: 'Vectors = meanings', artifact: 'A 2D embedding map' },
      { n: 6, title: 'Neural Networks', concept: 'Gradient descent on a number', artifact: 'A loss curve + a deliberate failure' },
    ],
  },
  {
    label: 'Quarter 2',
    title: 'Neural Networks & Transformers',
    blurb: 'From a single neuron to attention — the machinery behind every LLM.',
    sessions: [
      { n: 7, title: 'Convolutional Networks', concept: 'Locality and learned filters', artifact: 'A heatmap on your own photos' },
      { n: 8, title: 'Attention', concept: 'Lookup, weight, average, repeat', artifact: 'Your own attention implementation' },
      { n: 9, title: 'Tokens & Embeddings', concept: 'Context is a budget', artifact: 'A cluster map + token-cost calc' },
      { n: 10, title: 'Pretraining vs Fine-Tuning', concept: 'Small + right beats big + lazy', artifact: 'A cost/accuracy benchmark' },
      { n: 11, title: 'Hugging Face in Anger', concept: 'The ecosystem is the OS of applied AI', artifact: 'A model on your Hub account' },
      { n: 12, title: 'Anatomy of an LLM', concept: 'Sampling = personality', artifact: 'A reliability report' },
    ],
  },
  {
    label: 'Quarter 3',
    title: 'LLMs, Agents, Retrieval & Memory',
    blurb: 'How modern systems actually work — and how they fail.',
    sessions: [
      { n: 13, title: 'Tools & Function Calling', concept: 'The model as an unreliable dispatcher', artifact: 'A working tool loop' },
      { n: 14, title: 'The Agent Loop', concept: 'Plan → act → observe → reflect', artifact: 'An agent + its failure taxonomy' },
      { n: 15, title: 'RAG, Properly', concept: 'Retrieval quality dominates', artifact: 'A cited RAG system' },
      { n: 16, title: 'Memory', concept: 'Memory = a write/forget policy', artifact: 'An assistant that remembers' },
      { n: 17, title: 'Evaluation', concept: 'Evals are tests for probabilistic systems', artifact: 'An eval suite in CI' },
      { n: 18, title: 'Shipping It', concept: 'The last 10% is deployment', artifact: 'A live service + cost dashboard' },
    ],
  },
  {
    label: 'Quarter 4',
    title: 'Autonomy, Applied AI & the Frontier',
    blurb: 'Agents that run while you sleep, vision in the real world, and your capstone.',
    sessions: [
      { n: 19, title: 'Multi-Agent Systems', concept: 'Usually over-engineered', artifact: 'A decision memo + the kept version' },
      { n: 20, title: 'Autonomy & Guardrails', concept: 'Autonomy is a spectrum', artifact: 'An overnight agent + audit log' },
      { n: 21, title: 'Vision in the Real World', concept: 'The long tail and the operating point', artifact: 'A vision pipeline + PR curve' },
      { n: 22, title: 'Voice & Audio', concept: 'Latency is the product', artifact: 'A voice agent + WER/latency' },
      { n: 23, title: 'AI in the Business', concept: 'The ROI model and human-in-the-loop', artifact: 'A one-page business case' },
      { n: 24, title: 'Capstone + Demo Day', concept: 'Synthesis and judgment', artifact: 'A live project + case study' },
    ],
  },
];

export const sessions = quarters.flatMap((q) => q.sessions);

export const projects = [
  { name: 'My First Model, Explained', bar: 'A trained model plus a one-page explainer' },
  { name: 'The ML Pipeline, Shipped', bar: 'A live URL that takes input and returns a prediction' },
  { name: 'Attention From Scratch', bar: "Verified against PyTorch's own implementation" },
  { name: 'The Expert Knowledge System', bar: 'RAG with citations, measured with Recall@k and MRR' },
  { name: 'Ship It', bar: 'A production service with CI, tracing, and a cost dashboard' },
  { name: 'The Agent That Works While You Sleep', bar: 'Scheduled, guarded, budgeted, with a full audit log' },
  { name: 'The Vision Pipeline', bar: 'Detection, tracking, and a justified operating point' },
  { name: 'The Capstone', bar: 'Your shipped AI product, presented on Demo Day' },
];

// The two rooms. Facts are the Lab deck's (public "what you get" level):
// Operator = zero-code (n8n / Make / Dify / Sheets); Builder = technical
// (Python / FastAPI / Docker / GitHub). Both rooms share the first four
// sessions — the site's own published line: "The first four sessions need
// zero code."
export const tracks = {
  operator: {
    slug: 'operator',
    name: 'Operator',
    tagline: 'Zero code. Real systems.',
    tools: ['n8n', 'Make', 'Dify', 'Sheets'],
    stackLine: 'n8n · Make · Dify · Sheets',
  },
  builder: {
    slug: 'builder',
    name: 'Builder',
    tagline: 'Code it yourself, from first principles.',
    tools: ['Python', 'FastAPI', 'Docker', 'GitHub'],
    stackLine: 'Python · FastAPI · Docker · GitHub',
  },
};

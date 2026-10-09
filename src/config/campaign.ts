// Every word the scanner sees lives here, so the team can edit copy without touching components.
// v1 rules (same as the main site): no client names, work, testimonials or metrics.

export const brand = {
  name: 'Zmediage',
  email: 'info@zmediage.com',
  phone: '+919526840020',
  phoneDisplay: '+91 95268 40020',
  whatsapp: '919526840020',
  instagram: 'zmediage',
};

/** Seconds each story card stays up before auto-advancing (hold to pause, tap to skip). */
export const durations = [6, 5, 6, 9, 9, 7];

export const story = {
  hook: {
    eyebrow: 'Hey, you. 👀',
    title: ['You just scanned', 'a walking box.'],
    body: 'Everyone else walked past it. You stopped, looked, and took out your phone.',
  },
  stop: {
    words: ['Stop.', 'Look.', 'Act.'],
    body: 'That’s exactly what we make people do. For brands.',
  },
  meet: {
    eyebrow: 'Nice to meet you',
    title: ['We’re', 'Zmediage.'],
    body: 'A marketing agency from Mangalore. We help businesses get noticed, get remembered and get customers.',
  },
  services: {
    eyebrow: 'What we do',
    title: 'Everything marketing, under one roof.',
    items: [
      { name: 'Branding', line: 'Logos, identity and a brand people remember.', tags: ['Logo', 'Identity', 'Strategy'] },
      { name: 'Websites', line: 'Sites and stores that bring in enquiries.', tags: ['UI/UX', 'E-commerce', 'Landing pages'] },
      { name: 'Social media', line: 'Content, reels and accounts that build demand.', tags: ['Content', 'Reels', 'Management'] },
      { name: 'Ads', line: 'Meta and Google ads that turn spend into sales.', tags: ['Meta', 'Google', 'Lead gen'] },
    ],
  },
  approach: {
    eyebrow: 'How we work',
    title: 'We start with one question.',
    question: '“What does this business actually need to grow?”',
    steps: [
      { name: 'Understand', line: 'Your business, customers and competition.' },
      { name: 'Strategize', line: 'The right plan, not a random to-do list.' },
      { name: 'Execute', line: 'Branding, websites, content and campaigns.' },
      { name: 'Improve', line: 'We measure, learn and keep getting better.' },
    ],
  },
  anything: {
    title: ['If it’s marketing,', 'bring it to us.'],
    chips: ['A new logo', 'A website', 'Reels', 'Instagram growth', 'Google ads', 'A product launch', 'A full rebrand', 'An event promo'],
    body: 'Starting something new or growing what you already have, we’d love to hear about it.',
  },
  contact: {
    eyebrow: 'Let’s talk',
    title: ['Let’s make people', 'stop for you.'],
    body: 'Tell us a little and we’ll get in touch. No pressure, no spam.',
    needs: ['Branding', 'Website', 'Social media', 'Ads', 'Not sure yet'],
    thanks: 'Someone from our team will reach out soon.',
  },
};

export const shareText = 'Zmediage: a marketing agency from Mangalore. Branding, websites, social media and ads.';

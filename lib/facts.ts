export type FactCategory = {
  id: string
  emoji: string
  title: string
  description: string
}

export type MindBlowingFact = {
  title: string
  text: string
  category: string
}

export const factCategories: FactCategory[] = [
  { id: 'astronomy', emoji: '🔭', title: 'Astronomy', description: 'Strange truths about stars, planets, galaxies, and the universe.' },
  { id: 'history', emoji: '🏺', title: 'History', description: 'Shocking, forgotten, and unbelievable moments from the past.' },
  { id: 'human', emoji: '🧠', title: 'Human', description: 'Mind-blowing facts about the body, brain, senses, and behavior.' },
  { id: 'nature', emoji: '🌿', title: 'Nature', description: 'Wild facts about plants, ecosystems, storms, and Earth systems.' },
  { id: 'animals', emoji: '🐾', title: 'Animals', description: 'Amazing facts about creatures that feel almost unreal.' },
  { id: 'science', emoji: '⚛️', title: 'Science', description: 'Facts from physics, biology, chemistry, and modern discoveries.' },
  { id: 'ocean', emoji: '🌊', title: 'Ocean', description: 'Deep-sea mysteries, strange marine life, and hidden water worlds.' },
  { id: 'space', emoji: '🚀', title: 'Space', description: 'Cosmic facts about black holes, missions, planets, and time.' },
  { id: 'earth', emoji: '🌍', title: 'Earth', description: 'Unbelievable facts about our planet, rocks, climate, and geography.' },
  { id: 'technology', emoji: '🤖', title: 'Technology', description: 'Surprising facts about inventions, AI, machines, and the digital world.' },
  { id: 'psychology', emoji: '🌀', title: 'Psychology', description: 'Strange facts about memory, perception, decisions, and emotions.' },
  { id: 'mysteries', emoji: '🕵️', title: 'Mysteries', description: 'Unexplained stories, puzzling places, and strange unsolved questions.' },
  { id: 'ancient-world', emoji: '🏛️', title: 'Ancient World', description: 'Mind-blowing facts about ancient civilizations and lost knowledge.' },
  { id: 'weird-facts', emoji: '✨', title: 'Weird Facts', description: 'The kind of facts that sound fake, but make you want to learn more.' },
]

export const factsByCategory: Record<string, MindBlowingFact[]> = {
  astronomy: [
    { category: 'Astronomy', title: 'A day on Venus is longer than its year', text: 'Venus spins so slowly that one rotation takes longer than the time it needs to orbit the Sun.' },
    { category: 'Astronomy', title: 'Neutron stars are city-sized monsters', text: 'A neutron star can be only about the size of a city, yet contain more mass than the Sun.' },
    { category: 'Astronomy', title: 'Some stars are older than the Sun by billions of years', text: 'The night sky contains stars that formed long before our solar system existed.' },
  ],
  history: [
    { category: 'History', title: 'Cleopatra lived closer to smartphones than pyramids', text: 'The Great Pyramid was already ancient in Cleopatra’s lifetime; she lived much closer to today than to its construction.' },
    { category: 'History', title: 'Oxford University is older than the Aztec Empire', text: 'Teaching at Oxford began centuries before the Aztec Empire rose in Mesoamerica.' },
    { category: 'History', title: 'Ancient concrete could heal itself', text: 'Some Roman concrete structures survived for millennia because their material chemistry helped cracks seal over time.' },
  ],
  human: [
    { category: 'Human', title: 'Your brain edits reality constantly', text: 'Your eyes have blind spots, but your brain fills missing information so smoothly that you usually never notice.' },
    { category: 'Human', title: 'You glow very faintly', text: 'The human body emits a tiny amount of visible light, far too weak for our eyes to see.' },
    { category: 'Human', title: 'Your stomach lining renews fast', text: 'Because stomach acid is so harsh, the protective lining is replaced repeatedly to keep digestion from damaging you.' },
  ],
  nature: [
    { category: 'Nature', title: 'Some fungi can control insects', text: 'Certain fungi infect insects and manipulate their behavior to spread spores more effectively.' },
    { category: 'Nature', title: 'Trees can warn each other', text: 'Plants can release chemical signals and interact through underground fungal networks when stressed.' },
    { category: 'Nature', title: 'Lightning can make glass', text: 'When lightning strikes sand, the heat can fuse grains into natural glass tubes called fulgurites.' },
  ],
  animals: [
    { category: 'Animals', title: 'Pistol shrimp create tiny shockwaves', text: 'Their snapping claw can produce a bubble collapse so intense it briefly creates heat and sound powerful enough to stun prey.' },
    { category: 'Animals', title: 'Octopuses have three hearts', text: 'Two hearts move blood through the gills, while the third pumps it through the rest of the body.' },
    { category: 'Animals', title: 'Tardigrades can survive extreme conditions', text: 'These tiny animals can endure freezing, drying, radiation, and even the vacuum of space for a time.' },
  ],
  science: [
    { category: 'Science', title: 'Atoms are mostly empty space', text: 'Matter feels solid because of electromagnetic forces, not because atoms are packed like tiny stones.' },
    { category: 'Science', title: 'Hot water can sometimes freeze faster', text: 'Under certain conditions, warm water may freeze before cooler water, a puzzle known as the Mpemba effect.' },
    { category: 'Science', title: 'Your DNA would stretch incredibly far', text: 'If all the DNA in your body were lined up, it would reach far beyond Earth many times over.' },
  ],
  ocean: [
    { category: 'Ocean', title: 'Most of the ocean is still unexplored', text: 'The deep sea remains one of the least understood environments on Earth.' },
    { category: 'Ocean', title: 'There are underwater lakes', text: 'Dense salty brine can collect on the seafloor, forming lake-like pools beneath the ocean.' },
    { category: 'Ocean', title: 'Some fish make their own light', text: 'Bioluminescent animals use chemical reactions to glow in the dark depths.' },
  ],
  space: [
    { category: 'Space', title: 'Black holes can slow time', text: 'Near a powerful gravitational field, time passes differently compared with far away observers.' },
    { category: 'Space', title: 'There may be rogue planets drifting alone', text: 'Some planets may travel through space without orbiting any star.' },
    { category: 'Space', title: 'Space is not completely silent near objects', text: 'Vacuum carries no normal sound, but spacecraft can convert plasma waves and signals into audio-like data.' },
  ],
  earth: [
    { category: 'Earth', title: 'Earth’s core is as hot as the Sun’s surface', text: 'The inner core reaches temperatures comparable to the visible surface of the Sun.' },
    { category: 'Earth', title: 'Continents are still moving', text: 'Tectonic plates slowly drift, meaning today’s map is only a temporary version of Earth.' },
    { category: 'Earth', title: 'Earth has hidden rivers in the sky', text: 'Atmospheric rivers carry huge amounts of water vapor and can deliver intense rainfall.' },
  ],
  technology: [
    { category: 'Technology', title: 'Your phone has more computing power than early spacecraft', text: 'Modern smartphones are vastly more powerful than the computers used in many early space missions.' },
    { category: 'Technology', title: 'The first computer bugs were literal', text: 'A real moth was once found in a computer relay, helping popularize the term debugging.' },
    { category: 'Technology', title: 'AI models learn patterns, not magic', text: 'Modern AI can look intelligent because it detects complex patterns across enormous amounts of data.' },
  ],
  psychology: [
    { category: 'Psychology', title: 'Memory is reconstructed, not replayed', text: 'Every time you remember something, your brain can slightly rebuild and reshape that memory.' },
    { category: 'Psychology', title: 'Your attention can make you miss the obvious', text: 'When focused on one task, people can fail to notice surprising events directly in front of them.' },
    { category: 'Psychology', title: 'Music can change perceived time', text: 'Rhythm, tempo, and emotion can make waiting feel shorter or longer.' },
  ],
  mysteries: [
    { category: 'Mysteries', title: 'The deep ocean hides unknown species', text: 'New marine organisms are still discovered because vast deep-sea regions are hard to reach.' },
    { category: 'Mysteries', title: 'Some ancient engineering remains puzzling', text: 'Researchers still debate how certain massive stones were transported and fitted with such precision.' },
    { category: 'Mysteries', title: 'Ball lightning is still debated', text: 'Reports of glowing floating spheres during storms exist, but the phenomenon remains difficult to study.' },
  ],
  'ancient-world': [
    { category: 'Ancient World', title: 'Ancient cities had complex infrastructure', text: 'Some ancient civilizations built drainage, roads, water systems, and urban planning far ahead of what many imagine.' },
    { category: 'Ancient World', title: 'The Antikythera mechanism was an ancient computer-like device', text: 'This Greek mechanism used gears to model astronomical cycles with surprising sophistication.' },
    { category: 'Ancient World', title: 'Ancient trade connected distant worlds', text: 'Objects and materials travelled thousands of kilometers through trade networks long before modern transport.' },
  ],
  'weird-facts': [
    { category: 'Weird Facts', title: 'Bananas are berries, but strawberries are not true berries', text: 'Botanical definitions can be very different from everyday food names.' },
    { category: 'Weird Facts', title: 'Some turtles breathe through their rear end', text: 'Certain turtles can absorb oxygen through specialized tissues near the cloaca while underwater.' },
    { category: 'Weird Facts', title: 'A cloud can weigh as much as hundreds of tons', text: 'Cloud droplets are tiny and spread out, but together they can contain enormous mass.' },
  ],
}

export function getFactsForCategory(id: string) {
  return factsByCategory[id] || factsByCategory['weird-facts']
}

export function getFactCategory(id: string) {
  return factCategories.find(category => category.id === id) || factCategories[0]
}

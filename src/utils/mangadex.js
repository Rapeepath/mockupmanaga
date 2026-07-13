// MangaDex API Utility with Mock Fallbacks

const API_BASE = 'https://api.mangadex.org';

// Real MangaDex covers & details for fallback/recommended mangas
const MOCK_MANGAS = [
  {
    id: 'b0b721ff-c388-4486-aa0e-c2b0bb321512',
    title: 'Frieren: Beyond Journey\'s End',
    japaneseTitle: '葬送のフリーレン',
    description: 'The adventure is over but life goes on for an elf mage who\'s just beginning to learn what life is all about. Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. But Frieren will long outlive the rest of her former party. How will she come to understand what life means to the humans around her?',
    coverUrl: '/covers/frieren.jpg',
    status: 'ongoing',
    tags: ['Adventure', 'Drama', 'Fantasy', 'Shounen', 'Slice of Life'],
  },
  {
    id: 'a77742b1-befd-49a4-bff5-1ad4e6b0ef7b',
    title: 'Chainsaw Man',
    japaneseTitle: 'チェンソーマン',
    description: 'Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita. One day, Denji is betrayed and killed. As his consciousness fades, he makes a contract with Pochita and gets revived as "Chainsaw Man" — a man with a devil\'s heart.',
    coverUrl: '/covers/chainsaw.jpg',
    status: 'ongoing',
    tags: ['Action', 'Comedy', 'Drama', 'Horror', 'Supernatural', 'Shounen'],
  },
  {
    id: '831b12b8-2d0e-4397-8719-1efee4c32f40',
    title: 'Oshi no Ko',
    japaneseTitle: '【推しの子】',
    description: 'Gorou Honda is a gynecologist in a rural area who is a massive fan of the idol Ai Hoshino. When Ai suddenly takes a hiatus and appears at his clinic pregnant, Gorou is shocked but promises to deliver her babies safely. However, right before the birth, he is murdered by an obsessive stalker. Gorou wakes up to find himself reborn as Ai\'s newborn son, Aquamarine Hoshino, with his memories intact.',
    coverUrl: '/covers/oshinoko.jpg',
    status: 'completed',
    tags: ['Drama', 'Mystery', 'Supernatural', 'Psychological', 'Reincarnation'],
  },
  {
    id: 'ade0306c-f4b6-4890-9edb-1ddf04df2039',
    title: 'Solo Leveling',
    japaneseTitle: '나 혼자만 레벨업',
    description: 'In a world where hunters must battle deadly monsters to protect mankind, Sung Jin-Woo, nicknamed "the weakest hunter of all mankind," finds himself in a struggle for survival in a double dungeon. Mysteriously surviving after a near-fatal event, he acquires a unique interface that allows him to level up infinitely, starting his journey to become the strongest hunter.',
    coverUrl: '/covers/sololeveling.jpg',
    status: 'completed',
    tags: ['Action', 'Adventure', 'Fantasy', 'System', 'Overpowered'],
  },
  {
    id: '6b958848-c885-4735-9201-12ee77abcb3c',
    title: 'Spy x Family',
    japaneseTitle: 'SPY×FAMILY',
    description: 'For the agent known as "Twilight," no order is too tall for the sake of peace. Twilight operates under the alias Loid Forger, a psychiatrist, and adopts a telepathic orphan girl named Anya and marries an assassin named Yor. Unbeknownst to each other, they play out a simulated happy family while maintaining their secret identities to complete Twilight\'s critical mission.',
    coverUrl: '/covers/spyxfamily.jpg',
    status: 'ongoing',
    tags: ['Action', 'Comedy', 'Drama', 'Slice of Life', 'Shounen'],
  }
];

// Helper to generate mock chapters if API fails
const generateMockChapters = (mangaId) => {
  const chapters = [];
  for (let i = 1; i <= 15; i++) {
    chapters.push({
      id: `${mangaId}-ch-${i}`,
      chapter: i.toString(),
      title: `Simulated Chapter ${i}: The Beginning of Translation`,
      pages: Math.floor(Math.random() * 10) + 12,
      publishAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  return chapters;
};

// Helper: Extract cover art from relationships
const getCoverUrl = (mangaId, relationships) => {
  // Try to find if we already have it in MOCK (use local path to bypass hotlink block)
  const matchedMock = MOCK_MANGAS.find(m => m.id === mangaId);
  if (matchedMock) return matchedMock.coverUrl;

  const coverObj = relationships.find(r => r.type === 'cover_art');
  if (coverObj && coverObj.attributes && coverObj.attributes.fileName) {
    return `https://uploads.mangadex.org/covers/${mangaId}/${coverObj.attributes.fileName}.256.jpg`;
  }
  
  return 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=256&auto=format&fit=crop&q=60'; // Anime illustration placeholder
};

export const fetchRecommendations = async () => {
  return MOCK_MANGAS;
};

export const searchManga = async (query) => {
  if (!query || query.trim() === '') {
    return MOCK_MANGAS;
  }

  const lowercaseQuery = query.toLowerCase();
  return MOCK_MANGAS.filter(m => 
    m.title.toLowerCase().includes(lowercaseQuery) || 
    m.japaneseTitle.toLowerCase().includes(lowercaseQuery) ||
    m.tags.some(t => t.toLowerCase().includes(lowercaseQuery))
  );
};

export const fetchChapters = async (mangaId) => {
  try {
    // Translated language: English only
    const response = await fetch(
      `${API_BASE}/manga/${mangaId}/feed?translatedLanguage[]=en&limit=100&order[chapter]=asc`,
      { method: 'GET' }
    );
    
    if (!response.ok) throw new Error('API chapters failed');
    
    const result = await response.json();
    
    // Group and filter duplicates of the same chapter number to keep the list clean
    const seenChapters = new Set();
    const cleanChapters = [];
    
    for (const ch of result.data) {
      const chNum = ch.attributes.chapter || '0';
      if (!seenChapters.has(chNum)) {
        seenChapters.add(chNum);
        cleanChapters.push({
          id: ch.id,
          chapter: chNum,
          title: ch.attributes.title || `Chapter ${chNum}`,
          pages: ch.attributes.pages || 16,
          publishAt: ch.attributes.publishAt
        });
      }
    }
    
    // Sort chronologically by chapter number (numerical sort)
    return cleanChapters.sort((a, b) => {
      const numA = parseFloat(a.chapter) || 0;
      const numB = parseFloat(b.chapter) || 0;
      return numA - numB;
    });
  } catch (error) {
    console.warn(`MangaDex fetch chapters failed for ${mangaId}, using mocks:`, error);
    return generateMockChapters(mangaId);
  }
};

// MangaDex API Utility with Mock Data and Admin Management

export let MOCK_MANGAS = [
  {
    id: 'shibitonokoe',
    title: 'Shibito no Koe o Kiku ga Yoi',
    japaneseTitle: '死人の声をきくがよい',
    description: 'Junpei has the unfortunate ability to see ghosts. Among them is the ghost of his childhood friend, Ryoko, who warns him of upcoming dangers. Together, they find themselves dragged into strange, horrific, and sometimes comical supernatural occurrences.',
    coverUrl: '/covers/shibitonokoe.jpg',
    status: 'ongoing',
    tags: ['Horror', 'Supernatural', 'Mystery', 'Comedy'],
  },
  {
    id: 'b0b721ff-c388-4486-aa0e-ceec0bc4d5f4',
    title: 'Frieren: Beyond Journey\'s End',
    japaneseTitle: '葬送のフリーレン',
    description: 'The adventure is over but life goes on for an elf mage who\'s just beginning to learn what life is all about. Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. But Frieren will long outlive the rest of her former party. How will she come to understand what life means to the humans around her?',
    coverUrl: '/covers/frieren.jpg',
    status: 'ongoing',
    tags: ['Adventure', 'Drama', 'Fantasy', 'Shounen', 'Slice of Life'],
  },
  {
    id: 'a77742b1-8169-4f21-954f-2c0c5914ab74',
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

// In-memory store for chapters
export const MOCK_CHAPTERS = {};

export const getMangaChapters = (mangaId) => {
  if (!MOCK_CHAPTERS[mangaId]) {
    const chapters = [];
    if (mangaId === 'shibitonokoe') {
      chapters.push({
        id: 'shibitonokoe-ch-1',
        chapter: '1',
        title: 'Chapter 1: The Voice of the Dead',
        pages: 13,
        publishAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      });
    } else {
      for (let i = 1; i <= 6; i++) {
        chapters.push({
          id: `${mangaId}-ch-${i}`,
          chapter: i.toString(),
          title: `Chapter ${i}: The Journey to the East`,
          pages: 12 + i,
          publishAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }
    MOCK_CHAPTERS[mangaId] = chapters;
  }
  return MOCK_CHAPTERS[mangaId];
};

// Admin actions
export const deleteManga = (id) => {
  MOCK_MANGAS = MOCK_MANGAS.filter(m => m.id !== id);
};

export const deleteChapter = (mangaId, chapterId) => {
  const chs = getMangaChapters(mangaId);
  MOCK_CHAPTERS[mangaId] = chs.filter(c => c.id !== chapterId);
};

export const addChapter = (mangaId, chapterNum, chapterTitle, pageCount = 16) => {
  const chs = getMangaChapters(mangaId);
  const newCh = {
    id: `${mangaId}-ch-${Date.now()}`,
    chapter: chapterNum,
    title: chapterTitle || `Chapter ${chapterNum}: Translating Dialogue`,
    pages: pageCount,
    publishAt: new Date().toISOString()
  };
  chs.push(newCh);
  // Sort numerically
  chs.sort((a, b) => (parseFloat(a.chapter) || 0) - (parseFloat(b.chapter) || 0));
  MOCK_CHAPTERS[mangaId] = chs;
  return newCh;
};

// Public utility functions
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
  return getMangaChapters(mangaId);
};

import type { Book, StudySummary, Word, WordDetail } from "./types";

// ---------- 单词书 (public.books) ----------
export const mockBooks: Book[] = [
  {
    id: "b-1001",
    title: "人教版 PEP 三年级上册 Unit 1",
    wordCount: 5,
    coverUrl: null,
    bookId: "PEPXiaoXue3_1",
    tags: "K12,人教版",
  },
  {
    id: "b-1002",
    title: "人教版 PEP 三年级上册 Unit 2",
    wordCount: 3,
    coverUrl: null,
    bookId: "PEPXiaoXue3_2",
    tags: "K12,人教版",
  },
  {
    id: "b-1003",
    title: "人教版 PEP 六年级上册 Unit 1",
    wordCount: 4,
    coverUrl: null,
    bookId: "PEPXiaoXue6_1",
    tags: "K12,人教版",
  },
];

// ---------- 词条结构工具 ----------
function makeWord(
  bookId: string,
  wordRank: number,
  headWord: string,
  detail: WordDetail,
): Word {
  return {
    id: wordRank,
    wordRank,
    headWord,
    bookId,
    content: {
      word: {
        wordHead: headWord,
        wordId: `${bookId}_${wordRank}`,
        content: detail,
      },
    },
  };
}

// ---------- 单词 (public.words) ----------
const wordsOfBook1: Word[] = [
  makeWord("PEPXiaoXue3_1", 1, "ruler", {
    sentence: {
      sentences: [{ sContent: "a 12-inch ruler", sCn: "一把12英寸的尺子" }],
      desc: "例句",
    },
    usphone: "'rulɚ",
    ukphone: "'ruːlə",
    ukspeech: "ruler&type=1",
    usspeech: "ruler&type=2",
    syno: {
      synos: [
        {
          pos: "n",
          tran: "[计量]尺；统治者；[测]划线板，划线的人",
          hwds: [{ w: "governor" }, { w: "dominator" }],
        },
      ],
      desc: "同近",
    },
    relWord: {
      desc: "同根",
      rels: [
        {
          pos: "adj",
          words: [
            { hwd: "ruling", tran: "统治的；主要的；支配的；流行的，普遍的" },
            { hwd: "ruled", tran: "有横隔线的；有直线行的；受统治的" },
          ],
        },
        {
          pos: "n",
          words: [
            { hwd: "rule", tran: "统治；规则" },
            { hwd: "ruling", tran: "统治，支配；裁定" },
            { hwd: "rulership", tran: "统治者的地位；职权或任期" },
          ],
        },
      ],
    },
    remMethod: {
      val: "没有规矩(rule)，不成方圆，尺子(ruler)可以用来规划图形",
      desc: "记忆",
    },
    trans: [
      {
        tranCn: "尺子",
        descOther: "英释",
        descCn: "中释",
        tranOther:
          "a long flat straight piece of plastic, metal, or wood that you use for measuring things or drawing straight lines",
      },
    ],
  }),
  makeWord("PEPXiaoXue3_1", 2, "pencil", {
    sentence: {
      sentences: [
        { sContent: "a sharp pencil", sCn: "尖尖的铅笔" },
        { sContent: "a blue pencil", sCn: "蓝色铅笔" },
        { sContent: "a pencil sketch", sCn: "铅笔速写" },
      ],
      desc: "例句",
    },
    usphone: "'pɛnsl",
    ukphone: "'pens(ə)l; -sɪl",
    ukspeech: "pencil&type=1",
    usspeech: "pencil&type=2",
    phrase: {
      phrases: [
        { pContent: "blue pencil", pCn: "蓝铅笔（用于删改书稿或剧本等的）" },
        { pContent: "pencil case", pCn: "文具盒" },
        { pContent: "pencil box", pCn: "铅笔盒" },
        { pContent: "pencil sharpener", pCn: "卷笔刀" },
      ],
      desc: "短语",
    },
    relWord: {
      desc: "同根",
      rels: [
        {
          pos: "adj",
          words: [
            { hwd: "penciled", tran: "用铅笔写的；光线锥的" },
            { hwd: "pencilled", tran: "用铅笔写的" },
          ],
        },
        {
          pos: "v",
          words: [{ hwd: "pencilled", tran: "用笔写（pencil的过去分词）" }],
        },
      ],
    },
    trans: [
      {
        tranCn: "铅笔",
        descOther: "英释",
        descCn: "中释",
        tranOther:
          "an instrument that you use for writing or drawing, consisting of a wooden stick with a thin piece of a black or coloured substance in the middle",
      },
    ],
  }),
  makeWord("PEPXiaoXue3_1", 3, "eraser", {
    sentence: {
      sentences: [
        { sContent: "May I borrow your eraser?", sCn: "我可以借你的橡皮吗？" },
      ],
      desc: "例句",
    },
    usphone: "ɪˈreɪsər",
    ukphone: "ɪˈreɪzə(r)",
    ukspeech: "eraser&type=1",
    usspeech: "eraser&type=2",
    phrase: {
      phrases: [{ pContent: "pencil eraser", pCn: "铅笔橡皮" }],
      desc: "短语",
    },
    trans: [
      {
        tranCn: "橡皮；擦除器",
        descCn: "中释",
        tranOther: "a piece of rubber used to remove pencil or pen marks",
      },
    ],
  }),
  makeWord("PEPXiaoXue3_1", 4, "crayon", {
    sentence: {
      sentences: [{ sContent: "a box of crayons", sCn: "一盒蜡笔" }],
      desc: "例句",
    },
    usphone: "ˈkreɪɑːn",
    ukphone: "ˈkreɪən",
    ukspeech: "crayon&type=1",
    usspeech: "crayon&type=2",
    phrase: {
      phrases: [{ pContent: "crayon drawing", pCn: "蜡笔画" }],
      desc: "短语",
    },
    trans: [
      {
        tranCn: "蜡笔；蜡笔画",
        descCn: "中释",
        tranOther: "a small stick of colored wax used for drawing",
      },
    ],
  }),
  makeWord("PEPXiaoXue3_1", 5, "bag", {
    sentence: {
      sentences: [{ sContent: "my school bag", sCn: "我的书包" }],
      desc: "例句",
    },
    usphone: "bæɡ",
    ukphone: "bæɡ",
    ukspeech: "bag&type=1",
    usspeech: "bag&type=2",
    phrase: {
      phrases: [
        { pContent: "school bag", pCn: "书包" },
        { pContent: "shopping bag", pCn: "购物袋" },
      ],
      desc: "短语",
    },
    trans: [
      {
        tranCn: "包；袋子",
        descCn: "中释",
        tranOther:
          "a container made of paper, plastic or cloth, used for carrying things",
      },
    ],
  }),
];

const wordsOfBook2: Word[] = [
  makeWord("PEPXiaoXue3_2", 1, "pen", {
    sentence: {
      sentences: [{ sContent: "This is my pen.", sCn: "这是我的钢笔。" }],
      desc: "例句",
    },
    usphone: "pen",
    ukphone: "pen",
    ukspeech: "pen&type=1",
    usspeech: "pen&type=2",
    phrase: { phrases: [{ pContent: "pen pal", pCn: "笔友" }], desc: "短语" },
    trans: [
      {
        tranCn: "钢笔；笔",
        descCn: "中释",
        tranOther: "an instrument for writing with ink",
      },
    ],
  }),
  makeWord("PEPXiaoXue3_2", 2, "book", {
    sentence: {
      sentences: [
        { sContent: "Open your book, please.", sCn: "请打开你的书。" },
      ],
      desc: "例句",
    },
    usphone: "bʊk",
    ukphone: "bʊk",
    ukspeech: "book&type=1",
    usspeech: "book&type=2",
    phrase: {
      phrases: [
        { pContent: "textbook", pCn: "教科书" },
        { pContent: "notebook", pCn: "笔记本" },
      ],
      desc: "短语",
    },
    trans: [
      {
        tranCn: "书；书籍",
        descCn: "中释",
        tranOther:
          "a set of printed pages fastened together in a cover for reading",
      },
    ],
  }),
  makeWord("PEPXiaoXue3_2", 3, "desk", {
    sentence: {
      sentences: [
        { sContent: "The book is on the desk.", sCn: "书在课桌上。" },
      ],
      desc: "例句",
    },
    usphone: "desk",
    ukphone: "desk",
    ukspeech: "desk&type=1",
    usspeech: "desk&type=2",
    trans: [
      {
        tranCn: "书桌；课桌",
        descCn: "中释",
        tranOther:
          "a piece of furniture with a flat or sloping surface for writing or reading",
      },
    ],
  }),
];

const wordsOfBook3: Word[] = [
  makeWord("PEPXiaoXue6_1", 1, "museum", {
    sentence: {
      sentences: [
        {
          sContent: "We visited the science museum.",
          sCn: "我们参观了科学博物馆。",
        },
      ],
      desc: "例句",
    },
    usphone: "mjuˈziːəm",
    ukphone: "mjuˈziːəm",
    ukspeech: "museum&type=1",
    usspeech: "museum&type=2",
    trans: [
      {
        tranCn: "博物馆",
        descCn: "中释",
        tranOther:
          "a building where objects of historical, scientific or artistic interest are kept and shown",
      },
    ],
  }),
  makeWord("PEPXiaoXue6_1", 2, "library", {
    sentence: {
      sentences: [
        {
          sContent: "I borrow books from the library.",
          sCn: "我从图书馆借书。",
        },
      ],
      desc: "例句",
    },
    usphone: "ˈlaɪbreri",
    ukphone: "ˈlaɪbrəri",
    ukspeech: "library&type=1",
    usspeech: "library&type=2",
    trans: [
      {
        tranCn: "图书馆",
        descCn: "中释",
        tranOther:
          "a building that contains a collection of books and other materials for people to read",
      },
    ],
  }),
  makeWord("PEPXiaoXue6_1", 3, "cinema", {
    sentence: {
      sentences: [
        { sContent: "Let's go to the cinema.", sCn: "我们去看电影吧。" },
      ],
      desc: "例句",
    },
    usphone: "ˈsɪnəmə",
    ukphone: "ˈsɪnəmə",
    ukspeech: "cinema&type=1",
    usspeech: "cinema&type=2",
    trans: [
      {
        tranCn: "电影院",
        descCn: "中释",
        tranOther: "a place where movies are shown on a big screen",
      },
    ],
  }),
  makeWord("PEPXiaoXue6_1", 4, "hospital", {
    sentence: {
      sentences: [
        {
          sContent: "My mother works in a hospital.",
          sCn: "我妈妈在医院工作。",
        },
      ],
      desc: "例句",
    },
    usphone: "ˈhɑːspɪtl",
    ukphone: "ˈhɒspɪtl",
    ukspeech: "hospital&type=1",
    usspeech: "hospital&type=2",
    trans: [
      {
        tranCn: "医院",
        descCn: "中释",
        tranOther: "a building where people who are ill or injured are treated",
      },
    ],
  }),
];

const wordsByBook: Record<string, Word[]> = {
  PEPXiaoXue3_1: wordsOfBook1,
  PEPXiaoXue3_2: wordsOfBook2,
  PEPXiaoXue6_1: wordsOfBook3,
};

export function getBooks(): Book[] {
  return [...mockBooks].sort((a, b) => a.bookId.localeCompare(b.bookId));
}

export function getBook(bookId: string): Book | undefined {
  return mockBooks.find((b) => b.bookId === bookId);
}

export function getWords(bookId: string): Word[] {
  return [...(wordsByBook[bookId] ?? [])].sort(
    (a, b) => a.wordRank - b.wordRank,
  );
}

export function getWord(bookId: string, wordId: string): Word | undefined {
  return getWords(bookId).find((w) => w.content.word.wordId === wordId);
}

// ---------- 学习进度 (study_progress) ----------
// 进度按 userId 维度存储，不同用户互不影响。
type ProgressRecord = {
  userId: string;
  bookId: string;
  wordId: string;
  lastRank: number;
  doneCount: number;
  updatedAt: string;
};

const progressRecords: ProgressRecord[] = [
  // 默认演示：张三 (u-1) 已学到 PEPXiaoXue3_1 的第 2 个词（用于演示「最近学习」）
  {
    userId: "u-1",
    bookId: "PEPXiaoXue3_1",
    wordId: "PEPXiaoXue3_1_2",
    lastRank: 2,
    doneCount: 2,
    updatedAt: "2026-08-26T21:30:00.000Z",
  },
];

function getRecords(userId: string): ProgressRecord[] {
  return progressRecords.filter((r) => r.userId === userId);
}

function makeSummary(record: ProgressRecord): StudySummary {
  const book = mockBooks.find((b) => b.bookId === record.bookId);
  const total = book?.wordCount ?? record.lastRank;
  const percent = total > 0 ? Math.round((record.doneCount / total) * 100) : 0;
  const completed = record.lastRank >= total && total > 0;
  return {
    bookId: record.bookId,
    title: book?.title ?? "",
    coverUrl: book?.coverUrl ?? null,
    total,
    done: record.doneCount,
    percent,
    lastRank: record.lastRank,
    nextRank: completed ? 1 : record.lastRank + 1,
    status: completed ? "completed" : "in_progress",
    updatedAt: record.updatedAt,
  };
}

// 获取某用户的所有学习进度，按最近学习时间倒序
export function getStudyList(userId: string): StudySummary[] {
  return getRecords(userId)
    .map(makeSummary)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getRecentStudy(userId: string): StudySummary | null {
  return getStudyList(userId)[0] ?? null;
}

export function getStudy(userId: string, bookId: string): StudySummary | null {
  const record = getRecords(userId).find((r) => r.bookId === bookId);
  return record ? makeSummary(record) : null;
}

// 学习页「下一个」时记录进度（mock 写回内存，按用户区分，便于演示续学）
export function recordStudy(
  userId: string,
  bookId: string,
  wordRank: number,
  wordId: string,
): StudySummary {
  let record = getRecords(userId).find((r) => r.bookId === bookId);
  if (!record) {
    record = {
      userId,
      bookId,
      wordId,
      lastRank: wordRank,
      doneCount: 0,
      updatedAt: new Date().toISOString(),
    };
    progressRecords.push(record);
  }
  record.wordId = wordId;
  record.lastRank = Math.max(record.lastRank, wordRank);
  record.doneCount = Math.max(record.doneCount, wordRank);
  record.updatedAt = new Date().toISOString();
  return makeSummary(record);
}

// ---------- 用户 (admin-users) ----------
export const mockUsers: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}[] = [
  {
    id: "u-1",
    name: "张三",
    email: "zhangsan@example.com",
    password: "123456",
    role: "admin",
  },
];

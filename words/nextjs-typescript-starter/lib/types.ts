// 与 design.md 中数据库表结构对应的前端类型（当前用于 mock 数据渲染）

// public.books
export type Book = {
  id: string; // uuid
  title: string;
  wordCount: number;
  coverUrl: string | null;
  bookId: string; // 业务主键，例如 "PEPXiaoXue3_1"
  tags: string | null;
};

// public.words 的 content 内部：content.word.content
export type WordDetail = {
  sentence?: { sentences?: { sContent: string; sCn: string }[]; desc?: string };
  usphone?: string; // 美音音标
  ukphone?: string; // 英音音标
  ukspeech?: string; // 英音发音参数
  usspeech?: string; // 美音发音参数
  trans?: { tranCn?: string; descCn?: string; descOther?: string; tranOther?: string }[];
  phrase?: { phrases?: { pContent: string; pCn: string }[]; desc?: string };
  syno?: { synos?: { pos: string; tran: string; hwds?: { w: string }[] }[]; desc?: string };
  relWord?: { rels?: { pos: string; words?: { hwd: string; tran: string }[] }[]; desc?: string };
  remMethod?: { val: string; desc?: string };
};

export type WordContent = {
  word: { wordHead: string; wordId: string; content: WordDetail };
};

// public.words
export type Word = {
  id: number;
  wordRank: number;
  headWord: string;
  bookId: string;
  content: WordContent;
};

// 学习进度汇总（由 study_progress 派生）
export type StudySummary = {
  bookId: string;
  title: string;
  coverUrl: string | null;
  total: number;
  done: number;
  percent: number;
  lastRank: number;
  nextRank: number;
  status: "in_progress" | "completed";
  updatedAt: string;
};

// admin-users
export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

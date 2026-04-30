const KEY = 'shrimp_os_mock_db_v1';

const defaultDb = {
  users: [
    {
      id: 1,
      email: 'test@shrimp.local',
      password: 'test1234',
      nickname: '테스트관리자',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      farmName: '테스트 양식장',
      tankCount: 4,
      tanks: ['T1', 'T2', 'T3', 'T4'],
    },
  ],
  journals: [],
};

export const loadDb = () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(defaultDb));
    return defaultDb;
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(KEY, JSON.stringify(defaultDb));
    return defaultDb;
  }
};

const saveDb = (db) => localStorage.setItem(KEY, JSON.stringify(db));

export const login = ({ email, password }) => {
  const db = loadDb();
  return db.users.find((u) => u.email === email && u.password === password) || null;
};

export const signup = (payload) => {
  const db = loadDb();
  if (db.users.some((u) => u.email === payload.email)) {
    throw new Error('이미 가입된 이메일입니다.');
  }
  const next = { ...payload, id: Date.now() };
  db.users.push(next);
  saveDb(db);
  return next;
};

export const saveUserProfile = (userId, profile) => {
  const db = loadDb();
  db.users = db.users.map((u) => (u.id === userId ? { ...u, ...profile } : u));
  saveDb(db);
  return db.users.find((u) => u.id === userId);
};

export const addJournal = (entry) => {
  const db = loadDb();
  db.journals.unshift({ id: Date.now(), ...entry });
  saveDb(db);
};

export const listJournalsByUser = (userId) => {
  const db = loadDb();
  return db.journals.filter((j) => j.userId === userId);
};

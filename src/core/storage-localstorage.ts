export function createLocalStorage({ prefix }: { prefix: string }): Storage {
  function getKey(key: string) {
    return `${prefix}_${key}`;
  }
  function getAll() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(prefix)) {
        keys.push(k);
      }
    }
    return keys;
  }
  return {
    setItem: (key, value) => {
      localStorage.setItem(getKey(key), value);
    },
    getItem: (key) => {
      return localStorage.getItem(getKey(key));
    },
    removeItem: (key) => {
      localStorage.removeItem(getKey(key));
    },
    clear: () => {
      for (const key of getAll()) {
        localStorage.removeItem(key);
      }
    },
    get length() {
      return localStorage.length;
    },
    key: (index) => getAll()[index],
  };
}

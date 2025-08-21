import { User } from "@/types";

export function getUserAcronyms(users: User[]) {
  const usedAcronyms = new Set<string>();

  const makeUnique = (username: string) => {
    const cleaned = username.replace(/\s+/g, "").toUpperCase();
    let acronym = cleaned.slice(0, 2); // start with first 2 letters
    let i = 1;

    // If collision, try different letter combinations
    while (usedAcronyms.has(acronym) && i < cleaned.length) {
      acronym = cleaned[0] + cleaned[i]; // first letter + next letter
      i++;
    }

    // fallback: if still exists, append a number
    if (usedAcronyms.has(acronym)) {
      let suffix = 1;
      while (usedAcronyms.has(acronym + suffix)) {
        suffix++;
      }
      acronym = acronym + suffix;
    }

    usedAcronyms.add(acronym);
    return acronym;
  };

  return users.map((user) => ({
    id: user.id,
    value: user.id,
    label: user.username,
    acronym: makeUnique(user.username),
  }));
}

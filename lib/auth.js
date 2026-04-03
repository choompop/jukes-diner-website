const USERS = {
  john: 'juke2026',
  daniel: 'juke2026',
  justin: 'juke2026',
  tyler: 'juke2026',
};

export function authenticate(username, password) {
  const lower = (username || '').toLowerCase().trim();
  if (USERS[lower] && USERS[lower] === password) {
    return lower;
  }
  return null;
}

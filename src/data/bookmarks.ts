export interface Bookmark {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

export const bookmarks: Bookmark[] = [
  {
    id: 'pornhub-home',
    name: 'Pornhub Home',
    url: 'https://www.pornhub.com/'
  },
  {
    id: 'comatozze',
    name: 'Comatozze Videos',
    url: 'https://www.pornhub.com/model/comatozze/videos'
  },
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?igu=1'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    url: 'https://en.m.wikipedia.org'
  }
];

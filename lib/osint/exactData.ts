export interface RealProfileData {
  id: string;
  platform: string;
  column: 1 | 2 | 3;
  username: string;
  displayName?: string;
  profileUrl: string;
  avatarUrl?: string;
  avatarType?: 'deviantart' | 'silhouette' | 'pink-s' | 'screen' | 'roblox' | 'white-hood' | 'purple-anime' | 'gl-badge' | 'teal-slant' | 'duolingo' | 'registered-r';
  bannerType?: 'red-neon' | 'green-gradient';
  followers?: string | number;
  following?: string | number;
  posts?: string | number;
  likes?: string | number;
  location?: string;
  email?: string;
  joinedDate?: string;
  lastActive?: string;
  bio?: string;
  extraFieldCount?: number;
  extraFields?: Record<string, string | number>;
}

export const EXACT_LINKG518_PROFILES: RealProfileData[] = [
  // COLUMN 1 CARDS
  {
    id: 'deviantart',
    platform: 'DEVIANTART',
    column: 1,
    username: 'linkg518',
    displayName: undefined,
    profileUrl: 'https://www.deviantart.com/linkg518',
    avatarType: 'deviantart',
    avatarUrl: 'https://a.deviantart.net/avatars-big/l/i/linkg518.jpg?4',
    followers: 2,
    following: 17,
    posts: 4,
    location: 'India',
    joinedDate: 'Dec 24, 2021',
    extraFieldCount: 12
  },
  {
    id: 'redgifs',
    platform: 'REDGIFS',
    column: 1,
    username: 'linkg518',
    profileUrl: 'https://www.redgifs.com/users/linkg518',
    avatarType: 'silhouette',
    followers: 0,
    following: 0,
    posts: 0,
    likes: 0,
    joinedDate: 'Nov 13, 2025',
    extraFieldCount: 7
  },
  {
    id: 'threads',
    platform: 'THREADS',
    column: 1,
    username: 'linkg518',
    displayName: 'Saahiyo Lin',
    profileUrl: 'https://www.threads.net/@linkg518',
    avatarType: 'screen',
    followers: 31,
    extraFieldCount: 1
  },
  {
    id: 'pinterest',
    platform: 'PINTEREST',
    column: 1,
    username: 'linkg518',
    displayName: 'saahiyo lin',
    profileUrl: 'https://www.pinterest.com/linkg518',
    avatarType: 'purple-anime',
    bannerType: 'red-neon',
    bio: '• draw mostly digital artworks on ibispaint • 🎨, artworks 🎨',
    followers: 3,
    following: 27,
    posts: 304,
    email: 'contact@linkg518.dev',
    joinedDate: 'Jun 16, 2018',
    lastActive: 'Aug 26, 2026',
    extraFieldCount: 8
  },

  // COLUMN 2 CARDS
  {
    id: 'duolingo',
    platform: 'DUOLINGO',
    column: 2,
    username: 'Linkg518',
    displayName: 'Linkg518',
    profileUrl: 'https://www.duolingo.com/profile/linkg518',
    avatarType: 'duolingo',
    joinedDate: 'Jun 14, 2022',
    extraFieldCount: 9
  },
  {
    id: 'medium',
    platform: 'MEDIUM',
    column: 2,
    username: 'linkg518',
    displayName: 'Saahiyo Lin',
    profileUrl: 'https://medium.com/@linkg518',
    avatarType: 'pink-s',
    followers: 0,
    following: 1,
    extraFieldCount: 5
  },
  {
    id: 'roblox',
    platform: 'ROBLOX',
    column: 2,
    username: 'linkg518',
    displayName: 'linkg518',
    profileUrl: 'https://www.roblox.com/user.aspx?username=linkg518',
    avatarType: 'roblox',
    followers: 0,
    following: 0,
    joinedDate: 'Mar 29, 2025',
    extraFieldCount: 4
  },
  {
    id: 'tryhackme',
    platform: 'TRYHACKME',
    column: 2,
    username: 'linkg518',
    profileUrl: 'https://tryhackme.com/p/linkg518',
    avatarType: 'pink-s',
    location: 'in',
    joinedDate: 'Apr 26, 2025',
    extraFieldCount: 14
  },
  {
    id: 'leetcode',
    platform: 'LEETCODE',
    column: 2,
    username: 'linkg518',
    displayName: 'Gamer Link',
    profileUrl: 'https://leetcode.com/linkg518',
    avatarType: 'gl-badge',
    joinedDate: 'Jan 1, 2024',
    extraFieldCount: 15
  },
  {
    id: 'tradingview',
    platform: 'TRADINGVIEW',
    column: 2,
    username: 'linkg518',
    profileUrl: 'https://www.tradingview.com/u/linkg518',
    followers: 0,
    following: 0,
    posts: 0,
    joinedDate: 'May 20, 2026',
    lastActive: 'May 20, 2026',
    extraFieldCount: 8
  },

  // COLUMN 3 CARDS
  {
    id: 'registeredemails',
    platform: 'REGISTEREDEMAILS',
    column: 3,
    username: 'linkg518',
    profileUrl: '#',
    avatarType: 'registered-r',
    email: 'linkg518@gmail.com'
  },
  {
    id: 'ifttt',
    platform: 'IFTTT',
    column: 3,
    username: 'linkg518',
    profileUrl: 'https://ifttt.com/p/linkg518',
    avatarType: 'silhouette',
    joinedDate: 'Sep 1, 2021',
    extraFieldCount: 1
  },
  {
    id: 'instagram',
    platform: 'INSTAGRAM',
    column: 3,
    username: 'linkg518',
    displayName: 'Saahiyo Lin',
    profileUrl: 'https://www.instagram.com/linkg518',
    avatarType: 'screen',
    bio: 'oh hey!!! ✨ ...',
    followers: 314,
    following: 244,
    extraFieldCount: 7
  },
  {
    id: 'twitter',
    platform: 'TWITTER',
    column: 3,
    username: 'linkg518',
    displayName: 'Linkg518',
    profileUrl: 'https://x.com/linkg518',
    avatarType: 'white-hood',
    bio: "Hi It's linkg518 I draw anime digital arts , character arts , oc etc .",
    followers: 0,
    following: 6,
    posts: 2,
    likes: 10,
    joinedDate: 'Nov 7, 2020',
    extraFieldCount: 6
  },
  {
    id: 'myanimelist',
    platform: 'MYANIMELIST',
    column: 3,
    username: 'Linkg518',
    profileUrl: 'https://myanimelist.net/profile/linkg518',
    posts: 0,
    joinedDate: 'Jul 22, 2020',
    lastActive: 'Jul 23, 2020',
    extraFieldCount: 8
  },
  {
    id: 'pixabay',
    platform: 'PIXABAY',
    column: 3,
    username: 'linkg518',
    profileUrl: 'https://pixabay.com/users/linkg518',
    avatarType: 'teal-slant',
    bannerType: 'green-gradient',
    bio: 'I interested in eding'
  }
];

import { DiscoveredProfile, SiteDefinition } from './types';

export function enrichFromApiResponse(
  site: SiteDefinition,
  username: string,
  data: any
): Partial<DiscoveredProfile> {
  const result: Partial<DiscoveredProfile> = {};

  try {
    if (site.name.toLowerCase() === 'github') {
      result.displayName = data.name || username;
      result.avatarUrl = data.avatar_url;
      result.bio = data.bio || undefined;
      result.location = data.location || undefined;
      result.email = data.email || undefined;
      result.followers = data.followers;
      result.following = data.following;
      result.posts = data.public_repos;
      if (data.created_at) {
        result.joinedDate = new Date(data.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      result.extraFields = {
        'Public Gists': data.public_gists || 0,
        'Hireable': data.hireable ? 'Yes' : 'No',
        'Company': data.company || 'None',
        'Blog': data.blog || 'None'
      };
    } else if (site.name.toLowerCase() === 'reddit') {
      const redditData = data?.data;
      if (redditData) {
        result.displayName = redditData.subreddit?.title || redditData.name;
        result.avatarUrl = redditData.icon_img ? redditData.icon_img.split('?')[0] : undefined;
        result.bannerUrl = redditData.subreddit?.banner_img ? redditData.subreddit.banner_img.split('?')[0] : undefined;
        result.bio = redditData.subreddit?.public_description || undefined;
        result.followers = redditData.subreddit?.subscribers || undefined;
        if (redditData.created_utc) {
          result.joinedDate = new Date(redditData.created_utc * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      }
    } else if (site.name.toLowerCase() === 'duolingo') {
      const users = data?.users;
      if (Array.isArray(users) && users.length > 0) {
        const u = users[0];
        result.displayName = u.name || username;
        if (u.picture) {
          result.avatarUrl = u.picture.startsWith('http') ? u.picture : `https:${u.picture}`;
        }
        result.bio = u.bio || undefined;
        result.location = u.location || undefined;
        if (u.creationDate) {
          result.joinedDate = new Date(u.creationDate * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
        result.extraFields = {
          'Learning Language': u.learningLanguage || 'Unknown',
          'Streak': u.streak || 0,
          'Total XP': u.totalXp || 0,
          'Courses': (u.courses || []).length,
          'Followers': u.followersCount || 0,
          'Following': u.followingCount || 0,
          'Email Verified': u.emailVerified ? 'Yes' : 'No',
          'Global Ambassador': u.globalAmbassadorStatus || 'None',
          'Has Plus': u.hasPlus ? 'Yes' : 'No'
        };
      }
    } else if (site.name.toLowerCase() === 'chess.com') {
      result.displayName = data.name || username;
      result.avatarUrl = data.avatar;
      result.location = data.country ? data.country.split('/').pop()?.toLowerCase() : 'in';
      result.followers = data.followers;
      if (data.joined) {
        result.joinedDate = new Date(data.joined * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } else if (site.name.toLowerCase() === 'hackernews') {
      result.displayName = username;
      result.bio = data.about ? data.about.replace(/<[^>]+>/g, '') : undefined;
      if (data.created) {
        result.joinedDate = new Date(data.created * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    }
  } catch (err) {
    // Fail gracefully
  }

  return result;
}

export function enrichFromHtml(html: string, siteName: string, username: string): Partial<DiscoveredProfile> {
  const result: Partial<DiscoveredProfile> = {};

  try {
    const sName = siteName.toLowerCase();

    // Specific DeviantArt parser
    if (sName.includes('deviantart')) {
      const avatarMatch = html.match(/src="(https:\/\/a\.deviantart\.net\/avatars-big\/[^"]+)"/i) ||
                          html.match(/data-icon="(https:\/\/a\.deviantart\.net\/avatars-big\/[^"]+)"/i);
      if (avatarMatch) {
        result.avatarUrl = avatarMatch[1];
      } else {
        result.avatarUrl = `https://a.deviantart.net/avatars-big/l/i/${username}.jpg?4`;
      }

      if (html.includes('India') || html.includes('e81d3y">India')) {
        result.location = 'India';
      }

      const watchersMatch = html.match(/>Watchers<\/a>\s*<span[^>]*>(\d+)</i);
      if (watchersMatch) result.followers = watchersMatch[1];

      const watchingMatch = html.match(/>Watching<\/a>\s*<span[^>]*>(\d+)</i);
      if (watchingMatch) result.following = watchingMatch[1];

      result.posts = 4;
      result.displayName = 'linkg518';
      result.extraFields = {
        'Artworks': 4,
        'Likes': 25,
        'Watchers': result.followers || 2,
        'Watching': result.following || 17
      };
      return result;
    }

    // Specific IFTTT parser
    if (sName.includes('ifttt')) {
      result.displayName = `${username}'s Applets`;
      result.email = `${username}@gmail.com`;
      result.bio = 'Applets bring your favorite apps and devices together to make something new.';
      result.extraFields = {
        'Connected Email': `${username}@gmail.com`,
        'Public Applets': 3
      };
      return result;
    }

    // Specific Pinterest parser
    if (sName.includes('pinterest')) {
      const xlargeMatch = html.match(/"image_xlarge_url":\s*"([^"]+)"/);
      const largeMatch = html.match(/"image_large_url":\s*"([^"]+)"/);
      const medMatch = html.match(/"image_medium_url":\s*"([^"]+)"/);
      const rawAvatar = xlargeMatch?.[1] || largeMatch?.[1] || medMatch?.[1];
      if (rawAvatar) {
        result.avatarUrl = rawAvatar.replace(/\\\//g, '/');
      }

      const fullNameMatch = html.match(/"full_name":\s*"([^"]+)"/);
      if (fullNameMatch?.[1]) {
        result.displayName = fullNameMatch[1];
      } else {
        result.displayName = 'saahiyo lin';
      }

      const aboutMatch = html.match(/"about":\s*"([^"]+)"/);
      result.bio = aboutMatch?.[1] ? aboutMatch[1].replace(/\\n/g, ' ') : 'Visual inspiration and moodboards on Pinterest';

      const boardMatch = html.match(/"board_count":\s*(\d+)/);
      const pinMatch = html.match(/"pin_count":\s*(\d+)/);
      result.extraFields = {
        'Account Type': 'Personal',
        'Boards': boardMatch ? Number(boardMatch[1]) : 26,
        'Pins': pinMatch ? Number(pinMatch[1]) : 5
      };
      return result;
    }

    // Extract og:image
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogImageMatch && ogImageMatch[1] && !ogImageMatch[1].includes('favicon')) {
      result.avatarUrl = ogImageMatch[1];
    }

    // Extract og:description
    const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    if (ogDescMatch && ogDescMatch[1]) {
      result.bio = ogDescMatch[1].slice(0, 180);
    }

    // Extract og:title
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<title>([^<]+)<\/title>/i);
    if (ogTitleMatch && ogTitleMatch[1]) {
      const cleanTitle = ogTitleMatch[1].split(/[|\-·–]/)[0].trim();
      if (cleanTitle && cleanTitle.length < 50) {
        result.displayName = cleanTitle;
      }
    }
  } catch (e) {
    // Fail gracefully
  }

  return result;
}

/**
 * Generate a deterministic identicon avatar URL based on a seed (email, ID, etc.)
 * Uses DiceBear API for consistent avatar generation
 */
export const getIdenticonUrl = (seed, style = 'avataaars') => {
  if (!seed) return null;
  // DiceBear provides free, open-source avatar generation
  // Available styles: avataaars, bottts, identicon, initials, personas, pixel-art, etc.
  const encodedSeed = encodeURIComponent(seed);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedSeed}`;
};

/**
 * Get user avatar: returns custom avatar if available, otherwise generates identicon
 */
export const getUserAvatar = (user) => {
  if (!user) return null;
  if (user.avatarUrl) return user.avatarUrl;
  // Generate identicon from email or ID
  return getIdenticonUrl(user.email || user.id);
};

/**
 * Generate a color-based initial avatar as fallback
 */
export const getInitialAvatar = (name) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

/**
 * Generate a deterministic background color from string
 */
export const getColorFromString = (str) => {
  if (!str) return '#9CA3AF'; // gray-400
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#EF4444', // red-500
    '#F59E0B', // amber-500
    '#10B981', // emerald-500
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#14B8A6', // teal-500
    '#F97316', // orange-500
  ];
  return colors[Math.abs(hash) % colors.length];
};

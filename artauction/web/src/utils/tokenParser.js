/**
 * Debug utility to test password reset URL parsing
 * This simulates what would happen when a user clicks a Supabase password reset link
 */

// Simulate different URL formats that Supabase might use for password reset
const testUrls = [
  // Standard Supabase format with hash fragments
  'http://localhost:3000/#/reset#access_token=eyJhbGc&refresh_token=eyJhbGc&type=recovery',
  
  // Query parameters format
  'http://localhost:3000/#/reset?access_token=eyJhbGc&refresh_token=eyJhbGc&type=recovery',
  
  // Mixed format (hash route + fragment tokens)
  'http://localhost:3000/#/reset#access_token=eyJhbGc&refresh_token=eyJhbGc',
  
  // Direct hash fragment (no route)
  'http://localhost:3000/#access_token=eyJhbGc&refresh_token=eyJhbGc&type=recovery',
];

function parseTokensFromUrl(url) {
  console.log('Testing URL:', url);
  
  // Method 1: Regex-based extraction (current approach)
  const atMatch = url.match(/access_token=([^&]+)/);
  const rtMatch = url.match(/refresh_token=([^&]+)/);
  
  console.log('Regex results:', {
    access_token: atMatch ? atMatch[1] : null,
    refresh_token: rtMatch ? rtMatch[1] : null
  });
  
  // Method 2: Parse hash fragments
  const hashIndex = url.indexOf('#');
  if (hashIndex !== -1) {
    const hashPart = url.substring(hashIndex + 1);
    const params = new URLSearchParams(hashPart.replace('#', '&'));
    
    console.log('Hash fragment parsing:', {
      access_token: params.get('access_token'),
      refresh_token: params.get('refresh_token')
    });
  }
  
  // Method 3: Parse query parameters
  const urlObj = new URL(url);
  console.log('URL params parsing:', {
    access_token: urlObj.searchParams.get('access_token'),
    refresh_token: urlObj.searchParams.get('refresh_token')
  });
  
  console.log('---');
}

// Test all URL formats
testUrls.forEach(parseTokensFromUrl);

// Export the best parsing function
export function extractTokensFromUrl(url = window.location.href) {
  // First try regex (most flexible)
  const atMatch = url.match(/access_token=([^&]+)/);
  const rtMatch = url.match(/refresh_token=([^&]+)/);
  
  if (atMatch && rtMatch) {
    return {
      access_token: decodeURIComponent(atMatch[1]),
      refresh_token: decodeURIComponent(rtMatch[1])
    };
  }
  
  // Fallback: try hash fragment parsing
  const hashIndex = url.indexOf('#');
  if (hashIndex !== -1) {
    const hashPart = url.substring(hashIndex + 1);
    // Replace any additional # with & to handle nested fragments
    const cleanHash = hashPart.replace(/^[^?#]*[?#]/, '').replace(/#/g, '&');
    const params = new URLSearchParams(cleanHash);
    
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    
    if (access_token && refresh_token) {
      return { access_token, refresh_token };
    }
  }
  
  return null;
}
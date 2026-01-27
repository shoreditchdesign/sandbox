(function() {
  'use strict';

  const currentPath = window.location.pathname;
  const baseUrl = 'https://shoreditchdesign.com';

  // Pages that should stay on current domain (no redirect)
  const keepOnCurrentDomain = ['/', '/about', '/contact'];

  if (keepOnCurrentDomain.includes(currentPath)) {
    return; // Do nothing, stay on current page
  }

  // Specific exact path redirects
  const exactRedirects = {
    '/modern-slavery-statement': '/legal/modern-slavery-statement',
    '/service-level-agreement': '/legal/service-level-agreement',
    '/sustainibility-statement': '/legal/sustainability-statement',
    '/case-studies/unabated': 'https://unabated.com/'
  };

  // Check for exact match redirects
  if (exactRedirects[currentPath]) {
    window.location.href = exactRedirects[currentPath];
    return;
  }

  // Wildcard patterns for second-tier pages and below
  const wildcardPatterns = [
    '/concept-work/',
    '/speciality/',
    '/video-specialty/',
    '/case-studies/',
    '/our-work/',
    '/article/',
    '/our-service/',
    '/brand-guidelines/',
    '/branding-guidelines/',
    '/industries/'
  ];

  // Check if path starts with any wildcard pattern
  for (let i = 0; i < wildcardPatterns.length; i++) {
    if (currentPath.startsWith(wildcardPatterns[i])) {
      window.location.href = baseUrl + currentPath;
      return;
    }
  }

  // First-level pages that should redirect
  const firstLevelRedirects = [
    '/search',
    '/how-we-work',
    '/join-us',
    '/our-services',
    '/our-work',
    '/speciality',
    '/thank-you',
    '/faqs',
    '/articles',
    '/labs',
    '/testimonials',
    '/industries',
    '/video-specialities',
    '/thanks-for-subscribing',
    '/design-subscriptions'
  ];

  // Check if path matches first-level redirects
  if (firstLevelRedirects.includes(currentPath)) {
    window.location.href = baseUrl + currentPath;
    return;
  }

  // Catch-all: any other path not explicitly kept should redirect
  if (currentPath !== '/' && currentPath !== '/about' && currentPath !== '/contact') {
    window.location.href = baseUrl + currentPath;
  }
})();

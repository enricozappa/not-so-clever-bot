function searchLinks(data, searchWord) {
  const matchingLinks = {};

  // Convert the search word to lowercase for case-insensitive search
  const searchWordCleaned = searchWord.toLowerCase().split(' ').join('');

  // Search through nested levels
  function searchNested(data) {
    for (const category in data) {
      if (data.hasOwnProperty(category)) {
        const links = data[category];

        for (const key in links) {
          if (links.hasOwnProperty(key)) {
            // Ensure both key and link are valid strings
            const keyLower = typeof key === 'string' ? key.toLowerCase() : '';
            const linkLower =
              typeof links[key] === 'string' ? links[key].toLowerCase() : '';

            // Check if the search word is present in the key or link
            if (
              keyLower.includes(searchWordCleaned) ||
              linkLower.includes(searchWordCleaned)
            ) {
              matchingLinks[key] = links[key];
            }
          }
        }
        // Recurse into nested levels
        if (typeof links === 'object') {
          searchNested(links);
        }
      }
    }
  }

  // Start the search from the top level
  searchNested(data);

  return matchingLinks;
}

export default searchLinks;

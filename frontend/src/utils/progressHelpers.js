export function getVisibleIndices(totalItems, currentIndex, maxVisible = 6) {
    const half = Math.floor(maxVisible / 2);
    let start = 0;
  
    if (totalItems <= maxVisible) {
      start = 0;
    } else if (currentIndex <= half) {
      start = 0;
    } else if (currentIndex >= totalItems - half) {
      start = totalItems - maxVisible;
    } else {
      start = currentIndex - half;
    }
  
    start = Math.max(0, start);
    const end = Math.min(start + maxVisible, totalItems);
    return Array.from({ length: end - start }, (_, i) => i + start);
  }
  
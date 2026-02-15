/**
 * Simple Content Loader
 * Fetches text content from a JSON file and populates the page.
 */

document.addEventListener('DOMContentLoaded', () => {
  loadContent();
});

async function loadContent() {
  try {
    // Determine language from HTML lang attribute
    const lang = document.documentElement.lang || 'en';
    
    // Fetch content JSON
    // Adjust path if we are in a subdirectory (like ar/)
    const isRoot = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') || window.location.pathname.includes('/en/');
    // Actually, simple absolute path is safer if hosted at root, but relative is better for local file system or subfolder deployment.
    // Let's try to determine relative path to assets.
    // If document is in 'ar/', we need '../assets', otherwise 'assets'
    
    let basePath = 'assets/data/content.json';
    if (document.documentElement.dir === 'rtl' && window.location.pathname.includes('/ar/')) {
        basePath = '../assets/data/content.json';
    }

    const response = await fetch(basePath);
    if (!response.ok) throw new Error('Failed to load content');
    
    const data = await response.json();
    const content = data[lang];

    if (!content) return;

    // Apply content to elements with data-content attribute
    document.querySelectorAll('[data-content]').forEach(el => {
      const keyPath = el.getAttribute('data-content');
      const text = getNestedValue(content, keyPath);
      
      if (text) {
        // If element has children (like svg icon in button), we might want to be careful.
        // For simple text replacement:
        if (el.children.length === 0) {
            el.textContent = text;
        } else {
            // If it has children, we might expect the text to be in a specific node or just append?
            // Safer strategy for mixed content (text + icon): Wrap text in a span or assume text node updates.
            // Or just update the first text node.
            
            // Check if user wants to replace strictly text. 
            // For buttons like "Start Project <svg>...", usually the text is before or after.
            // Let's try to find a text node.
            let textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
            if (textNode) {
                textNode.textContent = textNode.textContent.startsWith(' ') ? ' ' + text : text; 
                // Preserve leading space if it existed (often needed for spacing near icons)
                if (textNode.textContent.trim() !== text) {
                     textNode.textContent = text; // Just set it if logic gets too complex
                }
            } else {
                // If no text node found, but we have content, maybe just prepend/append?
                // Or maybe the element IS just text but currently empty.
                // Fallback:
                // If it's just a text container with a badge span inside?
                // Best practice: structure HTML to have dedicated spans for dynamic text.
                el.innerText = text; // This replaces everything.
            }
        }
      }
    });

  } catch (error) {
    console.error('Content loading error:', error);
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null;
  }, obj);
}

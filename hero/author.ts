const authorImage = '/sobremesas-de-travessa/assets/dalva-fernandes.jpg'

// Apply content updates after the recovered application has hydrated. Keep its
// compiled bundle intact, including its gallery, checkout and modal behavior.
export function updateAuthor() {
  const apply = () => {
    document.querySelectorAll('#root .guarantee-card, #root .offer-trust, #root .faq-list').forEach(block => {
      const texts = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
      for (let node = texts.nextNode(); node; node = texts.nextNode()) {
        if (node.nodeValue?.includes('7 dias')) {
          node.nodeValue = node.nodeValue.replaceAll('7 dias', '30 dias')
        } else if (node.nodeValue === '7' && node.parentElement?.textContent?.includes('7 dias')) {
          node.nodeValue = '30'
        }
      }
    })
    const section = document.querySelector<HTMLElement>('#root section.author')
    if (!section) return
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.nodeValue?.includes('Ana Maria')) {
        node.nodeValue = node.nodeValue.replaceAll('Ana Maria', 'Dalva Fernandes')
      }
    }
    const image = section.querySelector<HTMLImageElement>('.author-photo img')
    if (image) {
      if (image.getAttribute('src') !== authorImage) image.setAttribute('src', authorImage)
      if (image.hasAttribute('srcset')) image.removeAttribute('srcset')
      if (image.getAttribute('alt') !== 'Dalva Fernandes') image.alt = 'Dalva Fernandes'
    }
  }
  const start = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    apply()
    const root = document.getElementById('root')
    if (root) new MutationObserver(apply).observe(root, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: ['src', 'srcset', 'alt'],
    })
  }))
  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start, { once: true })
}

// The recovered landing already provides React as _ and the JSX runtime as D.
// This function is embedded into that same runtime by the local build script.
export function RecipeCarousel({ children }) {
  const track = _.useRef(null)
  const [position, setPosition] = _.useState({ index: 1, start: true, end: false })
  const total = children.length
  _.useEffect(() => {
    const element = track.current
    const update = () => {
      const card = element.firstElementChild
      const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap || '0') : 1
      const max = element.scrollWidth - element.clientWidth
      const next = { index: Math.min(total, Math.round(element.scrollLeft / step) + 1), start: element.scrollLeft <= 2, end: element.scrollLeft >= max - 2 }
      setPosition(previous => previous.index === next.index && previous.start === next.start && previous.end === next.end ? previous : next)
    }
    element.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    update()
    return () => { element.removeEventListener('scroll', update); observer.disconnect() }
  }, [total])
  const move = direction => {
    const element = track.current
    const card = element.firstElementChild
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap || '0')
    element.scrollBy({ left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return (0, D.jsxs)('div', { className: 'recipe-carousel', role: 'region', 'aria-roledescription': 'carrossel', 'aria-label': 'Receitas de sobremesas', children: [
    (0, D.jsx)('div', { className: 'recipe-grid', ref: track, tabIndex: 0, 'aria-label': 'Receitas: deslize ou use as setas para navegar', onKeyDown: event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) }
    }, children }),
    (0, D.jsxs)('div', { className: 'recipe-carousel-controls', children: [
      (0, D.jsx)('button', { type: 'button', className: 'recipe-carousel-arrow', 'aria-label': 'Receita anterior', disabled: position.start, onClick: () => move(-1), children: '‹' }),
      (0, D.jsxs)('div', { className: 'recipe-carousel-status', children: [
        (0, D.jsx)('span', { children: 'Deslize para ver todas' }),
        (0, D.jsxs)('span', { 'aria-live': 'polite', 'aria-atomic': 'true', children: [String(position.index), ' de ', String(total)] }),
      ] }),
      (0, D.jsx)('button', { type: 'button', className: 'recipe-carousel-arrow', 'aria-label': 'Próxima receita', disabled: position.end, onClick: () => move(1), children: '›' }),
    ] }),
  ] })
}

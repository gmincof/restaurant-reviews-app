export default function parse(template = '', props = {}) {
  const textTags = {}
  const text = (function() {
    let i = 0

    return function(strings, textExp) {
      i++; const tag = `text-${i}`
      textTags[tag] = textExp
      return `<${tag}>`
    }
  })()

  const fragment =
    document
      .createRange()
      .createContextualFragment(new Function('tags', 'props', `
        const text = tags.text
        const [${Object.keys(props)}] = Object.values(props)
        return \`${template}\`
      `)({ text }, props))

  parseText(textTags, fragment)

  return fragment
}

function parseText(textTags = {}, template) {
  const tags = Object.keys(textTags)

  if (tags.length === 0) return

  template
    .querySelectorAll(tags)
    .forEach(node =>
      node.parentNode
        .replaceChild(document.createTextNode(textTags[node.tagName.toLowerCase()]), node)
    )
}

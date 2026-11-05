import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/planopro')
const context = { window: {} }
vm.runInNewContext(fs.readFileSync(path.join(app, 'data.js'), 'utf8'), context)
const product = context.window.PRODUCT
assert.equal(product.recipes.length, 30)
assert.equal(new Set(product.recipes.map(r => r.id)).size, 30)
assert.equal(Object.keys(product.details).length, 30)
for (const category of product.categories) {
  assert.equal(product.recipes.filter(r => r.category === category.id).length, category.count)
}
function asset(relative) {
  const target = path.resolve(app, relative)
  assert.ok(target.startsWith(app + path.sep), `Asset outside app: ${relative}`)
  assert.ok(fs.statSync(target).isFile(), `Missing asset: ${relative}`)
  return target
}
let ingredientCount = 0
let stepCount = 0
for (const [index, recipe] of product.recipes.entries()) {
  assert.equal(recipe.number, index + 1)
  assert.equal(recipe.pdfPage, 6 + index * 5)
  asset('assets/' + recipe.photo)
  const detail = product.details[recipe.id]
  for (const key of ['yield', 'portions', 'time', 'chill', 'tools', 'point', 'assemblyIntro', 'closing', 'care', 'allergens']) {
    assert.ok(typeof detail[key] === 'string' && detail[key].trim(), `${recipe.id}: missing ${key}`)
    assert.ok(!detail[key].includes('\uFFFD'), `${recipe.id}: invalid text encoding`)
  }
  assert.equal(detail.steps.length, 4)
  assert.equal(detail.assembly.length, 3)
  assert.equal(detail.issues.length, 3)
  assert.equal(detail.pdfPages.length, 5)
  assert.ok(detail.groups.length)
  for (const group of detail.groups) {
    assert.ok(group.name && group.items.length)
    for (const [name, amount] of group.items) {
      assert.ok(name)
      assert.match(amount, /^\d+(?:[.,]\d+)? (g|mL)$/)
      ingredientCount++
    }
  }
  stepCount += detail.steps.length
  asset('assets/' + detail.diagram)
}
assert.equal(ingredientCount, 252)
assert.equal(stepCount, 120)
assert.equal(product.materials[0].url, product.book.url)
const pdf = fs.readFileSync(asset(product.book.url))
assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
assert.equal(createHash('sha256').update(pdf).digest('hex'), product.book.sha256)
console.log(`PASS: 30 complete recipes, ${ingredientCount} ingredient rows, ${stepCount} preparation steps, 30 diagrams and original PDF.`)

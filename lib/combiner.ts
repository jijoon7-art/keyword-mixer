// lib/combiner.ts — Core keyword combination logic

export interface GroupData {
  id: string
  label: string
  keywords: string[]
}

export interface CombineOptions {
  separator: string
  deduplicate: boolean
  lowercase: boolean
  trim: boolean
  maxPerGroup?: number
}

/** Parse textarea value into an array of non-empty strings */
export function parseKeywords(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((k) => k.trim())
    .filter((k) => k.length > 0)
}

/** Generate all selected permutations from groups */
export function combineKeywords(
  groups: GroupData[],
  selectedPatterns: string[][],   // e.g. [["0","1"], ["0","1","2"]]
  options: CombineOptions
): string[] {
  const results = new Set<string>()

  for (const pattern of selectedPatterns) {
    const groupArrays = pattern.map((idx) => {
      const g = groups[parseInt(idx)]
      if (!g) return []
      let kws = [...g.keywords]
      if (options.lowercase) kws = kws.map((k) => k.toLowerCase())
      if (options.trim) kws = kws.map((k) => k.trim())
      return kws
    })

    // Cartesian product of the selected groups
    const cartesian = cartesianProduct(groupArrays)
    for (const combo of cartesian) {
      const joined = combo.join(options.separator)
      if (options.deduplicate) {
        results.add(joined)
      } else {
        results.add(joined + '___' + results.size)
      }
    }
  }

  let arr = Array.from(results)
  if (!options.deduplicate) {
    arr = arr.map((r) => r.replace(/___\d+$/, ''))
  }
  return arr
}

function cartesianProduct(arrays: string[][]): string[][] {
  if (arrays.length === 0) return []
  return arrays.reduce<string[][]>(
    (acc, arr) => {
      const result: string[][] = []
      for (const a of acc) {
        for (const b of arr) {
          result.push([...a, b])
        }
      }
      return result
    },
    [[]]
  )
}

/** Generate all permutation patterns for n groups */
export function generatePatterns(n: number): { label: string; pattern: number[] }[] {
  const result: { label: string; pattern: number[] }[] = []

  // Single groups
  for (let i = 0; i < n; i++) {
    result.push({ label: `${i + 1}`, pattern: [i] })
  }

  // 2-combos
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) result.push({ label: `${i + 1}+${j + 1}`, pattern: [i, j] })
    }
  }

  // 3-combos (only if ≥3 groups)
  if (n >= 3) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          if (i !== j && j !== k && i !== k)
            result.push({ label: `${i + 1}+${j + 1}+${k + 1}`, pattern: [i, j, k] })
        }
      }
    }
  }

  // 4-combos (only if ≥4 groups)
  if (n >= 4) {
    const indices = Array.from({ length: n }, (_, i) => i)
    const perms = permutations(indices, 4)
    for (const p of perms) {
      result.push({ label: p.map((x) => x + 1).join('+'), pattern: p })
    }
  }

  return result
}

function permutations(arr: number[], r: number): number[][] {
  if (r === 1) return arr.map((x) => [x])
  const result: number[][] = []
  for (let i = 0; i < arr.length; i++) {
    const rest = arr.filter((_, j) => j !== i)
    for (const p of permutations(rest, r - 1)) {
      result.push([arr[i], ...p])
    }
  }
  return result
}

/** Export to CSV string */
export function toCSV(keywords: string[]): string {
  const header = 'Keyword\n'
  const rows = keywords.map((k) => `"${k.replace(/"/g, '""')}"`).join('\n')
  return header + rows
}

/** Export to plain text */
export function toTXT(keywords: string[]): string {
  return keywords.join('\n')
}

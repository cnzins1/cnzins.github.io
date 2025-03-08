/**
 * Utility functions for handling math notation
 */

// Convert plain text fractions to properly formatted HTML
export function formatFractions(text: string): string {
  // Replace patterns like "1/2" with properly formatted fractions
  return text.replace(/(\d+)\/(\d+)/g, (match, numerator, denominator) => {
    return `<span class="fraction"><span class="numerator">${numerator}</span><span class="denominator">${denominator}</span></span>`
  })
}

// Convert plain text superscripts to HTML superscripts
export function formatSuperscripts(text: string): string {
  // Replace patterns like "x^2" with proper superscripts
  return text.replace(/(\w+)\^(\d+)/g, (match, base, exponent) => {
    return `${base}<sup>${exponent}</sup>`
  })
}

// Process text to properly format all math notation
export function formatMathNotation(text: string): string {
  let formattedText = text
  formattedText = formatFractions(formattedText)
  formattedText = formatSuperscripts(formattedText)
  return formattedText
}


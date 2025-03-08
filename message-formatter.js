// Message formatting utilities
function formatMessage(text) {
  if (!text) return ""

  let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  formattedText = formattedText.replace(/\\$$|\\$$/g, "")
  formattedText = formattedText.replace(/\\\[|\\\]/g, "")
  formattedText = formattedText.replace(
    /\*\*Answer:\*\*([\s\S]*?)(?=\n\n|$)/g,
    '<div class="answer-section"><strong class="text-blue-300">Answer:</strong>$1</div>',
  )
  formattedText = formattedText.replace(/(\w+)\^2(?!\d)/g, "$1²")
  formattedText = formattedText.replace(/(\w+)\^3(?!\d)/g, "$1³")
  formattedText = formattedText.replace(/(\w+)\^4(?!\d)/g, "$1⁴")
  formattedText = formattedText.replace(/(\w+)\^5(?!\d)/g, "$1⁵")
  formattedText = formattedText.replace(/(\w+)\^6(?!\d)/g, "$1⁶")
  formattedText = formattedText.replace(/(\w+)\^7(?!\d)/g, "$1⁷")
  formattedText = formattedText.replace(/(\w+)\^8(?!\d)/g, "$1⁸")
  formattedText = formattedText.replace(/(\w+)\^9(?!\d)/g, "$1⁹")
  formattedText = formattedText.replace(/(\w+)\^0(?!\d)/g, "$1⁰")
  formattedText = formattedText.replace(/(\w+)\^(\w+)/g, "$1<sup>$2</sup>")
  formattedText = formattedText.replace(/(\w+)_(\w+)/g, "$1<sub>$2</sub>")
  formattedText = formattedText.replace(/^• (.+)$/gm, '<li class="ml-3 list-disc">$1</li>')
  formattedText = formattedText.replace(/^- (.+)$/gm, '<li class="ml-3 list-disc">$1</li>')
  formattedText = formattedText.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-3 list-decimal">$2</li>')
  formattedText = formattedText.replace(
    /(<li class="ml-3 list-disc">.*?<\/li>)(\s*<li class="ml-3 list-disc">)/g,
    '<ul class="my-1">$1$2',
  )
  formattedText = formattedText.replace(
    /(<li class="ml-3 list-decimal">.*?<\/li>)(\s*<li class="ml-3 list-decimal">)/g,
    '<ol class="my-1">$1$2',
  )
  formattedText = formattedText.replace(/(<li class="ml-3 list-disc">.*?<\/li>)(?!\s*<li)/g, "$1</ul>")
  formattedText = formattedText.replace(/(<li class="ml-3 list-decimal">.*?<\/li>)(?!\s*<li)/g, "$1</ol>")
  formattedText = formattedText.replace(/^(.*?):$/gm, '<h3 class="font-bold text-lg mt-1 mb-0.5">$1</h3>')
  formattedText = formattedText.replace(/\n/g, "<br>")
  formattedText = formattedText.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre class="bg-gray-800 text-gray-100 p-2 rounded my-2 overflow-x-auto">${code}</pre>`
  })

  return formattedText
}

function extractAnswer(text) {
  if (!text) return null
  const answerRegex = /\*\*Answer:\*\*\n(.*?)(?=\n\n|\n<br>|$)/s
  const match = text.match(answerRegex)
  return match ? match[1].trim() : null
}


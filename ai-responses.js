// AI response generation
function generateAIResponse(msg) {
  // This function generates an AI response based on the user's message
  // In a real implementation, this would be replaced with an actual AI API call

  msg = msg.toLowerCase()

  // Math related questions
  if (
    msg.includes("solve") ||
    msg.includes("calculate") ||
    msg.includes("equation") ||
    msg.includes("math") ||
    /[0-9+\-*/^=]/.test(msg)
  ) {
    // Check for basic arithmetic
    if (
      msg.includes("+") ||
      msg.includes("-") ||
      msg.includes("*") ||
      msg.includes("/") ||
      msg.includes("plus") ||
      msg.includes("minus") ||
      msg.includes("times") ||
      msg.includes("divided")
    ) {
      let answer = ""

      // Extract numbers and operations
      if (msg.includes("what is") || msg.includes("calculate")) {
        const numMatch = msg.match(/(\d+)\s*([+\-*/])\s*(\d+)/)
        if (numMatch) {
          const num1 = Number.parseInt(numMatch[1])
          const op = numMatch[2]
          const num2 = Number.parseInt(numMatch[3])

          switch (op) {
            case "+":
              answer = num1 + num2
              break
            case "-":
              answer = num1 - num2
              break
            case "*":
              answer = num1 * num2
              break
            case "/":
              answer = num1 / num2
              break
          }

          return `**Answer:**\n${answer}\n\nTo solve this problem, I performed the arithmetic operation:\n${num1} ${op} ${num2} = ${answer}`
        }
      }

      // Handle specific patterns like "5 x 5"
      if (/^\d+\s*[x×]\s*\d+$/.test(msg)) {
        const nums = msg.split(/[x×]/)
        const num1 = Number.parseInt(nums[0].trim())
        const num2 = Number.parseInt(nums[1].trim())
        answer = num1 * num2

        return `**Answer:**\n${answer}\n\nTo solve this multiplication problem:\n${num1} × ${num2} = ${answer}`
      }

      return `**Answer:**\n25\n\nTo solve this problem, I need to perform the arithmetic operation indicated. For multiplication, I multiply the numbers together.`
    }

    // Algebra problems
    if (msg.includes("x") || msg.includes("solve for") || msg.includes("equation")) {
      return `**Answer:**\nx = 5\n\nTo solve this equation, I need to isolate the variable:\n1. First, I combine like terms\n2. Then I divide both sides by the coefficient of x\n3. Finally, I get x = 5`
    }

    // Geometry problems
    if (
      msg.includes("area") ||
      msg.includes("perimeter") ||
      msg.includes("volume") ||
      msg.includes("triangle") ||
      msg.includes("circle")
    ) {
      return `**Answer:**\nThe area of the triangle is 24 square units\n\nTo find the area of a triangle, I use the formula:\nArea = (1/2) × base × height\nSubstituting the values:\nArea = (1/2) × 8 × 6 = 24 square units`
    }

    // Default math response
    return `**Answer:**\nThe solution is x = 5\n\nTo solve this equation, I need to isolate the variable:\n1. First, I combine like terms\n2. Then I divide both sides by the coefficient of x\n3. Finally, I get x = 5`
  }

  // Science related questions
  if (
    msg.includes("science") ||
    msg.includes("biology") ||
    msg.includes("chemistry") ||
    msg.includes("physics") ||
    msg.includes("element") ||
    msg.includes("molecule")
  ) {
    return `**Answer:**\nThe process of photosynthesis converts light energy into chemical energy\n\nDuring photosynthesis:\n1. Plants absorb sunlight using chlorophyll\n2. They take in carbon dioxide from the air\n3. They use water from the soil\n4. They produce glucose (sugar) and oxygen\n\nThe chemical equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂`
  }

  // English/Literature related questions
  if (
    msg.includes("english") ||
    msg.includes("literature") ||
    msg.includes("book") ||
    msg.includes("novel") ||
    msg.includes("poem") ||
    msg.includes("theme") ||
    msg.includes("character") ||
    msg.includes("author")
  ) {
    return `**Answer:**\nThe main theme is the conflict between tradition and progress\n\nThe author explores this theme through several characters who represent different perspectives on change and tradition in society. This theme is developed through:\n\n1. Character interactions that highlight generational differences\n2. Settings that contrast old and new environments\n3. Symbolic objects that represent both tradition and innovation`
  }

  // History related questions
  if (
    msg.includes("history") ||
    msg.includes("war") ||
    msg.includes("president") ||
    msg.includes("century") ||
    msg.includes("ancient") ||
    msg.includes("revolution")
  ) {
    return `**Answer:**\nThe Industrial Revolution began in Britain in the late 18th century\n\nKey factors that contributed to the Industrial Revolution include:\n1. Technological innovations like the steam engine\n2. Access to natural resources, especially coal\n3. Growing population and labor force\n4. Colonial markets for manufactured goods\n5. Financial innovations and capital investment`
  }

  // Default response for other questions
  return `**Answer:**\nBased on the information provided, I can help with your question about ${msg.substring(0, 30)}...\n\nTo properly address your question, I need to:\n1. Understand the specific topic you're asking about\n2. Apply relevant principles and formulas\n3. Provide a clear, step-by-step explanation\n\nCould you provide more details or clarify your question?`
}


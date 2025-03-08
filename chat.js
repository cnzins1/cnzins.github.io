// Chat functionality
function initChat() {
  const chatContainer = document.getElementById("c")
  const chatWindow = document.getElementById("w")
  const messagesContainer = document.getElementById("m")
  const inputField = document.getElementById("i")
  const sendButton = document.getElementById("s")
  const closeButton = document.getElementById("x")
  const fullsizeButton = document.getElementById("f")
  const resizeHandle = document.getElementById("r")

  let isChatOpen = true
  let isLoading = false
  let isFullSize = false
  let chatMessages = []
  let isResizing = false
  let initialPos = null
  let initialSize = null

  // Declare missing variables
  const lucide = window.lucide // Assuming lucide is available globally
  const generateAIResponse = (msg) => {
    // Replace with your actual AI response generation logic
    return `AI Response to: ${msg}`
  }
  const extractAnswer = (content) => {
    // Replace with your actual answer extraction logic
    const match = content.match(/\*\*(.*?)\*\*/)
    return match ? match[1] : null
  }
  const formatMessage = (content) => {
    // Replace with your actual message formatting logic
    return content.replace(/\n/g, "<br>")
  }

  // Show chat on load
  updateChatVisibility()

  // Event listeners
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      isChatOpen = !isChatOpen
      updateChatVisibility()
    }
  })

  closeButton.addEventListener("click", () => {
    isChatOpen = false
    updateChatVisibility()
  })

  fullsizeButton.addEventListener("click", toggleFullSize)
  sendButton.addEventListener("click", sendMessage)

  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  })

  inputField.addEventListener("input", autoResizeTextarea)
  resizeHandle.addEventListener("mousedown", startResize)

  // Functions
  function startResize(e) {
    e.preventDefault()
    isResizing = true
    initialPos = { x: e.clientX, y: e.clientY }
    initialSize = {
      width: chatWindow.offsetWidth,
      height: chatWindow.offsetHeight,
    }
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  function handleMouseMove(e) {
    if (!isResizing || !initialPos || !initialSize) return
    const width = initialSize.width - (e.clientX - initialPos.x)
    const height = initialSize.height + (e.clientY - initialPos.y)
    if (width > 300 && height > 200) {
      chatWindow.style.width = `${width}px`
      messagesContainer.style.height = `${height - 120}px`
    }
  }

  function handleMouseUp() {
    isResizing = false
    initialPos = null
    initialSize = null
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  function updateChatVisibility() {
    if (isChatOpen) {
      chatContainer.classList.remove("hidden")
    } else {
      chatContainer.classList.add("hidden")
    }
  }

  function toggleFullSize() {
    isFullSize = !isFullSize
    if (isFullSize) {
      chatWindow.classList.add("fullsize")
      fullsizeButton.innerHTML = '<i data-lucide="minimize-2" class="h-4 w-4"></i>'
      fullsizeButton.setAttribute("aria-label", "Minimize")
      lucide.createIcons()
    } else {
      chatWindow.classList.remove("fullsize")
      fullsizeButton.innerHTML = '<i data-lucide="maximize-2" class="h-4 w-4"></i>'
      fullsizeButton.setAttribute("aria-label", "Maximize")
      lucide.createIcons()
    }
  }

  function autoResizeTextarea() {
    inputField.style.height = "auto"
    inputField.style.height = `${inputField.scrollHeight}px`
  }

  function sendMessage() {
    const message = inputField.value.trim()
    if (message === "" || isLoading) return

    const messageId = Date.now().toString()
    addMessage("user", message, messageId)
    inputField.value = ""
    inputField.style.height = "auto"
    isLoading = true
    sendButton.disabled = true
    showLoadingIndicator()

    // Process the message and generate a response
    processUserMessage(message, messageId)
  }

  function processUserMessage(msg, id) {
    // This function processes the user's message and generates a response
    // In a real implementation, this would call an API

    setTimeout(() => {
      const response = generateAIResponse(msg)
      removeLoadingIndicator()
      addMessage("bot", response, `bot-${id}`)
      isLoading = false
      sendButton.disabled = false
    }, 1000)
  }

  function addMessage(type, content, id) {
    const messageDiv = document.createElement("div")
    messageDiv.className = type === "user" ? "user-message" : "bot-message"
    messageDiv.dataset.id = id

    const bubble = document.createElement("div")
    bubble.className = `message-bubble ${type === "user" ? "user-bubble" : "bot-bubble"}`

    if (type === "bot" && extractAnswer(content)) {
      const copyButton = document.createElement("button")
      copyButton.className = "copy-button"
      copyButton.innerHTML = '<i data-lucide="copy" class="h-4 w-4"></i>'
      copyButton.setAttribute("aria-label", "Copy answer")
      copyButton.setAttribute("title", "Copy answer")
      copyButton.addEventListener("click", () => copyAnswer(id, content))
      bubble.appendChild(copyButton)
    }

    const formattedContent = formatMessage(content)
    const contentDiv = document.createElement("div")
    contentDiv.className = "formatted-text"
    contentDiv.innerHTML = formattedContent
    bubble.appendChild(contentDiv)
    messageDiv.appendChild(bubble)
    messagesContainer.appendChild(messageDiv)

    chatMessages.push({
      type,
      content,
      timestamp: Date.now(),
      id,
    })

    messagesContainer.scrollTop = messagesContainer.scrollHeight

    if (type === "user") {
      setTimeout(() => {
        expireUserMessages()
      }, 1000)
    }

    lucide.createIcons()
  }

  function showLoadingIndicator() {
    const loadingDiv = document.createElement("div")
    loadingDiv.className = "flex justify-start mb-2"
    loadingDiv.id = "loading-indicator"

    const loadingBubble = document.createElement("div")
    loadingBubble.className = "bg-gray-700 text-white p-3 rounded-2xl border border-gray-600 shadow-sm"

    const dots = document.createElement("div")
    dots.className = "loading-dots"

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div")
      dot.className = "dot"
      if (i === 1) dot.style.animationDelay = "0.2s"
      if (i === 2) dot.style.animationDelay = "0.4s"
      dots.appendChild(dot)
    }

    loadingBubble.appendChild(dots)
    loadingDiv.appendChild(loadingBubble)
    messagesContainer.appendChild(loadingDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  function removeLoadingIndicator() {
    const loadingIndicator = document.getElementById("loading-indicator")
    if (loadingIndicator) {
      loadingIndicator.remove()
    }
  }

  function expireUserMessages() {
    const now = Date.now()
    chatMessages = chatMessages.filter((msg) => {
      const shouldKeep = msg.type === "bot" || now - msg.timestamp < 25000
      if (!shouldKeep) {
        const msgElement = document.querySelector(`[data-id="${msg.id}"]`)
        if (msgElement) msgElement.remove()
      }
      return shouldKeep
    })
  }

  function copyAnswer(messageId, content) {
    const answer = extractAnswer(content)
    if (answer) {
      navigator.clipboard.writeText(answer)
      const msgElement = document.querySelector(`[data-id="${messageId}"]`)
      if (msgElement) {
        const copyButton = msgElement.querySelector(".copy-button")
        if (copyButton) {
          copyButton.innerHTML = '<i data-lucide="check" class="h-4 w-4 text-green-400"></i>'
          lucide.createIcons()
          setTimeout(() => {
            copyButton.innerHTML = '<i data-lucide="copy" class="h-4 w-4"></i>'
            lucide.createIcons()
          }, 2000)
        }
      }
    }
  }

  // Show a welcome message
  setTimeout(() => {
    addMessage(
      "bot",
      "**Welcome to Clever Reporting!**\n\nI'm your school helper assistant. I can help you with:\n- Math problems and equations\n- Science concepts and explanations\n- English literature and writing\n- History and social studies\n\nJust ask me a question to get started!",
      "welcome",
    )
  }, 500)
}

// Initialize chat when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initChat()
})


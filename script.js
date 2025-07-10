// Get chatbot elements
const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSendBtn = document.getElementById('chatbotSendBtn');

// Array to store conversation history
// This includes both user messages and assistant responses
let conversationHistory = [
  {
    role: "system",
    content: `You are WayChat, Waymark’s friendly creative assistant.
    Waymark is a video ad creation platform that helps people turn ideas, products, or messages into high-quality, ready-to-run videos.
    The platform is used by small businesses, agencies, and marketers to create broadcast-   ads with minimal friction.
    Your job is to help users shape raw input — whether it’s a business name, a tagline, a product, a vibe, or a rough idea — into a short-form video concept.
    Your responses may include suggested video structures, voiceover lines, tone and visual direction, music suggestions, and clarifying follow-up questions.
    If the user's input is unclear, ask 1–2 short questions to help sharpen the direction before offering creative suggestions.
    Only respond to questions related to Waymark, its tools, its platform, or the creative process of making short-form video ads.
    If a question is unrelated, politely explain that you're focused on helping users create video ads with Waymark.
    Keep your replies concise, collaborative, and focused on helping users express their message clearly.
    Always align with modern marketing best practices — and stay supportive and friendly.`
  }
];

if (chatbotToggleBtn && chatbotPanel) {
  // Toggle chat open/closed when clicking the button
  chatbotToggleBtn.addEventListener('click', () => {
    chatbotPanel.classList.toggle('open');
  });

  // Close chat when clicking anywhere except the chat panel or button
  document.addEventListener('click', (e) => {
    // If chat is open AND user clicked outside chat area, close it
    if (chatbotPanel.classList.contains('open') && 
        !chatbotPanel.contains(e.target) && 
        !chatbotToggleBtn.contains(e.target)) {
      chatbotPanel.classList.remove('open');
    }
  });
}

// Function to add a message to the chat display
function addMessageToChat(message, isUser = false) {
  // Create a new message element
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.classList.add(isUser ? 'user-message' : 'assistant-message');
  
  // Set the message content - no need for <p> tags for simple text messages
  messageDiv.textContent = message;
  
  // Add the message to the chat display
  chatbotMessages.appendChild(messageDiv);
  
  // Scroll to the bottom to show the latest message
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Function to show typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.classList.add('typing-indicator');
  typingDiv.id = 'typing-indicator';
  
  // Create the typing dots
  typingDiv.innerHTML = `
    <div class="typing-dots">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  
  // Add to chat display
  chatbotMessages.appendChild(typingDiv);
  
  // Scroll to bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Function to hide typing indicator
function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Function to send message to OpenAI API
async function sendMessageToAPI(userMessage) {
  try {
    // Show typing indicator
    showTypingIndicator();
    
    // Add the user's message to conversation history
    conversationHistory.push({
      role: "user",
      content: userMessage
    });
    
    // Make API request to OpenAI
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: conversationHistory, // Send entire conversation history
        max_completion_tokens: 300,
        temperature: 0.8
      })
    });
    
    // Hide typing indicator
    hideTypingIndicator();
    
    // Check if the API request was successful
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    // Get the response data
    const data = await response.json();
    
    // Extract the assistant's message
    const assistantMessage = data.choices[0].message.content;
    
    // Add assistant's response to conversation history
    conversationHistory.push({
      role: "assistant", 
      content: assistantMessage
    });
    
    // Display the assistant's response in the chat
    addMessageToChat(assistantMessage, false);
    
  } catch (error) {
    // Hide typing indicator in case of error
    hideTypingIndicator();
    
    // Handle any errors that occur during the API request
    console.error('Error calling OpenAI API:', error);
    addMessageToChat('Sorry, I encountered an error. Please try again.', false);
  }
}

// Function to handle sending a message
function handleSendMessage() {
  // Get the user's input message
  const userMessage = chatbotInput.value.trim();
  
  // Check if the message is not empty
  if (userMessage) {
    // Display the user's message in the chat
    addMessageToChat(userMessage, true);
    
    // Clear the input field
    chatbotInput.value = '';
    
    // Send the message to the OpenAI API
    sendMessageToAPI(userMessage);
  }
}

// Add event listeners for sending messages
if (chatbotSendBtn && chatbotInput) {
  // Send message when clicking the send button
  chatbotSendBtn.addEventListener('click', handleSendMessage);
  
  // Send message when pressing Enter key in the input field
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });
}

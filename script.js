// Get chatbot elements
const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
const chatbotPanel = document.getElementById('chatbotPanel');

if (chatbotToggleBtn && chatbotPanel) {
  // Simple toggle function
  const toggleChat = () => {
    chatbotPanel.classList.toggle('open');
  };

  // Add click listener to button
  chatbotToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleChat();
  });

  // Prevent panel clicks from closing
  chatbotPanel.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const clickedOutside = !chatbotPanel.contains(e.target) && 
                          !chatbotToggleBtn.contains(e.target);
    if (clickedOutside && chatbotPanel.classList.contains('open')) {
      chatbotPanel.classList.remove('open');
    }
  });
}

// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', () => {
  // Get references to HTML elements
  const sendBtn = document.getElementById('sendBtn');
  const userInput = document.getElementById('userInput');
  const responseDiv = document.getElementById('response');

  // Add a click event listener to the button
  sendBtn.addEventListener('click', async () => {
    // Get the user's input
    const prompt = userInput.value;

    // Show a loading message
    responseDiv.textContent = 'Loading...';

    try {
      // Call the function to get a response from OpenAI
      const answer = await getOpenAIResponse(prompt);
      // Display the response
      responseDiv.textContent = answer;
    } catch (error) {
      // Show an error message if something goes wrong
      responseDiv.textContent = 'Error: ' + error.message;
    }
  });
});

// This function sends the user's prompt to the OpenAI API and returns the response
async function getOpenAIResponse(prompt) {
  // Replace 'YOUR_API_KEY' with your actual OpenAI API key
  const apiKey = 'YOUR_API_KEY';

  // The API endpoint for OpenAI's GPT-4o model
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  // Prepare the request data
  const data = {
    model: 'gpt-4o', // Use the GPT-4o model
    messages: [
      { role: 'user', content: prompt }
    ]
  };

  // Make the API request using fetch and async/await
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(data)
  });

  // Parse the JSON response
  const result = await response.json();

  // Return the assistant's reply
  // Check if the response contains a valid message
  if (
    result.choices &&
    result.choices[0] &&
    result.choices[0].message &&
    result.choices[0].message.content
  ) {
    return result.choices[0].message.content;
  } else {
    throw new Error('No response from OpenAI.');
  }
}

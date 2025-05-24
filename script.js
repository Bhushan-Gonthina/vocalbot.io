const apiKey = 'AIzaSyAde2sOVS-HAVMWfEZN4neG5PiMxKeLzyE'; 
const chatLog = document.getElementById('chat-log');
const startBtn = document.getElementById('start-btn');

let recognition;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert('Speech recognition not supported in this browser.');
}

recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

startBtn.addEventListener('click', () => {
    recognition.start();
    startBtn.textContent = 'Listening...';
});

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    appendMessage('You : ' + transcript);
    startBtn.textContent = 'Start Speaking';

    
    try {
        const response = await   fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: transcript }]
                    }]
                })
            }
        );

        const data = await response.json();
        const geminiResponse = data.candidates[0].content.parts[0].text;
        appendMessage('Bujji: ' + geminiResponse);

        
        const utterance = new SpeechSynthesisUtterance(geminiResponse);
        speechSynthesis.speak(utterance);
    } catch (error) {
        console.error('Error communicating with Gemini API:', error);
        appendMessage('Bujji: Sorry, something went wrong. Please try again.');
    }
};

recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    startBtn.textContent = 'Start Speaking';
};

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}
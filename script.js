let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
    if (!window.speechSynthesis) {
        console.error("Speech synthesis not supported in this browser.");
        return;
    }

    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;

    // Try setting a voice explicitly
    let voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(voice => voice.lang === "hi-IN") || voices.find(voice => voice.lang === "en-US");

    if (selectedVoice) {
        text_speak.voice = selectedVoice;
    } else {
        console.warn("Preferred voice not found. Using default voice.");
    }

    // Handle the voices loading asynchronously
    if (!voices.length) {
        window.speechSynthesis.onvoiceschanged = () => {
            let voices = window.speechSynthesis.getVoices();
            let fallbackVoice = voices.find(voice => voice.lang === "en-US") || voices[0];
            text_speak.voice = fallbackVoice;
            window.speechSynthesis.speak(text_speak);
        };
    } else {
        window.speechSynthesis.speak(text_speak);
    }
}


function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Sir");
    } else {
        speak("Good Evening Sir");
    }
}

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
    recognition.start();
    voice.style.display = "block";
    btn.style.display = "none";
});

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBL1VcWixFrps28yJeOM1fKAEwymqmwsgA";

async function generateGeminiResponse(prompt) {
    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [
                { "parts": [{ "text": prompt }] }
            ]
        })
    };

    try {
        let response = await fetch(Api_Url, RequestOption);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        speak(apiResponse);
        content.innerText = apiResponse;
    } catch (error) {
        console.error(error);
        speak("Sorry, I encountered an error while processing your request.");
    } finally {
        voice.style.display = "none";
        btn.style.display = "flex";
    }
}

function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";

    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello Sir, what can I help you with?");
    } else if (message.includes("who are you")) {
        speak("I am a virtual assistant, created by Shivam Sir.");
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    } else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://google.com/", "_blank");
    } else if (message.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://facebook.com/", "_blank");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://instagram.com/", "_blank");
    } else if (message.includes("open calculator")) {
        speak("Opening calculator...");
        window.open("calculator://");
    } else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("whatsapp://");
    } else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(time);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(date);
    } else if (message.includes("open child section")) {
        window.open("http://localhost/elementory/games/");
        speak("opening child section");
    } else if (message.includes("open yoga")) {
        speak("Opening yoga...");
        window.open("https://eager-bardeen-e9f94f.netlify.app/");
    } else if (message.includes("open child section")) {
        speak("Opening chid section...");
        window.open("http://localhost/elementory/games/");
    }else {
        generateGeminiResponse(message);
    }
}
const videoUpload = document.getElementById('videoUpload');
const videoPreview = document.getElementById('videoPreview');
const captionOverlay = document.getElementById('captionOverlay');

// Dummy captions for testing
const captions = [
  { text: "This is the intro", time: 0 },
  { text: "Watch what happens next", time: 2 },
  { text: "Did you catch that?", time: 4 },
  { text: "That was crazy!", time: 6 },
  { text: "", time: 8 } // clear after last
];

let currentCaptionIndex = -1;

// Load uploaded video into player
videoUpload.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const videoURL = URL.createObjectURL(file);
    videoPreview.src = videoURL;
    videoPreview.load();

    // Reset captions
    currentCaptionIndex = -1;
    captionOverlay.textContent = "";
  }
});

// Sync captions with video time
videoPreview.addEventListener('timeupdate', () => {
  const currentTime = videoPreview.currentTime;

  if (
    currentCaptionIndex + 1 < captions.length &&
    currentTime >= captions[currentCaptionIndex + 1].time
  ) {
    currentCaptionIndex++;
    captionOverlay.textContent = captions[currentCaptionIndex].text;
  }
});

// Reset captions when seeking or replaying
videoPreview.addEventListener('seeked', () => {
  const currentTime = videoPreview.currentTime;

  // Find caption closest to current time
  currentCaptionIndex = -1;
  for (let i = 0; i < captions.length; i++) {
    if (captions[i].time <= currentTime) {
      currentCaptionIndex = i;
    } else {
      break;
    }
  }

  // Update overlay text
  captionOverlay.textContent = captions[currentCaptionIndex]?.text || "";
});

// Clear captions when video ends
videoPreview.addEventListener('ended', () => {
  captionOverlay.textContent = "";
  currentCaptionIndex = -1;
});

// Style control elements
const fontSelect = document.getElementById('fontSelect');
const fontSizeInput = document.getElementById('fontSize');
const fontColorInput = document.getElementById('fontColor');

// Apply selected font
fontSelect.addEventListener('change', () => {
  captionOverlay.style.fontFamily = fontSelect.value;
});

// Apply selected font size
fontSizeInput.addEventListener('input', () => {
  captionOverlay.style.fontSize = `${fontSizeInput.value}px`;
});

// Apply selected font color
fontColorInput.addEventListener('input', () => {
  captionOverlay.style.color = fontColorInput.value;
});

// Initialize with defaults
captionOverlay.style.fontFamily = fontSelect.value;
captionOverlay.style.fontSize = `${fontSizeInput.value}px`;
captionOverlay.style.color = fontColorInput.value;


// ELEMENTS
const platformSelect = document.getElementById("platformSelect");
const generatePromo = document.getElementById("generatePromo");
const viralCaptionEl = document.getElementById("viralCaption");
const hashtagListEl = document.getElementById("hashtagList");
const downloadSubtitlesBtn = document.getElementById("downloadSubtitles");
const downloadVideoBtn = document.getElementById("downloadWithCaptions");

// Dummy transcription to simulate real API input
const dummyTranscript = `
Welcome to the future of video editing. This tool lets you generate captions,
style them in real time, and make your videos stand out online.
`;

// Simulated AI caption + hashtag generation
generatePromo.addEventListener("click", () => {
  const platform = platformSelect.value;

  // Simulate AI response (replace with real API call later)
  const viralCaption = {
    tiktok: "This moment deserves a million views 🎯",
    instagram: "Turning ideas into action 💡✨",
    twitter: "You're not ready for this 👀🔥",
    youtube: "The one video you need to see today! 🚀"
  };

  const hashtags = {
    tiktok: "#viral #foryou #tech #capcut #trend #reels",
    instagram: "#instagood #ai #captionmagic #igvideo #explorepage",
    twitter: "#TechThread #AItools #VideoTips #ContentCreators",
    youtube: "#shorts #viralshorts #captionhack #contentcreator #editlikeapro"
  };

  viralCaptionEl.textContent = viralCaption[platform] || "Here’s something great.";
  hashtagListEl.textContent = hashtags[platform] || "#viral #content";
});

// Download captions as .srt
downloadSubtitlesBtn.addEventListener("click", () => {
  let srt = "";
  for (let i = 0; i < captions.length; i++) {
    const start = new Date(captions[i].time * 1000).toISOString().substr(11, 8) + ",000";
    const endTime = captions[i + 1] ? captions[i + 1].time : captions[i].time + 2;
    const end = new Date(endTime * 1000).toISOString().substr(11, 8) + ",000";

    srt += `${i + 1}\n${start} --> ${end}\n${captions[i].text}\n\n`;
  }

  const blob = new Blob([srt], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "captions.srt";
  a.click();
});

// Download video with captions (dummy - to be implemented with backend)
downloadVideoBtn.addEventListener("click", () => {
  alert("This feature will be enabled once the backend is connected.");
});

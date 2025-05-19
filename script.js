const videoUpload = document.getElementById('videoUpload');
const videoPreview = document.getElementById('videoPreview');
const captionOverlay = document.getElementById('captionOverlay');

let captions = [];
let currentCaptionIndex = -1;

// Load uploaded video into player and get real captions from backend
videoUpload.addEventListener('change', async function () {
  const file = this.files[0];
  if (file) {
    const videoURL = URL.createObjectURL(file);
    videoPreview.src = videoURL;
    videoPreview.load();

    // Reset captions UI state
    currentCaptionIndex = -1;
    captionOverlay.textContent = "";
    captions = [];

    // Upload video and get captions from backend
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to get captions');

      const data = await response.json();
      // Expecting: data.captions = [{ text: "caption", time: 0 }, ...]
      captions = data.captions || [];
    } catch (err) {
      console.error('Error fetching captions:', err);
      captions = [];
    }
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

  currentCaptionIndex = -1;
  for (let i = 0; i < captions.length; i++) {
    if (captions[i].time <= currentTime) {
      currentCaptionIndex = i;
    } else {
      break;
    }
  }

  captionOverlay.textContent = captions[currentCaptionIndex]?.text || "";
});

// Clear captions when video ends
videoPreview.addEventListener('ended', () => {
  captionOverlay.textContent = "";
  currentCaptionIndex = -1;
});

// Style controls
const fontSelect = document.getElementById('fontSelect');
const fontSizeInput = document.getElementById('fontSize');
const fontColorInput = document.getElementById('fontColor');

fontSelect.addEventListener('change', () => {
  captionOverlay.style.fontFamily = fontSelect.value;
});
fontSizeInput.addEventListener('input', () => {
  captionOverlay.style.fontSize = `${fontSizeInput.value}px`;
});
fontColorInput.addEventListener('input', () => {
  captionOverlay.style.color = fontColorInput.value;
});

captionOverlay.style.fontFamily = fontSelect.value;
captionOverlay.style.fontSize = `${fontSizeInput.value}px`;
captionOverlay.style.color = fontColorInput.value;

// Promo caption generation elements
const platformSelect = document.getElementById("platformSelect");
const generatePromo = document.getElementById("generatePromo");
const viralCaptionEl = document.getElementById("viralCaption");
const hashtagListEl = document.getElementById("hashtagList");
const downloadSubtitlesBtn = document.getElementById("downloadSubtitles");
const downloadVideoBtn = document.getElementById("downloadWithCaptions");

// Generate viral caption + hashtags via backend API
generatePromo.addEventListener("click", async () => {
  const platform = platformSelect.value;
  const transcript = captions.map(c => c.text).join(' ');

  try {
    const response = await fetch('/api/generate-caption', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, transcript })
    });

    if (!response.ok) throw new Error('Failed to generate captions');

    const result = await response.json();
    viralCaptionEl.textContent = result.caption;
    hashtagListEl.textContent = result.hashtags;
  } catch (err) {
    console.error('Error generating promo captions:', err);
    viralCaptionEl.textContent = "Sorry, couldn't generate caption.";
    hashtagListEl.textContent = "";
  }
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

// Download video with captions (placeholder)
downloadVideoBtn.addEventListener("click", () => {
  alert("This feature will be enabled once the backend is connected.");
});

let mediaRecorder;
let audioChunks = [];

const recordBtn = document.getElementById('recordBtn');
const statusText = document.getElementById('status');
const audioPlayback = document.getElementById('audioPlayback');

recordBtn.addEventListener('click', async () => {
    try {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.onstart = () => {
                audioChunks = [];
                statusText.textContent = 'Recording...';
                recordBtn.textContent = 'Stop Recording';
            };

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayback.src = audioUrl;

                statusText.textContent = 'Recording stopped. Play the audio below.';
                recordBtn.textContent = 'Start Recording';
            };

            mediaRecorder.start();
        } else if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    } catch (error) {
        console.error('Error accessing the microphone:', error);
        statusText.textContent = 'Error: Microphone access denied or not supported.';
        recordBtn.textContent = 'Start Recording';
    }
});

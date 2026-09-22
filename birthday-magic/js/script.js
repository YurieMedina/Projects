function showMessage() {
    document.getElementById('welcome-card').classList.add('hidden');
    document.getElementById('greeting-page').classList.remove('hidden');
}

function showSurprise() {
    document.getElementById('welcome-card').classList.add('hidden');
    document.getElementById('surprise-page').classList.remove('hidden');
}

function showFriends() {
    document.getElementById('welcome-card').classList.add('hidden');
    document.getElementById('friends-page').classList.remove('hidden');
}

function showWelcome() {
    document.getElementById('greeting-page').classList.add('hidden');
    document.getElementById('surprise-page').classList.add('hidden');
    document.getElementById('friends-page').classList.add('hidden');
    document.getElementById('welcome-card').classList.remove('hidden');
}

let audioContext = null;
let musicIsPlaying = false;
let musicLoopTimeout = null;
let musicNoteTimeouts = [];
let realAudio = null;
let currentMusicIndex = 0;
let musicRequestId = 0;
const musicFiles = [
    'music/Blessed.mp3',
    'music/pretty.mp3',
    'music/My Love Mine All Mine.mp3',
    'music/Padaba Taka.mp3',
    'music/dorothea.mp3',
    'music/Ripples.mp3',
    'music/the perfect pair.mp3',
    'music/Put Your Records On.mp3'
];
const musicCovers = [
    'images/Music Player Picture/blessed.jpg',
    'images/Music Player Picture/pretty.jpg',
    'images/Music Player Picture/My Love Mine All Mine.png',
    'images/Music Player Picture/padaba taka.jpg',
    'images/Music Player Picture/dorothea.jpg',
    'images/Music Player Picture/Ripples.png',
    'images/Music Player Picture/The Perfect Pair.png',
    'images/Music Player Picture/Put Your Records On.jpg'
];

function ensureAudioElement() {
    if (!realAudio) {
        realAudio = document.getElementById('birthday-audio') || new Audio();
        realAudio.preload = 'auto';
        realAudio.volume = 0.7;
        realAudio.addEventListener('ended', playNextMusicTrack);
        realAudio.addEventListener('loadedmetadata', updateMusicProgress);
        realAudio.addEventListener('timeupdate', updateMusicProgress);
        realAudio.addEventListener('pause', updateMusicProgress);
        realAudio.addEventListener('error', handleMusicError);
    }

    return realAudio;
}

function handleMusicError() {
    musicIsPlaying = false;
    updateMusicButton();
    console.error('The selected MP3 could not be loaded:', musicFiles[currentMusicIndex]);
}

function updateTrackName() {
    const trackName = document.querySelector('.track-name');
    const musicSelect = document.getElementById('music-select');
    if (!trackName || !musicFiles[currentMusicIndex]) {
        return;
    }

    const fileName = musicFiles[currentMusicIndex].split('/').pop();
    const title = fileName.replace(/\.mp3$/i, '');
    trackName.textContent = title;
    updateMusicCover();
    if (musicSelect) {
        musicSelect.value = String(currentMusicIndex);
    }
}

function updateMusicCover() {
    const musicCover = document.querySelector('.music-cover');
    const coverPath = musicCovers[currentMusicIndex];

    if (!musicCover || !coverPath) {
        return;
    }

    musicCover.src = new URL(coverPath, document.baseURI).href;
    musicCover.alt = `${musicFiles[currentMusicIndex].split('/').pop().replace(/\.mp3$/i, '')} cover`;
}

function populateMusicSelect() {
    const musicSelect = document.getElementById('music-select');
    if (!musicSelect) {
        return;
    }

    musicSelect.innerHTML = '';
    musicFiles.forEach((filePath, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = filePath.split('/').pop().replace(/\.mp3$/i, '');
        musicSelect.appendChild(option);
    });
}

function playNextMusicTrack() {
    if (!musicIsPlaying || !realAudio) {
        return;
    }

    currentMusicIndex = (currentMusicIndex + 1) % musicFiles.length;
    playCurrentMusicTrack();
}

function playPreviousMusicTrack() {
    const wasPlaying = musicIsPlaying;
    stopBirthdayMusic();
    currentMusicIndex = (currentMusicIndex - 1 + musicFiles.length) % musicFiles.length;
    updateTrackName();

    if (wasPlaying) {
        playCurrentMusicTrack();
    }
}

function loadCurrentMusicTrack() {
    const audio = ensureAudioElement();
    const filePath = musicFiles[currentMusicIndex];

    audio.pause();
    audio.src = new URL(filePath, document.baseURI).href;
    audio.load();
    updateTrackName();
    return audio;
}

function playCurrentMusicTrack() {
    const audio = loadCurrentMusicTrack();
    const filePath = musicFiles[currentMusicIndex];
    const requestId = ++musicRequestId;

    musicIsPlaying = true;
    updateMusicButton();
    audio.play().catch(() => {
        if (requestId !== musicRequestId) {
            return;
        }

        musicIsPlaying = false;
        updateMusicButton();
        console.error(`Unable to play ${filePath}`);
    });
}

function formatMusicTime(timeInSeconds) {
    if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
        return '0:00';
    }

    const totalSeconds = Math.floor(timeInSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function updateMusicProgress() {
    const currentTimeElement = document.getElementById('music-current-time');
    const durationElement = document.getElementById('music-duration');
    const seekbar = document.getElementById('music-seekbar');

    if (!currentTimeElement || !durationElement || !realAudio) {
        return;
    }

    currentTimeElement.textContent = formatMusicTime(realAudio.currentTime);
    durationElement.textContent = formatMusicTime(realAudio.duration);

    if (seekbar) {
        seekbar.max = String(Number.isFinite(realAudio.duration) ? realAudio.duration : 0);
        seekbar.value = String(realAudio.currentTime || 0);
    }
}

function seekMusic(event) {
    if (!realAudio || !Number.isFinite(realAudio.duration) || realAudio.duration <= 0) {
        return;
    }

    if (event.type === 'click') {
        const bounds = event.currentTarget.getBoundingClientRect();
        const clickPosition = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width);
        realAudio.currentTime = (clickPosition / bounds.width) * realAudio.duration;
    } else {
        realAudio.currentTime = Number(event.currentTarget.value);
    }
    updateMusicProgress();
}

function seekMusicWithKeyboard(event) {
    if (!realAudio || !Number.isFinite(realAudio.duration)) {
        return;
    }

    const step = 5;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
    }

    if (event.key === 'ArrowLeft') {
        realAudio.currentTime = Math.max(0, realAudio.currentTime - step);
    } else if (event.key === 'ArrowRight') {
        realAudio.currentTime = Math.min(realAudio.duration, realAudio.currentTime + step);
    } else if (event.key === 'Home') {
        realAudio.currentTime = 0;
    } else if (event.key === 'End') {
        realAudio.currentTime = realAudio.duration;
    } else {
        return;
    }

    updateMusicProgress();
}

function playNote(freq, durationMs) {
    const context = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    audioContext = context;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = freq;

    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + durationMs / 1000);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + durationMs / 1000);
}

function updateMusicButton() {
    const toggleButton = document.getElementById('music-toggle');
    const vinylPlayer = document.getElementById('vinyl-player');

    if (!toggleButton) {
        return;
    }

    if (musicIsPlaying) {
        toggleButton.querySelector('.toggle-label').textContent = '❚❚';
        toggleButton.setAttribute('aria-label', 'Pause birthday music');
        if (vinylPlayer) {
            vinylPlayer.classList.add('playing');
        }
    } else {
        toggleButton.querySelector('.toggle-label').textContent = '▶';
        toggleButton.setAttribute('aria-label', 'Play birthday music');
        if (vinylPlayer) {
            vinylPlayer.classList.remove('playing');
        }
    }
}

function stopBirthdayMusic() {
    musicIsPlaying = false;
    musicRequestId += 1;
    if (musicLoopTimeout) {
        clearTimeout(musicLoopTimeout);
        musicLoopTimeout = null;
    }
    musicNoteTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    musicNoteTimeouts = [];

    if (realAudio) {
        realAudio.pause();
        realAudio.currentTime = 0;
        updateMusicProgress();
    }

    if (audioContext && audioContext.state === 'running') {
        audioContext.suspend();
    }

    updateMusicButton();
}

function startSynthBirthdayMusic() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    musicIsPlaying = true;
    const melody = [392, 392, 440, 392, 523.25, 493.88, 392, 392, 440, 392, 587.33, 523.25];
    const noteGap = 240;
    let delay = 0;

    const playLoop = () => {
        musicNoteTimeouts = [];

        melody.forEach((freq) => {
            const timeoutId = setTimeout(() => playNote(freq, 220), delay);
            musicNoteTimeouts.push(timeoutId);
            delay += noteGap;
        });

        musicLoopTimeout = setTimeout(() => {
            if (musicIsPlaying) {
                delay = 0;
                playLoop();
            }
        }, melody.length * noteGap + 180);
    };

    playLoop();
    updateMusicButton();
}

function startBirthdayMusic() {
    if (musicIsPlaying) {
        stopBirthdayMusic();
        return;
    }

    if (musicFiles.length > 0 && musicFiles[currentMusicIndex]) {
        playCurrentMusicTrack();
        return;
    }

    startSynthBirthdayMusic();
}

const surpriseImages = [
    'images/tiny-surprise/Her%20alone.jpg',
    'images/tiny-surprise/Her%20smiling.jpg',
    'images/tiny-surprise/her%20with%20food.jpg',
    'images/tiny-surprise/Picture%20together.jpg'
];

let surpriseIndex = 0;
let friendLightboxImages = [];
let friendLightboxIndex = 0;

function updateFriendLightbox() {
    const imageElement = document.getElementById('friend-lightbox-image');
    const personElement = document.getElementById('friend-lightbox-person');
    const counterElement = document.getElementById('friend-lightbox-counter');
    const image = friendLightboxImages[friendLightboxIndex];

    if (!imageElement || !personElement || !counterElement || !image) {
        return;
    }

    imageElement.src = image.src;
    imageElement.alt = image.alt;
    personElement.textContent = image.closest('.friend-gallery-section').querySelector('h3').textContent;
    counterElement.textContent = `${friendLightboxIndex + 1} / ${friendLightboxImages.length}`;
}

function openFriendLightbox(image) {
    friendLightboxImages = Array.from(document.querySelectorAll('.friend-gallery-grid img'));
    friendLightboxIndex = friendLightboxImages.indexOf(image);
    updateFriendLightbox();
    document.getElementById('friend-lightbox').classList.remove('hidden');
}

function closeFriendLightbox() {
    document.getElementById('friend-lightbox').classList.add('hidden');
}

function nextFriendLightboxImage() {
    friendLightboxIndex = (friendLightboxIndex + 1) % friendLightboxImages.length;
    updateFriendLightbox();
}

function previousFriendLightboxImage() {
    friendLightboxIndex = (friendLightboxIndex - 1 + friendLightboxImages.length) % friendLightboxImages.length;
    updateFriendLightbox();
}

function updateSurpriseImage() {
    const imageElement = document.getElementById('surprise-image');
    imageElement.src = surpriseImages[surpriseIndex];
    imageElement.alt = `Tiny surprise ${surpriseIndex + 1}`;
    document.getElementById('slide-counter').textContent = `${surpriseIndex + 1} / ${surpriseImages.length}`;
}

function nextSurprise() {
    surpriseIndex = (surpriseIndex + 1) % surpriseImages.length;
    updateSurpriseImage();
}

function previousSurprise() {
    surpriseIndex = (surpriseIndex - 1 + surpriseImages.length) % surpriseImages.length;
    updateSurpriseImage();
}

function initializeMidnightLock() {
    const lockElement = document.getElementById('midnight-lock');

    if (lockElement) {
        lockElement.classList.add('hidden');
    }

    return;
}

document.addEventListener('DOMContentLoaded', () => {
    initializeMidnightLock();
    document.getElementById('surprise-image').addEventListener('error', () => {
        document.getElementById('surprise-image').classList.add('hidden');
        document.getElementById('surprise-empty').classList.remove('hidden');
    });

    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        musicToggle.addEventListener('click', startBirthdayMusic);
    }
    populateMusicSelect();
    loadCurrentMusicTrack();
    updateTrackName();

    document.querySelectorAll('.friend-gallery-grid img').forEach(image => {
        image.addEventListener('click', () => openFriendLightbox(image));
    });
    document.getElementById('friend-lightbox-close').addEventListener('click', closeFriendLightbox);
    document.getElementById('friend-lightbox-previous').addEventListener('click', previousFriendLightboxImage);
    document.getElementById('friend-lightbox-next').addEventListener('click', nextFriendLightboxImage);
    document.getElementById('friend-lightbox').addEventListener('click', event => {
        if (event.target.id === 'friend-lightbox') {
            closeFriendLightbox();
        }
    });
    document.addEventListener('keydown', event => {
        if (document.getElementById('friend-lightbox').classList.contains('hidden')) {
            return;
        }
        if (event.key === 'Escape') {
            closeFriendLightbox();
        } else if (event.key === 'ArrowLeft') {
            previousFriendLightboxImage();
        } else if (event.key === 'ArrowRight') {
            nextFriendLightboxImage();
        }
    });

    const musicSeekbar = document.getElementById('music-seekbar');
    if (musicSeekbar) {
        musicSeekbar.addEventListener('click', seekMusic);
        musicSeekbar.addEventListener('input', seekMusic);
        musicSeekbar.addEventListener('keydown', seekMusicWithKeyboard);
    }

    const musicSelect = document.getElementById('music-select');
    if (musicSelect) {
        musicSelect.addEventListener('change', () => {
            const wasPlaying = musicIsPlaying;
            stopBirthdayMusic();
            currentMusicIndex = Number(musicSelect.value);
            loadCurrentMusicTrack();
            updateTrackName();
            if (wasPlaying) {
                playCurrentMusicTrack();
            }
        });
    }

    const musicPrevious = document.getElementById('music-previous');
    if (musicPrevious) {
        musicPrevious.addEventListener('click', playPreviousMusicTrack);
    }

    const musicNext = document.getElementById('music-next');
    if (musicNext) {
        musicNext.addEventListener('click', () => {
            const wasPlaying = musicIsPlaying;
            stopBirthdayMusic();
            currentMusicIndex = (currentMusicIndex + 1) % musicFiles.length;
            updateTrackName();

            if (wasPlaying) {
                playCurrentMusicTrack();
            }
        });
    }

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('hover');
        });
        button.addEventListener('mouseleave', () => {
            button.classList.remove('hover');
        });
    });
});
export default {
    generateRandomString() {
        return window.crypto.getRandomValues(new Uint32Array(1));
    },

    closeVideo(elemId) {
        const elem = document.getElementById(elemId);
        if (elem) {
            elem.remove();
            this.adjustVideoElemSize();
        }
    },

    pageHasFocus() {
        return !(document.hidden || document.onfocusout || window.onpagehide || window.onblur);
    },

    getQString(url = '', keyToReturn = '') {
        url = url || location.href;
        const queryStrings = decodeURIComponent(url).split('#', 2)[0].split('?', 2)[1];

        if (queryStrings) {
            const queryStringObj = queryStrings.split('&').reduce((obj, pair) => {
                const [key, value] = pair.split('=', 2);
                if (key) obj[key] = value;
                return obj;
            }, {});

            return keyToReturn ? queryStringObj[keyToReturn] : queryStringObj;
        }

        return null;
    },

    userMediaAvailable() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    },

    async getUserFullMedia() {
        if (this.userMediaAvailable()) {
            return await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: { echoCancellation: true, noiseSuppression: true }
            });
        } else {
            throw new Error('User media not available');
        }
    },

    async getUserAudio() {
        if (this.userMediaAvailable()) {
            return await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true }
            });
        } else {
            throw new Error('User media not available');
        }
    },

    async shareScreen() {
        if (this.userMediaAvailable()) {
            return await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 }
            });
        } else {
            throw new Error('User media not available');
        }
    },

    getIceServer() {
        return {
            iceServers: [
                { urls: ["stun:eu-turn4.xirsys.com"] },
                {
                    username: "ml0jh0qMKZKd9P_9C0UIBY2G0nSQMCFBUXGlk6IXDJf8G2uiCymg9WwbEJTMwVeiAAAAAF2__hNSaW5vbGVl",
                    credential: "4dd454a6-feee-11e9-b185-6adcafebbb45",
                    urls: ["turn:eu-turn4.xirsys.com:80?transport=udp", "turn:eu-turn4.xirsys.com:3478?transport=tcp"]
                }
            ]
        };
    },

    addChat(data, senderType) {
        const chatMsgDiv = document.querySelector('#chat-messages');
        const contentAlign = senderType === 'remote' ? 'justify-content-start' : 'justify-content-end';
        const senderName = senderType === 'remote' ? data.sender : 'You';
        const msgBg = senderType === 'remote' ? '' : 'bg-white';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'sender-info';
        infoDiv.innerText = `${senderName} - ${moment().format('Do MMMM, YYYY h:mm a')}`;

        const colDiv = document.createElement('div');
        colDiv.className = `col-10 card chat-card msg ${msgBg}`;
        colDiv.innerHTML = xssFilters.inHTMLData(data.msg).autoLink({ target: "_blank", rel: "nofollow" });

        const rowDiv = document.createElement('div');
        rowDiv.className = `row ${contentAlign} mb-2`;

        colDiv.appendChild(infoDiv);
        rowDiv.appendChild(colDiv);
        chatMsgDiv.appendChild(rowDiv);

        if (this.pageHasFocus()) {
            rowDiv.scrollIntoView();
        }
    },

    toggleChatNotificationBadge() {
        const chatPane = document.querySelector('#chat-pane');
        const badge = document.querySelector('#new-chat-notification');
        if (chatPane.classList.contains('chat-opened')) {
            badge.setAttribute('hidden', true);
        } else {
            badge.removeAttribute('hidden');
        }
    },

    replaceTrack(stream, recipientPeer) {
        const sender = recipientPeer.getSenders().find(s => s.track && s.track.kind === stream.kind);
        if (sender) sender.replaceTrack(stream);
    },

    toggleShareIcons(share) {
        const shareIconElem = document.querySelector('#share-screen');
        shareIconElem.setAttribute('title', share ? 'Stop sharing screen' : 'Share screen');
        shareIconElem.children[0].classList.toggle('text-primary', share);
        shareIconElem.children[0].classList.toggle('text-white', !share);
    },

    toggleVideoBtnDisabled(disabled) {
        document.getElementById('toggle-video').disabled = disabled;
    },

    maximiseStream(e) {
        const elem = e.target.parentElement.previousElementSibling;
        elem.requestFullscreen?.() || elem.mozRequestFullScreen?.() || elem.webkitRequestFullscreen?.() || elem.msRequestFullscreen?.();
    },

    singleStreamToggleMute(e) {
        const videoElem = e.target.parentElement.previousElementSibling;
        videoElem.muted = !videoElem.muted;
        e.target.classList.toggle('fa-microphone', !videoElem.muted);
        e.target.classList.toggle('fa-microphone-slash', videoElem.muted);
    },

    saveRecordedStream(stream, user) {
        const blob = new Blob(stream, { type: 'video/webm' });
        const file = new File([blob], `${user}-${moment().unix()}-record.webm`);
        saveAs(file);
    },

    toggleModal(id, show) {
        const el = document.getElementById(id);
        el.style.display = show ? 'block' : 'none';
        el.setAttribute('aria-hidden', !show);
    },

    setLocalStream(stream, mirrorMode = true) {
        const localVidElem = document.getElementById('local');
        localVidElem.srcObject = stream;
        localVidElem.classList.toggle('mirror-mode', mirrorMode);
    },

    adjustVideoElemSize() {
        const elems = document.getElementsByClassName('card');
        const totalRemoteVideosDesktop = elems.length;
        const newWidth = totalRemoteVideosDesktop <= 2 ? '50%' : totalRemoteVideosDesktop == 3 ? '33.33%' : totalRemoteVideosDesktop <= 8 ? '25%' : totalRemoteVideosDesktop <= 15 ? '20%' : totalRemoteVideosDesktop <= 18 ? '16%' : '12%';

        for (let i = 0; i < totalRemoteVideosDesktop; i++) {
            elems[i].style.width = newWidth;
        }
    },

    createDemoRemotes(str, total = 6) {
        const container = document.getElementById('videos');
        for (let i = 0; i < total; i++) {
            const div = document.createElement('div');
            div.id = `demo-${i}-container`;
            div.className = 'remote-video-container';
            div.innerHTML = `<video id="demo-${i}" class="remote-video" autoplay></video><div class="remote-video-controls"><i class="fa fa-microphone text-white pr-3 mute-remote-mic"></i><i class="fa fa-expand text-white expand-remote-video"></i></div>`;
            container.appendChild(div);
            this.adjustVideoElemSize();
        }
    }
};
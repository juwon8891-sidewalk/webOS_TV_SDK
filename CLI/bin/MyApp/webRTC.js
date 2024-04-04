// Start WebRTC functionality
function startWebRTC(handleFunc, logResponse) {
    navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } })
        .then(function(stream) {
            // Get the video track from the screen
            const videoTrack = stream.getVideoTracks()[0];

            // Create a new peer connection
            const peerConnection = new RTCPeerConnection();

            // Add the video track to the peer connection
            peerConnection.addTrack(videoTrack, stream);

            // Create an offer to establish connection
            peerConnection.createOffer()
                .then(function(offer) {
                    // Set local description
                    return peerConnection.setLocalDescription(offer);
                })
                .then(function() {
                    // Log local description
                    console.log('Local description set.');
                })
                .catch(function(error) {
                    console.log('Error setting local description:', error);
                });

            // Handle ICE candidates
            peerConnection.onicecandidate = function(event) {
                if (event.candidate) {
                    // Send ICE candidate to peer
                    console.log('Sending ICE candidate');
                }
            };

            // Success callback
            console.log('WebRTC started successfully.');

            // Display video on the webpage
            const videoElement = screenVideo;

            // Check if the variable is null or undefined
            if (videoElement) {
                // Video element is found, proceed with further actions
                videoElement.srcObject = stream;
                videoElement.style.display = 'block';
                console.log('Video displayed on webpage.');
                console.log(`Video track: ${videoTrack}`);
            } else {
                console.log("Video element is not found.");
            }
        })
        .catch(function(error) {
            console.log('Error accessing media devices:', error);
        });
}


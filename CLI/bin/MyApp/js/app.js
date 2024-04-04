// app.js

// Function to open media devices
const openMediaDevices = async (constraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints);
}

// Function to play video from camera
async function playVideoFromCamera(deviceId) {
  try {
      const constraints = {
          'video': {
              deviceId: { exact: deviceId }
          },
          'audio': true
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = document.querySelector('video#localVideo');
      videoElement.srcObject = stream;
  } catch (error) {
      console.error('Error opening video camera.', error);
  }
}

// Function to get list of video input devices
async function getVideoInputDevices() {
  try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      return videoDevices;
  } catch (error) {
      console.error('Error getting video input devices.', error);
      return [];
  }
}

// Call the function to get list of video input devices
getVideoInputDevices()
  .then(videoDevices => {
      // Choose the desired camera, for example, the first one
      if (videoDevices.length > 0) {
          const selectedDeviceId = videoDevices[0].deviceId;
          playVideoFromCamera(selectedDeviceId);
      } else {
          console.error('No video input devices found.');
      }
  });

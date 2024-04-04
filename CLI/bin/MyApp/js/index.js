// Example for camera device
var request = webOS.service.request('luna://com.webos.service.camera', {
  method: 'getInfo',
  parameters: { uri: 'camera://com.webos.service.camera/camera1' },
  onSuccess: function (inResponse) {
    console.log('Result: ' + JSON.stringify(inResponse));
    // To-Do something
  },
  onFailure: function (inError) {
    console.log('Failed to get camera device info');
    console.log('[' + inError.errorCode + ']: ' + inError.errorText);
    // To-Do something
    return;
  },
});

// Example for microphone device
var request = webOS.service.request('luna://com.webos.service.camera', {
  method: 'getInfo',
  parameters: { uri: 'camera://com.webos.service.camera/mic1' },
  onSuccess: function (inResponse) {
    console.log('Result: ' + JSON.stringify(inResponse));
    // To-Do something
  },
  onFailure: function (inError) {
    console.log('Failed to get microphone device info');
    console.log('[' + inError.errorCode + ']: ' + inError.errorText);
    // To-Do something
    return;
  },
});
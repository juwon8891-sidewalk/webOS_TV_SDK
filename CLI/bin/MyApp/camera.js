// Define the getWebOSSystemTime function in the global scope
function camera(handleFunc, subscribe) {
    var failureOccurred = false; // Flag to track failure

    // Example for camera device
    var cameraRequest = webOS.service.request('luna://com.webos.service.camera', {
        method: 'getInfo',
        parameters: { uri: 'camera://com.webos.service.camera/camera1' },
        onSuccess: function (inResponse) {
            console.log('Camera Result: ' + JSON.stringify(inResponse));
            // To-Do something
        },
        onFailure: function (inError) {
            console.log('Failed to get camera device info');
            console.log('[' + inError.errorCode + ']: ' + inError.errorText);
            failureOccurred = true; // Set flag to true on failure
        },
    });

    // Example for microphone device
    var micRequest = webOS.service.request('luna://com.webos.service.camera', {
        method: 'getInfo',
        parameters: { uri: 'camera://com.webos.service.camera/mic1' },
        onSuccess: function (inResponse) {
            console.log('Microphone Result: ' + JSON.stringify(inResponse));
            // To-Do something
        },
        onFailure: function (inError) {
            console.log('Failed to get microphone device info');
            console.log('[' + inError.errorCode + ']: ' + inError.errorText);
            failureOccurred = true; // Set flag to true on failure
        },
    });

    // Return based on the failure flag
    if (failureOccurred) {
        return; // Return if failure occurred
    } else {
        // Proceed with other logic if needed
    }
}

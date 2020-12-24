chrome.runtime.onMessage.addListener(receiver);

function receiver(request, sender, sendResponse) {
  console.log(request);
  sendResponse(request.toUpperCase());
}
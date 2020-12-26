let data = {
  baseURL: "https://translate.googleapis.com/translate_a/single?client=gtx&sl=",
  sourceLang: "auto",
  targetLang: "tr"
};

chrome.runtime.onMessage.addListener(receiver);

function receiver(request, sender, sendResponse) {
  if (request.type == "setLang") {
    data.targetLang = request.language;
  }
  translate(request, sendResponse);
  return true; // get error if we do not say chrome api where to close receiver function.
}

function translate(request, sendResponse) {
  const sourceText = request.text;
  const URL = `${data.baseURL}${data.sourceLang}&tl=${
    data.targetLang
  }&dt=t&q=${encodeURI(sourceText)}`;
  fetch(URL)
    .then(res => {
      return res.json();
    })
    .then(response => {
      sendResponse(response[0][0][0]);
    });
}

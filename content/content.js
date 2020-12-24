window.addEventListener("mouseup", starter);
function starter() {
  const selectedText = window.getSelection().toString();
  if (isQueryTranslatable(selectedText)) {
    chrome.runtime.sendMessage(selectedText, text => {
      console.log(text);
    });
  }
}

function isQueryTranslatable(selected) {
  return /[a-zA-Z]/g.test(selected)
}

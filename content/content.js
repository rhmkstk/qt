chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  localStorage.setItem("isAppOn", request);
  return true;
});

window.addEventListener("mouseup", starter);

function starter() {
  const isAppOn = localStorage.getItem("isAppOn");
  const selectedText = window.getSelection().toString();
  if (isSelectionPopup()) return;
  if (isAppOn != "false" && isQueryTranslatable(selectedText)) {
    messageController(selectedText, data());
  } else {
    deletePopup(data());
  }
}
function data() {
  return {
    newElement: document.createElement("DIV"),
    selection: window.getSelection(),
    relative: document.body.parentNode.getBoundingClientRect(),
    bottomPopup: document.getElementById("bottomPopup"),
    topPopup: document.getElementById("topPopup"),
    popup: document.getElementById("popup"),
    r() {
      if (this.selection.rangeCount > 0)
        return this.selection.getRangeAt(0).getBoundingClientRect();
    },
    selectedHeight() {
      return this.r().top - this.r().bottom;
    },
    selectedWidth() {
      return this.r().right - this.r().left;
    },
    popupHeight() {
      return this.newElement.offsetHeight;
    },
    popupWidth() {
      return this.newElement.offsetWidth;
    },
    popupPosition() {
      return this.popupHeight() * 12 - this.distanceOfSelectedToTop();
    },
    distanceOfSelectedToTop() {
      return this.r().top;
    },
    requireSpaceForOneSide() {
      return (this.selectedWidth() - this.popupWidth()) / 2;
    }
  };
}
function isSelectionPopup() {
  const popup = document.getElementById("popup");
  if (popup != null) {
    return window.getSelection().containsNode(popup, true);
  }
  return false;
}
function messageController(selectedText, data) {
  const query = {
    text: selectedText,
    type: "translate"
  };
  chrome.runtime.sendMessage(query, text => {
    if (/[a-zA-Z]/g.test(text)) {
      deletePopup(data);
      createPopup(text, data);
    }
  });
}

function isQueryTranslatable(selected) {
  return /[a-zA-Z]/g.test(selected);
}
function createPopup(text, data) {
  const size = window
    .getComputedStyle(window.getSelection().anchorNode.parentElement, null)
    .getPropertyValue("font-size");
  data.newElement.innerText = text;
  data.newElement.style.fontSize = parseInt(size) + "px";
  data.newElement.setAttribute("id", "popup");
  document.body.appendChild(data.newElement);
  setPopupPositionY(data);
  setPopupPositionX(data);
}
function setPopupPositionY(data) {
  // we set the popup below or above the selected element according to the position of the selected element on the y axis
  if (data.popupPosition() > 0) {
    data.newElement.classList.add("bottomPopup");
    data.newElement.style.top = data.r().bottom - data.relative.top + 8 + "px";
  } else {
    data.newElement.classList.add("topPopup");
    data.newElement.style.top =
      data.r().bottom -
      data.relative.top +
      (data.selectedHeight() - data.popupHeight() - 6) +
      "px";
  }
}

function setPopupPositionX(data) {
  // (r.right - relative.right) gives the coordinates of the right corner of the selected element, requireSpaceForOneSide gives needed value to align popup at middle of selected element
  data.newElement.style.right =
    -(data.r().right - data.relative.right) +
    data.requireSpaceForOneSide() +
    "px";
}

function deletePopup(data) {
  if (data.popup != null) data.popup.parentNode.removeChild(data.popup);
}

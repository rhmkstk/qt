window.addEventListener("mouseup", starter);
function starter() {
  const selectedText = window.getSelection().toString();
  if (isQueryTranslatable(selectedText)) {
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
function messageController(selectedText, data) {
  chrome.runtime.sendMessage(selectedText, text => {
    createPopup(text, data);
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
  document.body.appendChild(data.newElement);
  setPopupPositionY(data);
  setPopupPositionX(data);
}
function setPopupPositionY(data) {
  // reaches the coordinates of selected element and gives it to popup(as css top prop.) which we create, before do that checks the choosen elements position according to page, if the position closer top corner then bottom corner; puts popup to top of choosen word/words else puts under the choosen word/words.
  if (data.popupPosition() > 0) {
    data.newElement.setAttribute("id", "bottomPopup");
    data.newElement.style.top = data.r().bottom - data.relative.top + 8 + "px";
  } else {
    data.newElement.setAttribute("id", "topPopup");
    data.newElement.style.top =
      data.r().bottom -
      data.relative.top +
      (data.selectedHeight() - data.popupHeight() - 6) +
      "px";
  }
}

function setPopupPositionX(data) {
  // (r.right - relative.right) gives right corner of selected element as pixel. If we give that value as css right property to element that we create; right corner of element align to right corner of selected element, in this case if the width prop. of element we create is bigger than element choosen on the page the arrow of popup might show the word which the user did not select, to prevent this we align two elements from middle.
  data.newElement.style.right =
    -(data.r().right - data.relative.right) +
    data.requireSpaceForOneSide() +
    "px";
}

function deletePopup(data) {
  if (data.bottomPopup != null)
    data.bottomPopup.parentNode.removeChild(data.bottomPopup);
  if (data.topPopup != null)
    data.topPopup.parentNode.removeChild(data.topPopup);
}

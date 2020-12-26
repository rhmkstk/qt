starter(data());

data().select.addEventListener("change", sendLanguage);
data().check.addEventListener("change", handleOnOff);

function data() {
  return {
    check: document.getElementById("checkbox"),
    select: document.getElementById("select"),
    body: document.getElementsByTagName("body")[0],
    targetLang: () => localStorage.getItem("targetLang"),
    isAppOn: () => localStorage.getItem("isAppOn"),
    languages: [
      { lang: "English", short: "en" },
      { lang: "French", short: "fr" },
      { lang: "German", short: "de" },
      { lang: "Spanish", short: "es" },
      { lang: "Turkish", short: "tr" },
      { lang: "Italian", short: "it" },
      { lang: "Japanese", short: "ja" },
      { lang: "Chinese", short: "zh" },
      { lang: "Russian", short: "ru" }
    ]
  };
}
function starter(data) {
  createLanguageList(data);
  setSelectedLanguage(data);
  setViewToOnOff(data);
}

function sendLanguage() {
  const query = { language: "tr", type: "setLang" };
  const select = document.getElementById("select").options;
  const selectIndex = select.selectedIndex;
  const selectValue = select[selectIndex].value;
  localStorage.setItem("targetLang", selectValue);
  query.language = selectValue;

  chrome.runtime.sendMessage(query);
}
function handleOnOff() {
  const check = document.getElementById("checkbox");
  const select = document.getElementById("select");
  const body = document.getElementsByTagName("body")[0];

  if (check.checked) {
    body.classList.remove("off");
    select.disabled = false;
    localStorage.setItem("isAppOn", true);
  } else {
    body.classList.add("off");
    select.disabled = true;
    localStorage.setItem("isAppOn", false);
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, check.checked);
  });
}

function createLanguageList(data) {
  const select = document.createElement("select");
  select.setAttribute("id", "select");

  data.languages.map(lng => {
    const option = document.createElement("option");
    option.setAttribute("id", "option");
    option.value = lng.short;
    option.text = lng.lang;
    select.append(option);
  });
  document.body.appendChild(select);
}

function setSelectedLanguage(data) {
  const options = document.getElementById("select").options;
  let targetLang = data.targetLang();
  if (targetLang == null) {
    targetLang = "tr";
  }
  for (const option of options) {
    if (option.value == targetLang) {
      options.selectedIndex = option.index;
    }
  }
}

function setViewToOnOff(data) {
  if (data.isAppOn() == "false") {
    data.check.checked = false;
    data.body.classList.add("off");
  } else {
    data.check.checked = true;
  }
}

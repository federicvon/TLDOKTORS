chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarizeText",
    title: "TLDoktoR: Summarize this text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarizeText") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getSelectedText
    }, (injectionResults) => {
      const selectedText = injectionResults[0].result;
      const summary = selectedText.split('.').slice(0, 2).join('.') + ".";
      
      const url = chrome.runtime.getURL("popup.html") + `?summary=${encodeURIComponent(summary)}`;
      chrome.windows.create({
        url: url,
        type: "popup",
        width: 400,
        height: 600
      });
    });
  }
});

function getSelectedText() {
  return window.getSelection().toString();
}

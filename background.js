chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarizeText",
    title: "TLDoktoR: Summarize this text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "summarizeText") {
    const selectedText = info.selectionText;

    if (!selectedText) {
      alert("No text selected!");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/summarize_text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selectedText, summary_type: 'medium' })
      });

      const data = await response.json();

      if (!response.ok) {
        alert("API error: " + (data.error || "Unknown error"));
        return;
      }

      const summary = data.summary;

      // Open a popup with the summary as a query param
      const url = chrome.runtime.getURL("popup.html") + `?summary=${encodeURIComponent(summary)}`;

      chrome.windows.create({
        url,
        type: "popup",
        width: 400,
        height: 600
      });

    } catch (error) {
      alert("Failed to connect to summarization API.");
    }
  }
});

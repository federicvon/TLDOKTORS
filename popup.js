window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const summaryParam = params.get('summary');
  const outputDiv = document.getElementById('output');
  const inputText = document.getElementById('inputText');

  if (summaryParam) {
    outputDiv.innerText = summaryParam;
    inputText.value = ''; // clear input if summary came from context menu
  }

  document.getElementById('summarizeBtn').addEventListener('click', async function () {
    const text = inputText.value.trim();
    const lang = document.getElementById('language').value;

    if (!text) {
      outputDiv.innerText = "Please enter some text.";
      return;
    }

    outputDiv.innerText = "Summarizing...";

    try {
      const response = await fetch('http://127.0.0.1:5000/summarize_text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, summary_type: 'medium' })
      });

      const data = await response.json();

      if (response.ok) {
        let summary = data.summary;

        if (lang === "filipino") {
          summary = summary.replace(/the/gi, "ang").replace(/is/gi, "ay");
          outputDiv.innerText = "Buod (FIL): " + summary;
        } else if (lang === "taglish") {
          summary = summary.replace(/the/gi, "yung").replace(/is/gi, "ay");
          outputDiv.innerText = "Taglish: " + summary;
        } else {
          outputDiv.innerText = "Summary (EN): " + summary;
        }
      } else {
        outputDiv.innerText = "Error: " + (data.error || "Something went wrong");
      }
    } catch {
      outputDiv.innerText = "Failed to connect to API.";
    }
  });
});

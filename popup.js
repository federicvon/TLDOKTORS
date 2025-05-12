document.getElementById('summarizeBtn').addEventListener('click', function () {
  const inputText = document.getElementById('inputText').value.trim();
  const lang = document.getElementById('language').value;
  let output = "";

  if (!inputText) {
    output = "Please enter some text.";
  } else {
    // Simple mock summarization and translation
    const summary = inputText.split('.').slice(0, 2).join('.') + ".";
    if (lang === "english") {
      output = "Summary (EN): " + summary;
    } else if (lang === "filipino") {
      output = "Buod (FIL): " + summary.replace(/the/gi, "ang").replace(/is/gi, "ay"); // fake translation
    } else {
      output = "Taglish: " + summary.replace(/the/gi, "yung").replace(/is/gi, "ay");
    }
  }

  document.getElementById('output').innerText = output;
});

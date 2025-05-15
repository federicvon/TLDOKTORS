from flask import Flask, request, jsonify
import spacy, re
from summarizer import Summarizer
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)

# Load models
nlp = spacy.load("en_core_web_sm")
model = Summarizer()
ytt_api = YouTubeTranscriptApi()

def clean_transcript(text):
    text = re.sub(r'\[?\d{1,2}:\d{2}(?::\d{2})?\]?', '', text)
    text = re.sub(r'^[A-Za-z ]+:', '', text, flags=re.MULTILINE)
    text = re.sub(r'\s*\n\s*', ' ', text)
    text = re.sub(r'\s{2,}', ' ', text).strip()
    doc = nlp(text)
    sentences = [sent.text.strip().capitalize() + '.' if not sent.text.strip().endswith(('.', '?', '!')) else sent.text.strip() for sent in doc.sents]
    return ' '.join(sentences)

def get_summary_ratio(summary_type):
    ratios = {"short": 0.2, "medium": 0.4, "long": 0.6}
    return ratios.get(summary_type.lower(), 0.4)

@app.route('/')
def home():
    return "TLDoktoR Flask API is running"

@app.route('/summarize_text', methods=['POST'])
def summarize_text():
    data = request.get_json()
    text = data.get("text", "")
    summary_type = data.get("summary_type", "medium")

    if not text:
        return jsonify({"error": "No input text provided"}), 400

    cleaned = " ".join([sent.text for sent in nlp(text).sents])
    summary = model(cleaned, ratio=get_summary_ratio(summary_type))
    return jsonify({"summary": summary})

@app.route('/summarize_youtube', methods=['POST'])
def summarize_youtube():
    data = request.get_json()
    url = data.get("url", "")
    summary_type = data.get("summary_type", "medium")

    try:
        if "youtube.com" in url:
            video_id = url.split("v=")[1].split("&")[0]
        elif "youtu.be" in url:
            video_id = url.split("/")[-1]
        else:
            return jsonify({"error": "Invalid YouTube URL"}), 400

        transcript = ytt_api.get_transcript(video_id)
        text = "\n".join([entry['text'] for entry in transcript])
        cleaned = clean_transcript(text)
        summary = model(cleaned, ratio=get_summary_ratio(summary_type))
        return jsonify({"summary": summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

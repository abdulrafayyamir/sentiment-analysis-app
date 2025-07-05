from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
import requests
import uvicorn
import os

app = FastAPI(title="Sentiment Analysis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://sentiment-analysis-n9wlv3fkc-abdul-rafays-projects-cff1906f.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class TextInput(BaseModel):
    text: str

class SentimentResult(BaseModel):
    text: str
    sentiment: str
    confidence: float

def analyze_with_api(text):
    """Official Hugging Face Inference API"""
    API_URL = "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment"
    
    HF_TOKEN = os.environ.get("HF_TOKEN")
    
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json={"inputs": text})
        result = response.json()
        
        print(f"Status: {response.status_code}")
        print(f"Result: {result}")
        
        if response.status_code == 200 and isinstance(result, list) and len(result) > 0:
            scores = result[0] if isinstance(result[0], list) else result
            best_result = max(scores, key=lambda x: x['score'])
            
            label_map = {
                'LABEL_0': 'negative',
                'LABEL_1': 'neutral', 
                'LABEL_2': 'positive'
            }
            
            sentiment = label_map.get(best_result['label'], best_result['label'].lower())
            confidence = best_result['score']
            
            return sentiment, confidence
        
        return 'neutral', 0.5
        
    except Exception as e:
        print(f"Error: {e}")
        return 'neutral', 0.5
            


@app.get("/")
async def root():
    return {"message": "🎭 Sentiment Analysis API is running!", "version": "1.0.0"}

@app.post("/analyze", response_model=SentimentResult)
async def analyze_sentiment(input_data: TextInput):
    try:
        sentiment, confidence = analyze_with_api(input_data.text)
        
        return SentimentResult(
            text=input_data.text,
            sentiment=sentiment,
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)

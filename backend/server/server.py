import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
import base64
import io
import uvicorn
from elevenlabs import generate  # type: ignore

from .gpt_functions import generate_analysis_prompt

app = FastAPI()


@app.post("/ruskin")
async def create_upload_file(base64Image: str):
    # Process the image file
    try:
        gpt_analysis = generate_analysis_prompt(base64_image=base64Image)

        if gpt_analysis is None:
            raise HTTPException(status_code=500, detail="GPT-4 returned no text")

        audio = generate(
            text=gpt_analysis,
            voice=os.getenv("VOICE_ID"),
            model="eleven_turbo_v2",
        )

        # Create a response stream
        return StreamingResponse(io.BytesIO(audio), media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

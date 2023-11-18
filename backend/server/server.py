from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
import base64
import io
import uvicorn

from .gpt_functions import generate_analysis_prompt

app = FastAPI()


@app.post("/ruskin")
async def create_upload_file(file: UploadFile = File(...)):
    if file.content_type and file.content_type.startswith("image/"):
        # Process the image file
        try:
            # Convert base64 to image data here
            contents = await file.read()

            # gpt_analysis = generate_analysis_prompt()

            image_data = base64.b64decode(contents)

            # TODO: Perform any desired image processing
            # ...

            # TODO: Convert image to audio and save as MP3
            # For demonstration, just generating empty MP3-like content
            audio_data = b"ID3"  # Placeholder for actual MP3 audio binary

            # Create a response stream
            return StreamingResponse(io.BytesIO(audio_data), media_type="audio/mpeg")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        raise HTTPException(status_code=400, detail="Invalid file type")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
import base64
import io
from pydantic import BaseModel, Field
import uvicorn
from elevenlabs import generate  # type: ignore
from fastapi.middleware.cors import CORSMiddleware

from .gpt_functions import generate_analysis_prompt

app = FastAPI()


class InputData(BaseModel):
    imageURI: str = Field(...)


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/ruskin")
def create_upload_file(inputData: InputData):
    try:
        gpt_analysis = generate_analysis_prompt(imageURI=inputData.imageURI)

        if gpt_analysis is None:
            print("IM IN HERE")
            raise HTTPException(status_code=500, detail="GPT-4 returned no text")


        audio = generate(
            text=gpt_analysis,
            voice=os.getenv("VOICE_ID"),
            model="eleven_turbo_v2",
        )

        # with open("backend/test_images/test_audio.mp3", "rb") as fd:
        #     encoded_string = fd.read()

        # Create a response stream
        return StreamingResponse(
            io.BytesIO(audio),
            media_type="audio/mpeg",
            headers={
                "X-Metadata": base64.b64encode(gpt_analysis.encode("utf-8")).decode(
                    "ascii"
                ),
                "Access-Control-Expose-Headers": "X-Metadata",
            },
        )
    except Exception as e:
        print("IM IN HERE 2")
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)

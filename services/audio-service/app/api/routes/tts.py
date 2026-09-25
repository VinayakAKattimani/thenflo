from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel

from app.services.elevenlabs_service import elevenlabs_service


router = APIRouter(
    prefix="/tts",
    tags=["Text-to-Speech"],
)


class TTSRequest(BaseModel):
    text: str


@router.post("/")
async def text_to_speech(request: TTSRequest):
    try:
        if not request.text.strip():
            raise HTTPException(
                status_code=400,
                detail="Text cannot be empty",
            )

        audio = elevenlabs_service.synthesize(
            text=request.text
        )

        audio_bytes = b"".join(audio)

        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Text-to-speech failed: {str(e)}",
        )
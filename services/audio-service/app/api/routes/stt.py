from fastapi import APIRouter, File, UploadFile, HTTPException

from app.services.elevenlabs_service import elevenlabs_service


router = APIRouter(
    prefix="/stt",
    tags=["Speech-to-Text"],
)


@router.post("/")
async def speech_to_text(
    file: UploadFile = File(...)
):
    try:
        audio_data = await file.read()

        if not audio_data:
            raise HTTPException(
                status_code=400,
                detail="Audio file is empty",
            )

        result = elevenlabs_service.transcribe(
            audio_file=audio_data
        )

        return {
            "filename": file.filename,
            "text": result.text,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Speech-to-text failed: {str(e)}",
        )
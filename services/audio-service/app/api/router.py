from fastapi import APIRouter

from app.api.routes import health, stt, tts


router = APIRouter(
    prefix="/audio"
)

router.include_router(health.router)
router.include_router(stt.router)
router.include_router(tts.router)
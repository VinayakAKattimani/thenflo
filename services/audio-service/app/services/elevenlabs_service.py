from elevenlabs.client import ElevenLabs

from app.core.config import settings
from app.core.logger import get_logger


logger = get_logger(__name__)


class ElevenLabsService:

    def __init__(self):
        self.client = ElevenLabs(
            api_key=settings.ELEVENLABS_API_KEY
        )

    def transcribe(self, audio_file):
        logger.info("Sending audio to ElevenLabs STT")

        result = self.client.speech_to_text.convert(
            file=audio_file,
            model_id=settings.ELEVENLABS_STT_MODEL,
        )

        logger.info("Speech-to-text completed")

        return result

    def synthesize(self, text: str):
        logger.info("Generating speech with ElevenLabs")

        audio = self.client.text_to_speech.convert(
            voice_id=settings.ELEVENLABS_TTS_VOICE_ID,
            model_id=settings.ELEVENLABS_TTS_MODEL,
            text=text,
        )

        logger.info("Text-to-speech completed")

        return audio


elevenlabs_service = ElevenLabsService()
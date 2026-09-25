from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ELEVENLABS_API_KEY: str
    ELEVENLABS_TTS_VOICE_ID: str
    ELEVENLABS_TTS_MODEL: str = "eleven_multilingual_v2"
    ELEVENLABS_STT_MODEL: str = "scribe_v2"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
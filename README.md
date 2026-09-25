# ThenFLo

## Enterprise Voice AI Platform

ThenFLo is an enterprise-grade Voice AI platform built using a microservices architecture. It combines conversational AI, document-based knowledge retrieval, large language models, speech-to-text, and text-to-speech into a unified platform.

The platform is designed to support both text-based and voice-based AI interactions while keeping each major responsibility isolated into independently deployable services.

---

## Architecture

```text
                         ┌───────────────────┐
                         │      Frontend     │
                         │   React / JS      │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │      Gateway      │
                         │    FastAPI :8000  │
                         └─────────┬─────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
      ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
      │ Auth Service │     │ Conversation │     │ Audio Service│
      │              │     │   Service    │     │              │
      └──────────────┘     └──────┬───────┘     └──────────────┘
                                   │
                         ┌─────────┴─────────┐
                         ▼                   ▼
                 ┌──────────────┐    ┌──────────────┐
                 │   Knowledge  │    │ LLM Service  │
                 │    Service   │    │              │
                 └──────┬───────┘    └──────────────┘
                        │
                        ▼
                  ┌───────────┐
                  │  Qdrant   │
                  │ Vector DB │
                  └───────────┘

        ┌────────────┐  ┌────────┐  ┌───────┐  ┌─────────┐
        │ PostgreSQL │  │ Redis  │  │ Kafka │  │ Kafka UI│
        └────────────┘  └────────┘  └───────┘  └─────────┘
```

---

## Services

### Gateway

The Gateway acts as the central entry point for the platform.

Responsibilities include:

* Routing requests to internal services
* Handling communication between the frontend and backend services
* Providing a unified API entry point
* Forwarding authentication and application requests
* Streaming LLM responses through the platform

**Port:** `8000`

---

### Auth Service

Handles authentication and user-related access control.

Responsibilities include:

* User registration
* User authentication
* JWT-based authentication
* Password management
* Authentication-related database operations

---

### Conversation Service

Handles the application's conversational workflow.

Responsibilities include:

* Managing conversations
* Processing user messages
* Coordinating LLM requests
* Communicating with the Knowledge Service when contextual information is required
* Maintaining conversation-related data

The Conversation Service acts as the main orchestration layer for AI conversations.

---

### Knowledge Service

Provides document-based knowledge retrieval for the AI system.

Responsibilities include:

* Document ingestion
* Document processing and chunking
* Embedding generation
* Vector search
* Retrieving relevant context for user queries
* Communication with Qdrant

This service provides the Retrieval-Augmented Generation (RAG) capability of the platform.

---

### LLM Service

Provides integration with Large Language Models.

Responsibilities include:

* Sending prompts to the configured LLM provider
* Handling LLM responses
* Supporting streamed responses
* Keeping model-provider integration isolated from other services

This allows the underlying LLM provider to be changed without requiring major changes to the rest of the platform.

---

### Audio Service

The Audio Service provides a unified speech interface for the platform.

It replaces the previously separate STT and TTS services.

The service currently uses **ElevenLabs** for:

* Speech-to-Text (STT)
* Text-to-Speech (TTS)

#### Endpoints

```text
GET  /audio/health/
POST /audio/stt/
POST /audio/tts/
```

**Port:** `8005`

---

## Conversational Flow

A typical text conversation follows this flow:

```text
User
 │
 ▼
Frontend
 │
 ▼
Gateway
 │
 ▼
Conversation Service
 │
 ├──────────────► Knowledge Service
 │                     │
 │                     ▼
 │                   Qdrant
 │                     │
 │                     ▼
 │              Relevant Context
 │
 ▼
LLM Service
 │
 ▼
AI Response
 │
 ▼
Gateway
 │
 ▼
Frontend
```

If the conversation does not require external knowledge, the Conversation Service can communicate with the LLM Service without performing a knowledge search.

---

## Voice AI Flow

For voice interactions:

```text
User
 │
 │ Speech
 ▼
Frontend
 │
 ▼
Gateway
 │
 ▼
Audio Service
 │
 │ Speech-to-Text
 ▼
Text
 │
 ▼
Conversation Service
 │
 ├──────────────► Knowledge Service
 │
 └──────────────► LLM Service
                         │
                         ▼
                    AI Response
                         │
                         ▼
                    Audio Service
                         │
                         │ Text-to-Speech
                         ▼
                  Generated Speech
                         │
                         ▼
                     Frontend
                         │
                         ▼
                        User
```

This allows the same conversational backend to support both text and voice interactions.

---

## RAG Pipeline

The Knowledge Service provides Retrieval-Augmented Generation (RAG).

```text
Document
   │
   ▼
Document Processing
   │
   ▼
Chunking
   │
   ▼
Embeddings
   │
   ▼
Qdrant
   │
   │
User Query
   │
   ▼
Embedding
   │
   ▼
Vector Search
   │
   ▼
Relevant Chunks
   │
   ▼
LLM Service
   │
   ▼
Context-Aware Response
```

The retrieved document chunks provide additional context to the LLM so that responses can be grounded in the application's knowledge base.

---

## Technology Stack

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* PostgreSQL

### AI

* Large Language Models
* Retrieval-Augmented Generation (RAG)
* Qdrant
* Embeddings
* Ollama / external LLM providers

### Voice

* ElevenLabs
* Speech-to-Text
* Text-to-Speech

### Infrastructure

* Docker
* Docker Compose
* Apache Kafka
* Kafka UI
* Redis
* PostgreSQL
* Qdrant

### Frontend

* React
* JavaScript
* REST APIs

---

## Project Structure

```text
VoxForge/
│
├── gateway/
│
├── services/
│   ├── auth-service/
│   ├── conversation-service/
│   ├── knowledge-service/
│   ├── llm-service/
│   └── audio-service/
│
├── voxforge-frontend/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

> **Note:** ThenFLo is the product/platform name. `VoxForge` is the historical repository and internal codebase name.

---

## Running the Project

Make sure Docker Desktop is running.

Start the complete platform:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

View service logs:

```bash
docker compose logs -f <service-name>
```

Stop the platform:

```bash
docker compose down
```

---

## Service Ports

| Service       |   Port |
| ------------- | -----: |
| Frontend      | `5173` |
| Gateway       | `8000` |
| Audio Service | `8005` |
| PostgreSQL    | `5432` |
| Redis         | `6379` |
| Kafka         | `9092` |
| Qdrant        | `6333` |

---

## API Documentation

FastAPI services expose interactive Swagger documentation.

Gateway:

```text
http://localhost:8000/docs
```

Audio Service:

```text
http://localhost:8005/docs
```

---

## Environment Variables

Environment-specific configuration is stored in `.env` files.

Example:

```env
ELEVENLABS_API_KEY=YOUR_KEY_HERE
ELEVENLABS_TTS_VOICE_ID=YOUR_VOICE_ID
ELEVENLABS_TTS_MODEL=eleven_multilingual_v2
ELEVENLABS_STT_MODEL=scribe_v2
```

**Never commit real API keys, passwords, tokens, or other secrets to Git.**

Use `.env.example` files for configuration templates.

---

## Current Development

The platform is currently under active development.

Current development focus includes:

* Completing frontend integration with the backend
* Gateway integration for all services
* Conversational AI workflow
* RAG-based knowledge retrieval
* Streaming LLM responses
* Voice interaction using ElevenLabs
* Authentication and authorization
* Microservice communication
* Docker-based deployment

---

## Project Goals

ThenFLo is being developed as a scalable foundation for enterprise Voice AI applications.

The architecture is designed around:

* Independent microservices
* Clear separation of responsibilities
* API-based service communication
* AI-powered conversations
* Knowledge-grounded responses
* Voice-based interaction
* Containerized deployment
* Scalable infrastructure

---

## Status

🚧 **Active Development**

The platform is currently being developed and integrated across its backend services and frontend application.

---

## License

This project is currently under active development and has not yet been released under a public open-source license.

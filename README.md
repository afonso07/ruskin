# ruskin. An Art Copilot

Introducing ruskin: Your personal art critic powered by the new OpenAI Vision API! 🎨✨ Watch as GPT-4 analyzes your chosen masterpiece, while ElevenLabs narrates the artistic journey. Inspired by John Ruskin, ruskin serves as an art co-pilot, bridging the gap between AI tools and human creativity. It enhances, not replaces, the artist's vision.

## 🏃‍♀️ Running the project
To run the project you need to have the following env vars setup:

```
export OPENAI_API_KEY=<KEY>
export ELEVEN_API_KEY=<KEY>
export VOICE_ID=<ID>

```
Then you can start the server by running:
- `python -m backend.server.server`

And the frontend with:
- `npm run dev`
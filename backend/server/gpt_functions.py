from typing import Dict, List, Union

from openai import OpenAI
from .gpt_contexts import critique_context

JSONVal = Union[None, bool, str, float, int, List["JSONVal"], Dict[str, "JSONVal"]]

client = OpenAI()


def generate_image_prompt(base64_image: str) -> list[Dict[str, JSONVal]]:

    return [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this image."},
                {
                    "type": "image_url",
                    "image_url": f"data:image/jpeg;base64,{base64_image}",
                },
            ],
        },
    ]


def generate_analysis_prompt(base64_image) -> str | None:
    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[],
        max_tokens=500,
    )
    response_text = response.choices[0].message.content
    return response_text

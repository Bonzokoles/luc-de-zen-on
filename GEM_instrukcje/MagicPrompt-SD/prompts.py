"""
Uniwersalny generator promptów dla Stable Diffusion
"""

def generate_prompt(base_prompt, style="realistic"):
    """Generuje rozszerzony prompt dla SD"""
    
    styles = {
        "realistic": "photorealistic, high detail, 8k, professional photography",
        "artistic": "digital art, concept art, trending on artstation",
        "anime": "anime style, manga, detailed illustration",
        "fantasy": "fantasy art, magical, ethereal, mystical"
    }
    
    quality_tags = "masterpiece, best quality, ultra detailed"
    style_tags = styles.get(style, styles["realistic"])
    
    return f"{base_prompt}, {style_tags}, {quality_tags}"

def negative_prompt():
    """Standard negative prompt"""
    return "lowres, bad anatomy, bad hands, text, error, missing fingers, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry"

if __name__ == "__main__":
    prompt = generate_prompt("beautiful landscape")
    print(f"Positive: {prompt}")
    print(f"Negative: {negative_prompt()}")
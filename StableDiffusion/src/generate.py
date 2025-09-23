"""
Główny moduł generowania obrazów Stable Diffusion
"""
import torch
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
from PIL import Image
import json
import os
from datetime import datetime
from pathlib import Path
import argparse


class StableDiffusionGenerator:
    def __init__(self, model_id="runwayml/stable-diffusion-v1-5"):
        """
        Inicjalizuje generator Stable Diffusion
        
        Args:
            model_id (str): ID modelu Hugging Face lub ścieżka lokalna
        """
        self.model_id = model_id
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.pipeline = None
        self.load_model()
    
    def load_model(self):
        """Ładuje model Stable Diffusion"""
        print(f"Ładowanie modelu: {self.model_id}")
        print(f"Urządzenie: {self.device}")
        
        self.pipeline = StableDiffusionPipeline.from_pretrained(
            self.model_id,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            use_safetensors=True
        )
        
        # Optymalizacja dla CUDA
        if self.device == "cuda":
            self.pipeline = self.pipeline.to(self.device)
            self.pipeline.enable_attention_slicing()
            self.pipeline.enable_xformers_memory_efficient_attention()
        
        # Lepszy scheduler
        self.pipeline.scheduler = DPMSolverMultistepScheduler.from_config(
            self.pipeline.scheduler.config
        )
        
        print("Model załadowany pomyślnie!")
    
    def generate_image(self, prompt, negative_prompt="", num_inference_steps=50, 
                      guidance_scale=7.5, width=512, height=512, seed=None):
        """
        Generuje obraz na podstawie promptu
        
        Args:
            prompt (str): Opis obrazu do wygenerowania
            negative_prompt (str): Co nie ma być na obrazie
            num_inference_steps (int): Liczba kroków denoising
            guidance_scale (float): Siła adherowania do promptu
            width (int): Szerokość obrazu
            height (int): Wysokość obrazu
            seed (int): Seed dla powtarzalności
            
        Returns:
            PIL.Image: Wygenerowany obraz
            dict: Metadane generowania
        """
        if seed is not None:
            generator = torch.Generator(device=self.device).manual_seed(seed)
        else:
            generator = None
            seed = torch.randint(0, 2**32, (1,)).item()
        
        print(f"Generowanie: '{prompt}'")
        print(f"Seed: {seed}")
        
        with torch.autocast(self.device):
            result = self.pipeline(
                prompt=prompt,
                negative_prompt=negative_prompt,
                num_inference_steps=num_inference_steps,
                guidance_scale=guidance_scale,
                width=width,
                height=height,
                generator=generator
            )
        
        image = result.images[0]
        
        # Metadane
        metadata = {
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "steps": num_inference_steps,
            "guidance_scale": guidance_scale,
            "width": width,
            "height": height,
            "seed": seed,
            "model": self.model_id,
            "timestamp": datetime.now().isoformat()
        }
        
        return image, metadata
    
    def save_image(self, image, metadata, output_dir="output"):
        """
        Zapisuje obraz z metadanymi
        
        Args:
            image (PIL.Image): Obraz do zapisania
            metadata (dict): Metadane
            output_dir (str): Folder wyjściowy
            
        Returns:
            str: Ścieżka zapisanego pliku
        """
        Path(output_dir).mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"sd_{timestamp}_{metadata['seed']}.png"
        filepath = Path(output_dir) / filename
        
        # Zapisz obraz
        image.save(filepath)
        
        # Zapisz metadane
        metadata_file = filepath.with_suffix('.json')
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        print(f"Obraz zapisany: {filepath}")
        return str(filepath)


def main():
    parser = argparse.ArgumentParser(description='Stable Diffusion Image Generator')
    parser.add_argument('--prompt', required=True, help='Opis obrazu')
    parser.add_argument('--negative', default='', help='Negatywny prompt')
    parser.add_argument('--steps', type=int, default=50, help='Liczba kroków')
    parser.add_argument('--guidance', type=float, default=7.5, help='Guidance scale')
    parser.add_argument('--width', type=int, default=512, help='Szerokość')
    parser.add_argument('--height', type=int, default=512, help='Wysokość')
    parser.add_argument('--seed', type=int, help='Seed dla powtarzalności')
    parser.add_argument('--model', default='runwayml/stable-diffusion-v1-5', help='Model ID')
    parser.add_argument('--output', default='output', help='Folder wyjściowy')
    
    args = parser.parse_args()
    
    # Inicjalizuj generator
    generator = StableDiffusionGenerator(args.model)
    
    # Generuj obraz
    image, metadata = generator.generate_image(
        prompt=args.prompt,
        negative_prompt=args.negative,
        num_inference_steps=args.steps,
        guidance_scale=args.guidance,
        width=args.width,
        height=args.height,
        seed=args.seed
    )
    
    # Zapisz rezultat
    filepath = generator.save_image(image, metadata, args.output)
    print(f"Gotowe! Obraz zapisany w: {filepath}")


if __name__ == "__main__":
    main()
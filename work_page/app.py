"""
Flask Web Server z integracją Stable Diffusion i Wildcards
"""
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import sys
import os
from pathlib import Path
import requests
import base64
import io
from PIL import Image
import json
from datetime import datetime

# Dodaj src do ścieżki
sys.path.append(str(Path(__file__).parent / "src"))
from wildcard_parser import WildcardParser, enhance_prompt_with_wildcards, get_wildcard_suggestions

app = Flask(__name__, 
           template_folder='templates',
           static_folder='static')
CORS(app)

# Inicjalizacja wildcards parser
WILDCARDS_DIR = Path(__file__).parent / "wildcards"
wildcard_parser = WildcardParser(str(WILDCARDS_DIR))

# Konfiguracja modeli (kompatybilna z Cloudflare Workers)
MODELS = {
    "realistic_vision": "SG161222/Realistic_Vision_V5.1_noVAE",
    "dreamshaper": "Lykon/DreamShaper-v7", 
    "sdxl": "stabilityai/stable-diffusion-xl-base-1.0",
    "deliberate": "XpucT/Deliberate",
    "anything_v5": "stabilityai/stable-diffusion-2-1",
    "protogen": "darkstorm2150/Protogen_x5.8",
    "flux": "black-forest-labs/FLUX.1-dev"
}

HUGGINGFACE_TOKEN = os.getenv('HUGGINGFACE_TOKEN', '')


@app.route('/')
def index():
    """Główna strona aplikacji"""
    return render_template('index.html')


@app.route('/api/models', methods=['GET'])
def get_models():
    """Zwraca listę dostępnych modeli"""
    return jsonify(MODELS)


@app.route('/api/wildcards/categories', methods=['GET'])
def get_wildcard_categories():
    """Zwraca dostępne kategorie wildcards"""
    categories = wildcard_parser.get_available_categories()
    return jsonify(categories)


@app.route('/api/wildcards/suggestions', methods=['GET'])
def get_suggestions():
    """Zwraca sugestie wildcards"""
    category = request.args.get('category')
    suggestions = get_wildcard_suggestions(wildcard_parser, category)
    return jsonify({'suggestions': suggestions})


@app.route('/api/wildcards/process', methods=['POST'])
def process_wildcards():
    """Przetwarza prompt z wildcards"""
    data = request.get_json()
    prompt = data.get('prompt', '')
    enhancement_level = data.get('enhancement_level', 'medium')
    
    # Przetwórz wildcards
    processed_prompt = wildcard_parser.process_prompt_wildcards(prompt)
    
    # Opcjonalnie ulepsz prompt
    if data.get('enhance', False):
        processed_prompt = enhance_prompt_with_wildcards(
            processed_prompt, wildcard_parser, enhancement_level
        )
    
    return jsonify({
        'original_prompt': prompt,
        'processed_prompt': processed_prompt
    })


@app.route('/api/wildcards/random', methods=['GET'])
def generate_random_prompt():
    """Generuje losowy prompt używając wildcards"""
    template = request.args.get('template')
    random_prompt = wildcard_parser.generate_random_prompt(template)
    
    return jsonify({
        'random_prompt': random_prompt
    })


@app.route('/api/generate', methods=['POST'])
def generate_image():
    """Generuje obraz używając Hugging Face API"""
    data = request.get_json()
    
    prompt = data.get('prompt', '')
    model_key = data.get('model', 'realistic_vision')
    process_wildcards_flag = data.get('process_wildcards', False)
    enhance_flag = data.get('enhance_prompt', False)
    enhancement_level = data.get('enhancement_level', 'medium')
    
    if not prompt:
        return jsonify({'error': 'Prompt jest wymagany'}), 400
    
    # Przetwórz wildcards jeśli włączone
    if process_wildcards_flag:
        processed_prompt = wildcard_parser.process_prompt_wildcards(prompt)
        
        if enhance_flag:
            processed_prompt = enhance_prompt_with_wildcards(
                processed_prompt, wildcard_parser, enhancement_level
            )
    else:
        processed_prompt = prompt
    
    # Pobierz model
    model_path = MODELS.get(model_key, MODELS['realistic_vision'])
    
    if not HUGGINGFACE_TOKEN:
        # Fallback do lokalnego Cloudflare Workers API
        try:
            api_url = f"http://127.0.0.1:8787/?model={model_key}&input={processed_prompt}"
            response = requests.get(api_url, timeout=60)
            
            if response.ok:
                # Zwróć obraz jako base64
                image_base64 = base64.b64encode(response.content).decode()
                
                return jsonify({
                    'success': True,
                    'image': f"data:image/png;base64,{image_base64}",
                    'original_prompt': prompt,
                    'processed_prompt': processed_prompt,
                    'model': model_key,
                    'source': 'cloudflare_workers'
                })
            else:
                return jsonify({'error': f'Błąd Cloudflare Workers API: {response.status_code}'}), 500
                
        except requests.exceptions.RequestException as e:
            return jsonify({'error': f'Cloudflare Workers niedostępny: {str(e)}'}), 500
    
    # Użyj Hugging Face API
    try:
        hf_url = f"https://api-inference.huggingface.co/models/{model_path}"
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_TOKEN}",
            "Content-Type": "application/json"
        }
        
        payload = {"inputs": processed_prompt}
        
        response = requests.post(hf_url, headers=headers, json=payload, timeout=60)
        
        if response.ok:
            # Konwertuj na base64
            image_base64 = base64.b64encode(response.content).decode()
            
            return jsonify({
                'success': True,
                'image': f"data:image/png;base64,{image_base64}",
                'original_prompt': prompt,
                'processed_prompt': processed_prompt,
                'model': model_key,
                'source': 'huggingface'
            })
        else:
            error_msg = response.text
            return jsonify({'error': f'Błąd Hugging Face API: {error_msg}'}), 500
            
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Błąd połączenia: {str(e)}'}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Sprawdzenie stanu aplikacji"""
    return jsonify({
        'status': 'ok',
        'wildcards_loaded': len(wildcard_parser.wildcards_data),
        'models_available': len(MODELS),
        'huggingface_token': bool(HUGGINGFACE_TOKEN)
    })


if __name__ == '__main__':
    print("🎨 Uruchamianie AI Image Generator z Wildcards...")
    print(f"📁 Wildcards directory: {WILDCARDS_DIR}")
    print(f"🤖 Załadowano modeli: {len(MODELS)}")
    print(f"📚 Załadowano kategorii wildcards: {sum(len(cats) for cats in wildcard_parser.get_available_categories().values())}")
    print(f"🔑 Hugging Face token: {'✅' if HUGGINGFACE_TOKEN else '❌ (używa Cloudflare Workers)'}")
    print("\n🚀 Serwer będzie dostępny na: http://localhost:5000")
    print("📖 API dokumentacja:")
    print("   GET  /api/models - lista modeli")
    print("   GET  /api/wildcards/categories - kategorie wildcards") 
    print("   POST /api/wildcards/process - przetwarzaj wildcards")
    print("   POST /api/generate - generuj obraz")
    print("   GET  /api/health - status aplikacji")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
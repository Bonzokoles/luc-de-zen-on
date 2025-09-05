import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

export const POST: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any)?.runtime;
  
  if (!runtime?.env?.AI) {
    console.error('Cloudflare AI binding not available');
    return createErrorResponse('Translation service not configured', 500);
  }

  try {
    const body = await request.json();
    const { text, sourceLanguage = 'polish', targetLanguage = 'english' } = body ?? {};

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return createErrorResponse('Text to translate is required', 400);
    }

    // Tłumaczenie przy użyciu Cloudflare AI
    const ai = runtime.env.AI;
    
    // Skrócona wersja tłumaczenia dla promptów obrazowych
    let translatedText = text;
    
    if (sourceLanguage === 'polish' && targetLanguage === 'english') {
      // Rozszerzony system tłumaczenia dla promptów obrazowych
      const translations = {
        // Podstawowe słowa
        'i': 'and',
        'w': 'in',
        'na': 'on',
        'z': 'with',
        'o': 'about',
        'do': 'to',
        'od': 'from',
        'dla': 'for',
        'przy': 'at',
        'ze': 'with',
        'po': 'after',
        
        // Zwierzęta
        'kot': 'cat',
        'pies': 'dog',
        'koń': 'horse',
        'ptak': 'bird',
        'ryba': 'fish',
        'lew': 'lion',
        'tygrys': 'tiger',
        'słoń': 'elephant',
        'małpa': 'monkey',
        'wilk': 'wolf',
        'niedźwiedź': 'bear',
        'lis': 'fox',
        'królik': 'rabbit',
        'mysz': 'mouse',
        'żaba': 'frog',
        
        // Pojazdy
        'samochód': 'car',
        'samochod': 'car',
        'auto': 'car',
        'pojazd': 'vehicle',
        'motocykl': 'motorcycle',
        'rower': 'bicycle',
        'pociąg': 'train',
        'pociag': 'train',
        'samolot': 'airplane',
        'helikopter': 'helicopter',
        'statek': 'ship',
        'łódź': 'boat',
        'lodz': 'boat',
        'ciężarówka': 'truck',
        'ciezarowka': 'truck',
        'autobus': 'bus',
        'taxi': 'taxi',
        
        // Kolory
        'czerwony': 'red',
        'niebieski': 'blue',
        'zielony': 'green',
        'żółty': 'yellow',
        'czarny': 'black',
        'biały': 'white',
        'różowy': 'pink',
        'fioletowy': 'purple',
        'brązowy': 'brown',
        'szary': 'gray',
        'pomarańczowy': 'orange',
        'złoty': 'golden',
        'srebrny': 'silver',
        
        // Natura
        'góra': 'mountain',
        'gora': 'mountain',
        'góry': 'mountains',
        'gory': 'mountains',
        'las': 'forest',
        'drzewo': 'tree',
        'kwiat': 'flower',
        'kwiaty': 'flowers',
        'trawa': 'grass',
        'niebo': 'sky',
        'chmura': 'cloud',
        'chmury': 'clouds',
        'słońce': 'sun',
        'slonce': 'sun',
        'księżyc': 'moon',
        'ksiezyc': 'moon',
        'gwiazda': 'star',
        'gwiazdy': 'stars',
        'morze': 'sea',
        'ocean': 'ocean',
        'rzeka': 'river',
        'jezioro': 'lake',
        'plaża': 'beach',
        'plaza': 'beach',
        'pustynia': 'desert',
        'śnieg': 'snow',
        'snieg': 'snow',
        'lód': 'ice',
        'lod': 'ice',
        'ogień': 'fire',
        'ogien': 'fire',
        'woda': 'water',
        'ziemia': 'earth',
        'planeta': 'planet',
        
        // Budynki i miejsca
        'dom': 'house',
        'miasto': 'city',
        'wieś': 'village',
        'ulica': 'street',
        'droga': 'road',
        'most': 'bridge',
        'zamek': 'castle',
        'kościół': 'church',
        'szkoła': 'school',
        'biblioteka': 'library',
        'muzeum': 'museum',
        'teatr': 'theater',
        'kino': 'cinema',
        'park': 'park',
        'ogród': 'garden',
        'restauracja': 'restaurant',
        'kawiarnia': 'cafe',
        'sklep': 'shop',
        'hotel': 'hotel',
        'szpital': 'hospital',
        'budynek': 'building',
        'architektura': 'architecture',
        
        // Style i przymiotniki
        'piękny': 'beautiful',
        'ładny': 'pretty',
        'brzydki': 'ugly',
        'duży': 'big',
        'mały': 'small',
        'wielki': 'huge',
        'maleńki': 'tiny',
        'wysoki': 'tall',
        'niski': 'short',
        'długi': 'long',
        'krótki': 'short',
        'szeroki': 'wide',
        'wąski': 'narrow',
        'gruby': 'thick',
        'cienki': 'thin',
        'stary': 'old',
        'nowy': 'new',
        'młody': 'young',
        'szybki': 'fast',
        'wolny': 'slow',
        'jasny': 'bright',
        'ciemny': 'dark',
        'głośny': 'loud',
        'cichy': 'quiet',
        'futurystyczny': 'futuristic',
        'nowoczesny': 'modern',
        'starożytny': 'ancient',
        'historyczny': 'historic',
        'magiczny': 'magical',
        'fantastyczny': 'fantastic',
        'realistyczny': 'realistic',
        'abstrakcyjny': 'abstract',
        'kolorowy': 'colorful',
        'minimalistyczny': 'minimalist',
        'elegancki': 'elegant',
        'rustykalny': 'rustic',
        'industrialny': 'industrial',
        'romantyczny': 'romantic',
        'mysteryjny': 'mysterious',
        'spokojny': 'peaceful',
        'dziki': 'wild',
        'egzotyczny': 'exotic',
        'tropikalny': 'tropical',
        'arktyczny': 'arctic',
        'cyberpunk': 'cyberpunk',
        'steampunk': 'steampunk',
        'retro': 'retro',
        'vintage': 'vintage',
        'artystyczny': 'artistic',
        'szczegółowy': 'detailed',
        'profesjonalny': 'professional',
        'dramatyczny': 'dramatic',
        'energiczny': 'energetic',
        
        // Czas i pogoda
        'dzień': 'day',
        'noc': 'night',
        'rano': 'morning',
        'wieczór': 'evening',
        'zachód': 'sunset',
        'zachód słońca': 'sunset',
        'wschód': 'sunrise',
        'wschód słońca': 'sunrise',
        'deszcz': 'rain',
        'burza': 'storm',
        'mgła': 'fog',
        'wiatr': 'wind',
        'lato': 'summer',
        'zima': 'winter',
        'wiosna': 'spring',
        'jesień': 'autumn',
        
        // Człowiek
        'człowiek': 'human',
        'kobieta': 'woman',
        'mężczyzna': 'man',
        'dziecko': 'child',
        'rodzina': 'family',
        'dziewczyna': 'girl',
        'chłopiec': 'boy',
        'książę': 'prince',
        'księżniczka': 'princess',
        'król': 'king',
        'królowa': 'queen',
        'rycerz': 'knight',
        'czarodziej': 'wizard',
        'czarownica': 'witch',
        'anioł': 'angel',
        'demon': 'demon',
        'robot': 'robot',
        'cyborg': 'cyborg',
        'obcy': 'alien',
        'portret': 'portrait',
        
        // Technologia
        'komputer': 'computer',
        'telefon': 'phone',
        'laptop': 'laptop',
        'tablet': 'tablet',
        'ekran': 'screen',
        'kamera': 'camera',
        'internet': 'internet',
        'strona': 'website',
        'aplikacja': 'application',
        'program': 'program',
        'gra': 'game',
        'film': 'movie',
        'zdjęcie': 'photo',
        'obraz': 'image',
        'technologia': 'technology',
        
        // Sztuka i style
        'fotografia': 'photography',
        'malarstwo': 'painting',
        'rysunek': 'drawing',
        'krajobraz': 'landscape',
        'natura': 'nature',
        'światło': 'light',
        'cień': 'shadow',
        'fantasy': 'fantasy',
        'sci-fi': 'sci-fi',
        'neon': 'neon',
        'wysokiej jakości': 'high quality',
        
        // Dodatkowe przydatne słowa
        'oczy': 'eyes',
        'twarz': 'face',
        'ręce': 'hands',
        'włosy': 'hair',
        'uśmiech': 'smile',
        'smutny': 'sad',
        'szczęśliwy': 'happy',
        'zły': 'angry',
        'przestraszony': 'scared',
        'zaskoczony': 'surprised'
      };

      // Tłumaczenie podstawowych słów
      let result = text.toLowerCase();
      
      // Normalizacja polskich znaków dla lepszego dopasowania
      const normalizePolish = (text: string) => {
        return text
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')  // Usuń diakrytyki
          .toLowerCase();
      };
      
      // Pierwsze tłumaczenie - dokładne dopasowanie z polskimi znakami
      for (const [polish, english] of Object.entries(translations)) {
        const regex = new RegExp(`\\b${polish}\\b`, 'gi');
        result = result.replace(regex, english);
      }
      
      // Drugie tłumaczenie - znormalizowane dopasowanie
      for (const [polish, english] of Object.entries(translations)) {
        const normalizedPolish = normalizePolish(polish);
        const regex = new RegExp(`\\b${normalizedPolish}\\b`, 'gi');
        result = result.replace(regex, english);
      }
      
      translatedText = result;
    }

    return createSuccessResponse({
      originalText: text,
      translatedText,
      sourceLanguage,
      targetLanguage,
      method: 'dictionary-based',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Translation failed';
    return createErrorResponse(errorMessage, 500);
  }
};

export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: 'Translation API is running',
    supportedLanguages: ['polish', 'english'],
    status: 'active'
  });
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Enhanced AI Models Configuration for MyBonzo
var ENHANCED_AI_MODELS = {
    // Cloudflare AI Models (Primary - No API keys needed)
    'cf-llama-3.1-8b': {
        name: 'Llama 3.1 8B (Balanced)',
        provider: 'Cloudflare',
        endpoint: 'cloudflare-ai',
        model: '@cf/meta/llama-3.1-8b-instruct',
        parameters: { temperature: 0.7, max_tokens: 1000 },
        category: 'general',
        speed: 'fast',
        cost: 'free'
    },
    'cf-llama-3.3-70b': {
        name: 'Llama 3.3 70B (Advanced)',
        provider: 'Cloudflare',
        endpoint: 'cloudflare-ai',
        model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        parameters: { temperature: 0.7, max_tokens: 2000 },
        category: 'advanced',
        speed: 'medium',
        cost: 'free'
    },
    'cf-qwen-coder': {
        name: 'Qwen Coder 32B (Programming)',
        provider: 'Cloudflare',
        endpoint: 'cloudflare-ai',
        model: '@cf/qwen/qwen2.5-coder-32b-instruct',
        parameters: { temperature: 0.3, max_tokens: 1500 },
        category: 'code',
        speed: 'medium',
        cost: 'free'
    },
    'cf-deepseek-math': {
        name: 'DeepSeek Math 7B (Mathematics)',
        provider: 'Cloudflare',
        endpoint: 'cloudflare-ai',
        model: '@cf/deepseek-ai/deepseek-math-7b-instruct',
        parameters: { temperature: 0.3, max_tokens: 1000 },
        category: 'math',
        speed: 'fast',
        cost: 'free'
    },
    'cf-llama-vision': {
        name: 'Llama Vision 11B (Image+Text)',
        provider: 'Cloudflare',
        endpoint: 'cloudflare-ai',
        model: '@cf/meta/llama-3.2-11b-vision-instruct',
        parameters: { temperature: 0.7, max_tokens: 1000 },
        category: 'vision',
        speed: 'medium',
        cost: 'free'
    },
    'cf-qwen-fast': {
        name: 'Qwen 0.5B (Ultra Fast)',
        provider: 'Cloudflare',
        endpoint: 'cloudflare-ai',
        model: '@cf/qwen/qwen1.5-0.5b-chat',
        parameters: { temperature: 0.7, max_tokens: 500 },
        category: 'fast',
        speed: 'ultra-fast',
        cost: 'free'
    },
    'cf-mistral-small': {
        name: 'Mistral Small 24B (Precise)',
        provider: 'Cloudflare',
        endpoint: 'cloudflare-ai',
        model: '@cf/mistralai/mistral-small-3.1-24b-instruct',
        parameters: { temperature: 0.5, max_tokens: 1200 },
        category: 'precise',
        speed: 'medium',
        cost: 'free'
    },
    'cf-flux-schnell': {
        name: 'Flux Schnell (Image Generation)',
        provider: 'Cloudflare',
        endpoint: 'cloudflare-ai',
        model: '@cf/black-forest-labs/flux-1-schnell',
        parameters: { steps: 4 },
        category: 'image',
        speed: 'fast',
        cost: 'free'
    },
    'cf-gemma-3-12b': {
        name: 'Gemma 3 12B IT (Polish Chat)',
        provider: 'Cloudflare',
        endpoint: 'cloudflare-ai',
        model: '@cf/google/gemma-3-12b-it',
        parameters: {
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 0.9
        },
        category: 'chat',
        speed: 'medium',
        cost: 'free',
        language: 'polish'
    },
    // External API Models (Require API keys)
    'gpt-3.5-turbo': {
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        parameters: { temperature: 0.7, max_tokens: 1000 },
        category: 'external',
        speed: 'fast',
        cost: 'paid'
    },
    'gpt-4': {
        name: 'GPT-4',
        provider: 'OpenAI',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4',
        parameters: { temperature: 0.7, max_tokens: 1500 },
        category: 'external',
        speed: 'medium',
        cost: 'paid'
    },
    'claude-3-haiku': {
        name: 'Claude 3 Haiku',
        provider: 'Anthropic',
        endpoint: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-haiku-20240307',
        parameters: { temperature: 0.7, max_tokens: 1000 },
        category: 'external',
        speed: 'fast',
        cost: 'paid'
    }
};
exports.default = {
    fetch: function (request, env) {
        return __awaiter(this, void 0, void 0, function () {
            var corsHeaders, url, path, modelsConfig, selectedModel, systemPrompt, uploadedFiles, models, model, _a, model, prompt_1, modelConfig, testPrompt, response, error_1, system_prompt, error_2;
            var _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        corsHeaders = {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        };
                        if (request.method === 'OPTIONS') {
                            return [2 /*return*/, new Response(null, { headers: corsHeaders })];
                        }
                        url = new URL(request.url);
                        path = url.pathname;
                        _h.label = 1;
                    case 1:
                        _h.trys.push([1, 20, , 21]);
                        if (!(request.method === 'GET' && path === '/api/models')) return [3 /*break*/, 6];
                        return [4 /*yield*/, ((_b = env.AI_MODELS) === null || _b === void 0 ? void 0 : _b.get('models_config', { type: 'json' }))];
                    case 2:
                        modelsConfig = _h.sent();
                        return [4 /*yield*/, ((_c = env.AI_MODELS) === null || _c === void 0 ? void 0 : _c.get('selected_model'))];
                    case 3:
                        selectedModel = (_h.sent()) || 'cf-gemma-3-12b';
                        return [4 /*yield*/, ((_d = env.AI_MODELS) === null || _d === void 0 ? void 0 : _d.get('system_prompt'))];
                    case 4:
                        systemPrompt = (_h.sent()) || 'Jesteœ zaawansowanym asystentem AI dla MyBonzo - firmy specjalizuj¹cej siê w projektowaniu graficznym i nowoczesnych rozwi¹zaniach AI. Odpowiadaj po polsku, b¹dŸ kreatywny i pomocny.';
                        return [4 /*yield*/, ((_e = env.AI_FILES) === null || _e === void 0 ? void 0 : _e.get('uploaded_files', { type: 'json' }))];
                    case 5:
                        uploadedFiles = (_h.sent()) || [];
                        models = (modelsConfig === null || modelsConfig === void 0 ? void 0 : modelsConfig.models) || ENHANCED_AI_MODELS;
                        return [2 /*return*/, new Response(JSON.stringify({
                                models: models,
                                selected_model: selectedModel,
                                default_model: 'cf-llama-3.1-8b',
                                system_prompt: systemPrompt,
                                uploaded_files: uploadedFiles,
                                model_categories: {
                                    general: 'Ogólne zastosowanie',
                                    advanced: 'Zaawansowane zadania',
                                    code: 'Programowanie',
                                    math: 'Matematyka',
                                    vision: 'Analiza obrazów',
                                    fast: 'Szybkie odpowiedzi',
                                    precise: 'Precyzyjne zadania',
                                    image: 'Generowanie obrazów',
                                    external: 'Zewnêtrzne API'
                                },
                                features: {
                                    cloudflare_ai: true,
                                    external_apis: true,
                                    image_generation: true,
                                    vision_support: true,
                                    file_upload: true,
                                    multi_language: true
                                }
                            }), {
                                headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                            })];
                    case 6:
                        if (!(request.method === 'POST' && path === '/api/models/select')) return [3 /*break*/, 9];
                        return [4 /*yield*/, request.json()];
                    case 7:
                        model = (_h.sent()).model;
                        if (!model) {
                            return [2 /*return*/, new Response(JSON.stringify({
                                    success: false,
                                    error: 'Model is required'
                                }), {
                                    status: 400,
                                    headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                                })];
                        }
                        // Validate model exists
                        if (!ENHANCED_AI_MODELS[model]) {
                            return [2 /*return*/, new Response(JSON.stringify({
                                    success: false,
                                    error: 'Invalid model selected'
                                }), {
                                    status: 400,
                                    headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                                })];
                        }
                        return [4 /*yield*/, ((_f = env.AI_MODELS) === null || _f === void 0 ? void 0 : _f.put('selected_model', model))];
                    case 8:
                        _h.sent();
                        return [2 /*return*/, new Response(JSON.stringify({
                                success: true,
                                selected_model: model,
                                model_info: ENHANCED_AI_MODELS[model]
                            }), {
                                headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                            })];
                    case 9:
                        if (!(request.method === 'POST' && path === '/api/models/test')) return [3 /*break*/, 16];
                        return [4 /*yield*/, request.json()];
                    case 10:
                        _a = _h.sent(), model = _a.model, prompt_1 = _a.prompt;
                        if (!model || !ENHANCED_AI_MODELS[model]) {
                            return [2 /*return*/, new Response(JSON.stringify({
                                    success: false,
                                    error: 'Valid model is required'
                                }), {
                                    status: 400,
                                    headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                                })];
                        }
                        modelConfig = ENHANCED_AI_MODELS[model];
                        testPrompt = prompt_1 || 'Napisz krótkie powitanie dla u¿ytkowników MyBonzo.';
                        _h.label = 11;
                    case 11:
                        _h.trys.push([11, 15, , 16]);
                        if (!(modelConfig.endpoint === 'cloudflare-ai')) return [3 /*break*/, 13];
                        return [4 /*yield*/, env.AI.run(modelConfig.model, __assign({ messages: [{ role: 'user', content: testPrompt }] }, modelConfig.parameters))];
                    case 12:
                        response = _h.sent();
                        return [2 /*return*/, new Response(JSON.stringify({
                                success: true,
                                model: model,
                                response: response.response || response,
                                latency: 'Available on next test',
                                provider: 'Cloudflare AI'
                            }), {
                                headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                            })];
                    case 13: 
                    // For external APIs, return mock response (would need API keys for real test)
                    return [2 /*return*/, new Response(JSON.stringify({
                            success: true,
                            model: model,
                            response: 'Test model ready (requires API key for full functionality)',
                            latency: 'N/A',
                            provider: modelConfig.provider
                        }), {
                            headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                        })];
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        error_1 = _h.sent();
                        return [2 /*return*/, new Response(JSON.stringify({
                                success: false,
                                error: 'Model test failed',
                                details: error_1 instanceof Error ? error_1.message : 'Unknown error'
                            }), {
                                status: 500,
                                headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                            })];
                    case 16:
                        if (!(request.method === 'POST' && path === '/api/models/system-prompt')) return [3 /*break*/, 19];
                        return [4 /*yield*/, request.json()];
                    case 17:
                        system_prompt = (_h.sent()).system_prompt;
                        if (!system_prompt || !system_prompt.trim()) {
                            return [2 /*return*/, new Response(JSON.stringify({
                                    success: false,
                                    error: 'System prompt is required'
                                }), {
                                    status: 400,
                                    headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                                })];
                        }
                        return [4 /*yield*/, ((_g = env.AI_MODELS) === null || _g === void 0 ? void 0 : _g.put('system_prompt', system_prompt.trim()))];
                    case 18:
                        _h.sent();
                        return [2 /*return*/, new Response(JSON.stringify({
                                success: true,
                                message: 'System prompt saved'
                            }), {
                                headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                            })];
                    case 19: return [2 /*return*/, new Response(JSON.stringify({
                            success: false,
                            error: 'Endpoint not found'
                        }), {
                            status: 404,
                            headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                        })];
                    case 20:
                        error_2 = _h.sent();
                        console.error('Enhanced Models API Error:', error_2);
                        return [2 /*return*/, new Response(JSON.stringify({
                                success: false,
                                error: 'Internal server error',
                                details: error_2 instanceof Error ? error_2.message : 'Unknown error'
                            }), {
                                status: 500,
                                headers: __assign(__assign({}, corsHeaders), { 'Content-Type': 'application/json' })
                            })];
                    case 21: return [2 /*return*/];
                }
            });
        });
    }
};

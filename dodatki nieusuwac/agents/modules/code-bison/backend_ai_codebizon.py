from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI()

class VisionReq(BaseModel):
    image_url: str

class DoodleReq(BaseModel):
    prompt: str

class PaLMReq(BaseModel):
    prompt: str

class iCodeReq(BaseModel):
    code_task: str

class CodeBizonReq(BaseModel):
    flow_type: str
    spec: str

@app.post("/api/gemini-vision")
async def gemini_vision(req: VisionReq):
    return {"response": f"Gemini Vision analysis: {req.image_url}"}

@app.post("/api/doodlebart")
async def doodlebart(req: DoodleReq):
    return {"response": f"DoodleBart result for: {req.prompt}"}

@app.post("/api/palm")
async def palm(req: PaLMReq):
    return {"response": f"PaLM result for: {req.prompt}"}

@app.post("/api/icode-bizon")
async def icode_bizon(req: iCodeReq):
    return {"response": f"iCode Bizon generated code for: {req.code_task}"}

@app.post("/api/codebizon")
async def codebizon(req: CodeBizonReq):
    return {"response": f"CodeBizon generated code for {req.flow_type}, spec: {req.spec[:40]}"}
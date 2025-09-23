import{d as r}from"./decorators.serialization.DTWIlLMH.js";import"./helperFunctions.BBD6oZAl.js";import"./math.vector.C8FsJn6B.js";import"./math.color.BvxHr_bk.js";import"./preload-helper.BlTxHScW.js";const e="rgbdDecodePixelShader",o=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=vec4(fromRGBD(texture2D(textureSampler,vUV)),1.0);}`;r.ShadersStore[e]||(r.ShadersStore[e]=o);const S={name:e,shader:o};export{S as rgbdDecodePixelShader};

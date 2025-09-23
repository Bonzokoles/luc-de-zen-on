import{d as r}from"./decorators.serialization.DTWIlLMH.js";import"./math.vector.C8FsJn6B.js";import"./math.color.BvxHr_bk.js";import"./preload-helper.BlTxHScW.js";const e="passPixelShader",t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);}`;r.ShadersStoreWGSL[e]||(r.ShadersStoreWGSL[e]=t);const n={name:e,shader:t};export{n as passPixelShaderWGSL};

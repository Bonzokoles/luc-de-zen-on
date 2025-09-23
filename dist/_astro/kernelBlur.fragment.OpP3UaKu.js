import{d as e}from"./decorators.serialization.DTWIlLMH.js";import"./kernelBlurVaryingDeclaration.CEgJIZLi.js";import"./scene.C9ljXyY7.js";import"./math.vector.C8FsJn6B.js";import"./math.color.BvxHr_bk.js";import"./preload-helper.BlTxHScW.js";import"./tools.kgQOdK5j.js";import"./instantiationTools.DpJ04vA6.js";import"./smartArray.BsIpkRz3.js";import"./light.Tpw1S7gS.js";import"./node.B7U3vf9R.js";import"./postProcess.BhJOrjOy.js";import"./texture.DcuyhkEj.js";import"./baseTexture.xJCKUhPX.js";import"./math.size.F3xmSqZc.js";import"./math.plane.DogzNArm.js";import"./engine.Bhq7AZzW.js";import"./math.axis.BWIUWoG3.js";import"./math.path.Rz-CSHk9.js";import"./math.viewport.CgkTt1RS.js";import"./camera.DMMowNsy.js";import"./math.frustum.0quBJc8n.js";const r="kernelBlurFragment",l=`#ifdef DOF
factor=sampleCoC(sampleCoord{X}); 
computedWeight=KERNEL_WEIGHT{X}*factor;sumOfWeights+=computedWeight;
#else
computedWeight=KERNEL_WEIGHT{X};
#endif
#ifdef PACKEDFLOAT
blend+=unpack(texture2D(textureSampler,sampleCoord{X}))*computedWeight;
#else
blend+=texture2D(textureSampler,sampleCoord{X})*computedWeight;
#endif
`;e.IncludesShadersStore[r]||(e.IncludesShadersStore[r]=l);const o="kernelBlurFragment2",n=`#ifdef DOF
factor=sampleCoC(sampleCenter+delta*KERNEL_DEP_OFFSET{X});computedWeight=KERNEL_DEP_WEIGHT{X}*factor;sumOfWeights+=computedWeight;
#else
computedWeight=KERNEL_DEP_WEIGHT{X};
#endif
#ifdef PACKEDFLOAT
blend+=unpack(texture2D(textureSampler,sampleCenter+delta*KERNEL_DEP_OFFSET{X}))*computedWeight;
#else
blend+=texture2D(textureSampler,sampleCenter+delta*KERNEL_DEP_OFFSET{X})*computedWeight;
#endif
`;e.IncludesShadersStore[o]||(e.IncludesShadersStore[o]=n);const t="kernelBlurPixelShader",i=`uniform sampler2D textureSampler;uniform vec2 delta;varying vec2 sampleCenter;
#ifdef DOF
uniform sampler2D circleOfConfusionSampler;float sampleCoC(in vec2 offset) {float coc=texture2D(circleOfConfusionSampler,offset).r;return coc; }
#endif
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#ifdef PACKEDFLOAT
#include<packingFunctions>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{float computedWeight=0.0;
#ifdef PACKEDFLOAT
float blend=0.;
#else
vec4 blend=vec4(0.);
#endif
#ifdef DOF
float sumOfWeights=CENTER_WEIGHT; 
float factor=0.0;
#ifdef PACKEDFLOAT
blend+=unpack(texture2D(textureSampler,sampleCenter))*CENTER_WEIGHT;
#else
blend+=texture2D(textureSampler,sampleCenter)*CENTER_WEIGHT;
#endif
#endif
#include<kernelBlurFragment>[0..varyingCount]
#include<kernelBlurFragment2>[0..depCount]
#ifdef PACKEDFLOAT
gl_FragColor=pack(blend);
#else
gl_FragColor=blend;
#endif
#ifdef DOF
gl_FragColor/=sumOfWeights;
#endif
}`;e.ShadersStore[t]||(e.ShadersStore[t]=i);const K={name:t,shader:i};export{K as kernelBlurPixelShader};

import{d as r}from"./decorators.serialization.DTWIlLMH.js";import"./scene.C9ljXyY7.js";import"./fogFragment.D5dYZ8g-.js";import"./math.vector.C8FsJn6B.js";import"./math.color.BvxHr_bk.js";import"./preload-helper.BlTxHScW.js";import"./tools.kgQOdK5j.js";import"./instantiationTools.DpJ04vA6.js";import"./smartArray.BsIpkRz3.js";import"./light.Tpw1S7gS.js";import"./node.B7U3vf9R.js";import"./postProcess.BhJOrjOy.js";import"./texture.DcuyhkEj.js";import"./baseTexture.xJCKUhPX.js";import"./math.size.F3xmSqZc.js";import"./math.plane.DogzNArm.js";import"./engine.Bhq7AZzW.js";import"./math.axis.BWIUWoG3.js";import"./math.path.Rz-CSHk9.js";import"./math.viewport.CgkTt1RS.js";import"./camera.DMMowNsy.js";import"./math.frustum.0quBJc8n.js";const o="colorPixelShader",e=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
#define VERTEXCOLOR
varying vec4 vColor;
#else
uniform vec4 color;
#endif
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
gl_FragColor=vColor;
#else
gl_FragColor=color;
#endif
#include<fogFragment>(color,gl_FragColor)
#define CUSTOM_FRAGMENT_MAIN_END
}`;r.ShadersStore[o]||(r.ShadersStore[o]=e);const A={name:o,shader:e};export{A as colorPixelShader};

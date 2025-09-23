import{d as i}from"./decorators.serialization.DTWIlLMH.js";import"./scene.C9ljXyY7.js";import"./vertexColorMixing.nMCjc42t.js";import"./math.vector.C8FsJn6B.js";import"./math.color.BvxHr_bk.js";import"./preload-helper.BlTxHScW.js";import"./tools.kgQOdK5j.js";import"./instantiationTools.DpJ04vA6.js";import"./smartArray.BsIpkRz3.js";import"./light.Tpw1S7gS.js";import"./node.B7U3vf9R.js";import"./postProcess.BhJOrjOy.js";import"./texture.DcuyhkEj.js";import"./baseTexture.xJCKUhPX.js";import"./math.size.F3xmSqZc.js";import"./math.plane.DogzNArm.js";import"./engine.Bhq7AZzW.js";import"./math.axis.BWIUWoG3.js";import"./math.path.Rz-CSHk9.js";import"./math.viewport.CgkTt1RS.js";import"./camera.DMMowNsy.js";import"./math.frustum.0quBJc8n.js";const e="colorVertexShader",o=`attribute vec3 position;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform mat4 view;
#endif
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
vec4 colorUpdated=color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}
#else
gl_Position=viewProjection*worldPos;
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`;i.ShadersStore[e]||(i.ShadersStore[e]=o);const _={name:e,shader:o};export{_ as colorVertexShader};

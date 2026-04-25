import{t as e}from"./shaderStore-EocWwLxt.js";import"./sceneUboDeclaration-DhcZQr4n.js";import"./meshUboDeclaration-D49LmKgc.js";var t=`volumetricLightingRenderVolumeVertexShader`,n=`#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute position : vec3f;varying vWorldPos: vec4f;@vertex
fn main(input : VertexInputs)->FragmentInputs {let worldPos=mesh.world*vec4f(vertexInputs.position,1.0);vertexOutputs.vWorldPos=worldPos;vertexOutputs.position=scene.viewProjection*worldPos;}
`;e.ShadersStoreWGSL[t]||(e.ShadersStoreWGSL[t]=n);var r={name:t,shader:n};export{r as volumetricLightingRenderVolumeVertexShaderWGSL};
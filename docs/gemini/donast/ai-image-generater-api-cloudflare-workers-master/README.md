## 🚀 Deploy to Cloudflare Workers

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/SudoR2spr/ai-image-generater-api-cloudflare-workers)

Click the button above to deploy this project directly to Cloudflare Workers!

## 📖 Deploy Guide

[![Deploy Guide](https://img.shields.io/badge/📖_Deploy_Guide-000000?style=for-the-badge&logo=github&logoColor=white)](https://filestream-code-generater.pages.dev/ai-api-guide)

# 🚀 AI Image Generator API (Cloudflare Workers)

We have developed this powerful **AI Image Generator API**, hosted on **Cloudflare Workers**, leveraging **Hugging Face** models for seamless image creation.  
With this API, you can generate high-quality images using a variety of **Stable Diffusion** and **AI Models**.

---

## 🏷 Models Used  

| 🔥 Model Name         | 📌 Model Path |
|----------------------|--------------------------------------------|
| **Realistic Vision** | `SG161222/Realistic_Vision_V5.1_noVAE` |
| **DreamShaper**      | `Lykon/DreamShaper-v7`                   |
| **SDXL**            | `stabilityai/stable-diffusion-xl-base-1.0` |
| **Deliberate**       | `XpucT/Deliberate`                        |
| **Anything V5**      | `stabilityai/stable-diffusion-2-1`        |
| **Protogen**         | `darkstorm2150/Protogen_x5.8`             |
| **Flux**            | `black-forest-labs/FLUX.1-dev`            |

---

# 🚀 AI Image Generator - Deploy Guide  

This repository provides an AI Image Generator API powered by **Cloudflare Workers** and **Hugging Face Models**. Follow the steps below to deploy it using **GitHub Actions**.  

---

## 📌 Deployment via GitHub Actions  

| Step | Description |
|------|------------|
| **✅ 1. Add GitHub Secrets** | Go to your repository **Settings → Secrets and Variables → Actions** and add the following secrets: |
| **🔹 CLOUDFLARE_API_TOKEN** | Your Cloudflare API Token (Required for deployment) |
| **🔹 HUGGINGFACE_TOKEN** | Your Hugging Face API Key (Required for generating images) |

---

## 🚀 How to Deploy  

| Action | Steps |
|--------|-------|
| **Automatic Deployment** | Deployment happens **automatically** when you push changes to the **master** branch. |
| **Manual Deployment** | 1️⃣ Go to **GitHub Actions** → Select **Deploy to Cloudflare Workers** workflow <br> 2️⃣ Click **Run Workflow** |

✅ **Your Worker will be live on Cloudflare!** 🎉  

---

## 📌 Need Help?  

| Command | Description |
|---------|------------|
| `wrangler tail` | Check Cloudflare Worker logs |
| [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/) | Official Cloudflare Workers documentation |

## 🎯 How to Use

This API utilizes **Hugging Face Inference API** to generate AI-powered images.  
By passing **URL Parameters**, you can specify:

✅ **Prompt** – The text description for the image  
✅ **Model Name** – Select from the available AI models  
✅ **Image Size** – Define the resolution of the generated image  

🚀 **Simple & Fast – Ready to integrate into your projects!**

---

## 🔗 Official Hugging Face API

[![Hugging Face API](https://img.shields.io/badge/Huggingface_API-FEA47F?style=for-the-badge&logo=huggingface&logoColor=white)](https://api-inference.huggingface.co/)

📌 **Explore the API in detail at the official Hugging Face platform.**  

---

## 👨‍💻 Developed By  

**WOODcraft** – [Telegram](https://t.me/Farooq_is_king)  

🔥 **Join for Updates & Support!**


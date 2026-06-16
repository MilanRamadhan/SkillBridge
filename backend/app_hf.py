import os
import threading
import uvicorn
import gradio as gr
from app import app  # Mengambil instance FastAPI dari file app.py Anda

# Fungsi untuk menjalankan FastAPI di latar belakang (Background Thread)
def run_fastapi():
    # Hugging Face Spaces mendengarkan port 7860 secara default
    uvicorn.run(app, host="0.0.0.0", port=7860)

if __name__ == "__main__":
    print("Mengaktifkan Backend AI SkillBridge...")

    # Kita buat interface kosong sederhana untuk tampilan depan Hugging Face
    with gr.Blocks() as demo:
        gr.Markdown("# 🎯 SkillBridge AI Backend Server")
        gr.Markdown("Server sedang berjalan dengan lancar. API siap menerima request dari Next.js frontend.")

    # Jalankan server FastAPI Anda di port 7860
    uvicorn.run(app, host="0.0.0.0", port=7860)
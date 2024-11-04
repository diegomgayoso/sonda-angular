from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import fitz  # PyMuPDF
import numpy as np
from io import BytesIO
from PIL import Image
import cv2
import pytesseract
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
import nltk
import unicodedata
from gensim.models import KeyedVectors
from pymilvus import Collection, connections
import os
import json
from textblob import TextBlob

# Inicializando a aplicação FastAPI
app = FastAPI()

# Configurações e inicializações
nltk.download('stopwords')
nltk.download('punkt')
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'

# Carregando o modelo Word2Vec
if os.path.isfile("w2v.vectors.kv"):
    modelo_w2v = KeyedVectors.load("w2v.vectors.kv", mmap='r')
else:
    modelo_w2v = None

# Funções auxiliares
def ler_pdf_edital(arquivo_pdf):
    try:
        documento = fitz.open(stream=arquivo_pdf, filetype="pdf")
        texto_completo = ""
        for pagina_num in range(len(documento)):
            pagina = documento.load_page(pagina_num)
            texto = pagina.get_text()

            if texto.strip():
                texto_completo += texto + "\n"
            else:
                imagens = pagina.get_images(full=True)
                for imagem in imagens:
                    xref = imagem[0]
                    base_imagem = documento.extract_image(xref)
                    imagem_bytes = base_imagem["image"]
                    imagem_pil = Image.open(BytesIO(imagem_bytes))
                    imagem_cv = cv2.cvtColor(np.array(imagem_pil), cv2.COLOR_RGB2BGR)
                    texto_imagem = pytesseract.image_to_string(imagem_cv, lang='por')
                    texto_completo += texto_imagem + "\n"
        return texto_completo
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao ler o PDF: {str(e)}")

@app.post("/processar_pdf/")
async def processar_pdf(file: UploadFile = File(...)):
    try:
        arquivo_pdf_decodificado = await file.read()
        texto_edital = ler_pdf_edital(arquivo_pdf_decodificado)
        if not texto_edital.strip():
            raise HTTPException(status_code=400, detail="O PDF está vazio ou não contém texto.")
        
        # Processamento do texto
        tokens = preprocessar_texto(texto_edital)
        texto_preprocessado = ' '.join(tokens)
        tfidf_scores = calcular_tfidf(texto_preprocessado)
        tfidf_total = sum(tfidf_scores.values())
        vetores_ponderados = [ponderar_vetor(obter_vetor_word2vec(palavra), tfidf) for palavra, tfidf in tfidf_scores.items()]
        vetor_somado = somar_vetores(vetores_ponderados)
        vetor_final = vetor_somado / tfidf_total if tfidf_total != 0 else vetor_somado

        atestados_semelhantes = buscar_atestados_semelhantes(vetor_final)

        # Retorna os resultados diretamente para o front-end
        return {"atestados_semelhantes": atestados_semelhantes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

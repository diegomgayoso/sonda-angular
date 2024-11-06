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

def substituir_hifen_barras(texto):
    return texto.replace('-', ' ').replace('/', ' ').replace('—', ' ')

def remover_acentuacao(texto):
    substituicoes = {
        'á': 'a', 'à': 'a', 'ã': 'ã', 'â': 'a', 'ä': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
        'ó': 'o', 'ò': 'o', 'õ': 'õ', 'ô': 'o', 'ö': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'ç'  # Mantém o 'ç'
    }
    for acentuado, normal in substituicoes.items():
        texto = texto.replace(acentuado, normal)
    return texto

def remover_caracteres_especiais(texto):
    caracteres_para_remover = ".,“”"  # Já removemos '-' e '/' na função anterior
    texto = ''.join(c for c in texto if c not in caracteres_para_remover)
    return texto

def preprocessar_texto(texto):
    texto = substituir_hifen_barras(texto)
    blob = TextBlob(texto)
    tokens = blob.words
    tokens = [token for token in tokens if token.strip()]
    
    stop_words = set(stopwords.words('portuguese'))
    tokens_sem_stopwords = [word for word in tokens if word.lower() not in stop_words]
    tokens_normalizados = [remover_acentuacao(word.strip().lower()) for word in tokens_sem_stopwords]
    tokens_normalizados = [token for token in tokens_normalizados if token.strip()]
    
    return tokens_normalizados

# Função para calcular TF-IDF
def calcular_tfidf(texto):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([texto])
    feature_names = vectorizer.get_feature_names_out()
    tfidf_scores = dict(zip(feature_names, tfidf_matrix.toarray()[0]))
    return tfidf_scores

# Função para obter o vetor Word2Vec
def obter_vetor_word2vec(palavra):
    if palavra in modelo_w2v:
        return modelo_w2v[palavra]
    else:
        return np.random.normal(size=modelo_w2v.vector_size)  # Vetor aleatório se a palavra não for encontrada

# Função para ponderar o vetor Word2Vec pelo TF-IDF
def ponderar_vetor(vetor, tfidf):
    return vetor * tfidf

# Função para somar os vetores ponderados
def somar_vetores(vetores_ponderados):
    return np.sum(vetores_ponderados, axis=0)

# Função para conectar ao Milvus e carregar a coleção existente
def conectar_milvus():
    connections.connect(alias="milvus-cloud-Matheus",
            host="milvus-dev.r5projetos.com.br",
            port="443",
            user="root",
            password="jooG3wei",
            secure=True)  # Ajuste o host e a porta
    collection = Collection("novos_vetores_Matheus", using="milvus-cloud-Matheus")
    collection.load()  # Carrega a coleção diretamente
    return collection

def buscar_atestados_semelhantes(vetor_consulta):
    # Conectar ao Milvus
    collection = conectar_milvus()
    
    # Realizar a busca dos 5 atestados mais semelhantes
    search_params = {"metric_type": "L2", "params": {"nprobe": 10}}
    results = collection.search([vetor_consulta], anns_field="vetor", param=search_params, limit=5)

    # Extrair os resultados e montar as URLs
    url_base = "https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/zBVe3GqOo6I0SZaM5mO5bCTy_DV2mahP8AYG9xWXyLuGN3qegkToBDXmzf6HEy89/n/grnrirarq6gh/b/bucket-s3/o/"
    atestados_semelhantes = [
        {"url": f"{url_base}{result.id}"} for result in results[0]
    ]

    return atestados_semelhantes

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

        # Retorna as URLs diretamente para o front-end
        return {"atestados_semelhantes": atestados_semelhantes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

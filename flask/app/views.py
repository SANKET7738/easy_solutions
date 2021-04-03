from app import app
from flask import render_template, request, redirect
import os
import nltk.data
from PIL import Image
import pytesseract
import re 
from newspaper import Article
from googlesearch import search
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
nltk.download('punkt')

app.config["IMAGE_UPLOADS"] = r'D:\easy_solutions\flask\app\static\img\uploads'

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        if request.files :
            image = request.files["image"]
            print(image)
            image.save(os.path.join(app.config["IMAGE_UPLOADS"], image.filename))
            args = { "image": image }
            return get_image(args)

    return render_template("index.html")


def google_search(query):
    search_urls = []
    for i in search(query, tld='com',num= 1, start= 1, stop= 1):
        try:
            search_urls.append(i)
        except Exception as e:
            print(e)
            search_urls.append('')

    return search_urls


def scrape(url):
    article = Article(url)
    article.download()
    article.parse()
    article.nlp()
    text = article.text

    return text

questions = []
@app.route("/get-image", methods=["GET", "POST"])
def get_image(args):
    print(request)
    img = args["image"]
    print(img.filename)
    img = Image.open(os.path.join(app.config["IMAGE_UPLOADS"], img.filename))
    text = pytesseract.image_to_string(img, lang="eng")
    tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
    tokenized_text = '\n \n'.join(tokenizer.tokenize(text))
    sentences = tokenized_text.split('\n \n')
    for i in range(len(sentences)):
        if(sentences[i].endswith('?') or  sentences[i].startswith("What") or sentences[i].startswith("When") or sentences[i].startswith("How") or sentences[i].startswith("Why") or sentences[i].startswith("Describe") or sentences[i].startswith("Explain")):
            questions.append(sentences[i])
            print(sentences[i])
    # Questions = questions
    

    return render_template("image.html", questions=questions)


@app.route('/answers')
def answers():
    search_querys = []
    for i in range(len(questions)):
        query = questions[i]
        output = google_search(query)
        print(output[0])
        search_querys.append(output[0])

    solutions = {}
    for i in range(len(search_querys)):
        keys = questions[i]
        try:
            answers = scrape(search_querys[i][0])
        except Exception as e:
            print(e)
            answers = ''
        values = answers
        solutions[keys] = values
    for x,y in solutions.items():
            print('\n******************\n')
            print(x)
            print('\n answer = \n')
            print(y)
            print('\n******************\n')
        
    return render_template('answers.html')
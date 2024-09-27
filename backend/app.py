from flask import Flask, jsonify
from flask_cors import CORS
from scrapers import scrape_abs_cbn, scrape_gma, scrape_manila_times

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# ABS-CBN News Route
@app.route('/api/abs-cbn', methods=['GET'])
def get_news_abs_cbn():
    abs_cbn_news = scrape_abs_cbn()  # Call the scraping function
    return jsonify(abs_cbn_news)  # Return the scraped news as JSON

# Other routes for GMA, Manila Times, etc.
@app.route('/api/gma', methods=['GET'])
def get_news_gma():
    gma_news = scrape_gma()  # Call the scraping function
    return jsonify(gma_news)  # Return the scraped news as JSON

@app.route('/api/manila-times', methods=['GET'])
def get_news_manila_times():
    manila_times_news = scrape_manila_times()
    return jsonify(manila_times_news)

@app.route('/api/philstar', methods=['GET'])
def get_news_philstar():
    pass

@app.route('/api/rappler', methods=['GET'])
def get_news_rappler():
    pass

if __name__ == "__main__":
    app.run(debug=True)

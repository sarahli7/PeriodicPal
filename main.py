from dotenv import load_dotenv
import os
import google.generativeai as genai
import json
from flask import Flask, render_template, request, jsonify

# Initialize Flask app
app = Flask(__name__)

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv('API_KEY')
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

# Define the prompt template
PROMPT = """
Given the following 2 compounds return the following in the format:
{
"newcompound": "Compound created if they bonded together",
"reactiontype": "The type of reaction that would occur to bond them together",
"description": "A description of what the compound made actually is and a fun fact if possible about the compound"
}
"""

@app.route("/")
def main():
    return render_template("index.html")

@app.route("/search", methods=["POST"])
def search():
    try:
        data = request.json
        compound1 = data.get('compound1')
        compound2 = data.get('compound2')
        result = generate_compound(compound1.strip(), compound2.strip())
        
        if isinstance(result, str):  # If the result is an error message
            return jsonify({"error": result}), 500

        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_compound(compound1: str, compound2: str):
    try:
        # Generate content using the model
        string = f"{compound1} and {compound2}"
        response = model.generate_content([PROMPT, string])

        # Log the full response for debugging
        

        # Check if response.text is valid
        if not response.text:
            return "Error: No valid response from model"

        # Remove leading 'json' if it exists
        if response.text.startswith('json'):
            # Strip the 'json' prefix and any surrounding whitespace
            json_text = response.text[len('json'):].strip()
        else:
            json_text = response.text.strip()
        print("Response Text:", json_text)

        # Attempt to parse the JSON response
        try:
            info = json.loads(json_text)
        except json.JSONDecodeError:
            return "Error: Response is not valid JSON"

        if not info:
            return "Error: Empty response from model"

        return info
    
    except Exception as e:

        print("Exception:", str(e))
        return f"Error occurred: {str(e)}"


if __name__ == '__main__':
    app.run(debug=True)

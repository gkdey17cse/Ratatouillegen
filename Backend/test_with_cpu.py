from flask import Flask, request, jsonify
import requests
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch
from transformers import AutoModelWithLMHead, AutoTokenizer
import pandas as pd
import random
import re
import os
import math
import torch
import random
import numpy as np
import pandas as pd
from tqdm import trange
import json
import torch.nn.functional as F
import matplotlib.pyplot as plt
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from transformers import AutoTokenizer, AutoModelWithLMHead
import re
import os
import math
import torch
import random
import numpy as np
import pandas as pd
from tqdm import trange
import torch.nn.functional as F
import matplotlib.pyplot as plt
# from transformers import GPT2LMHeadModel, GPT2Tokenizer
from transformers import AutoTokenizer, AutoModelWithLMHead
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    AutoTokenizer,
    TrainingArguments,
    pipeline,
    DataCollator,
    DataCollatorForLanguageModeling,
    # LlamaModel
)


from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# os.environ["CUDA_VISIBLE_DEVICES"] = "0"
# os.environ["CUDA_LAUNCH_BLOCKING"] = "0"


# Add a middleware function to handle CORS headers
@app.after_request
def after_request(response):
    # Get the value of the 'Origin' header from the request
    origin = request.headers.get("Origin")
    # Set the 'Access-Control-Allow-Origin' header to the value of the 'Origin' header
    response.headers.add("Access-Control-Allow-Origin", origin)
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


def fetch_ingredients_from_region(region, file_name):
    # Load the CSV with correct encoding
    table = pd.read_csv(file_name, encoding="utf-8")

    # Check if 'region' column exists
    if "region" not in table.columns:
        raise KeyError(
            f"Column 'region' not found in {file_name}. Available columns: {table.columns}"
        )

    # Filter data based on region
    table = table[table["region"] == region]

    # Fix column name: Use 'ID' instead of 'Recipe_id'
    if "ID" not in table.columns:
        raise KeyError(
            f"Column 'ID' not found in {file_name}. Available columns: {table.columns}"
        )

    recipe_ingredient_table = table[
        ["ID", "NER"]
    ].copy()  # ✅ Use 'ID' instead of 'Recipe_id'

    result = recipe_ingredient_table.groupby("ID")["NER"].apply(list).to_dict()
    keys = list(result.keys())
    values = list(result.values())

    # Flatten values
    flattened_values = [item for sublist in values for item in sublist]

    # Convert to DataFrame and extract unique ingredients
    recipe_ingredient_table = pd.DataFrame({"NER": flattened_values})
    recipe_ingredient_table_unique = (
        recipe_ingredient_table["NER"]
        .str.split(", ", expand=True)
        .stack()
        .reset_index(level=1, drop=True)
        .reset_index(name="NER")
    )

    ingredients_list = sorted(recipe_ingredient_table_unique["NER"].unique().tolist())
    ingredients_json = json.dumps(ingredients_list)

    return ingredients_json


def get_substring_between_words(sentence, word1, word2):
    index_word1 = sentence.find(word1)
    index_word2 = sentence.find(word2)

    if index_word1 == -1 or index_word2 == -1:
        return "One or both of the words not found in the sentence."

    start_index = min(index_word1, index_word2) + len(word1)
    end_index = max(index_word1, index_word2)

    substring = sentence[start_index:end_index].strip()
    return substring


def set_seed(seed):
    np.random.seed(seed)
    torch.manual_seed(seed)


def top_k_top_p_filtering(logits, top_k=0, top_p=0.0, filter_value=-float("Inf")):
    """Filter a distribution of logits using top-k and/or nucleus (top-p) filtering
    Args:
        logits: logits distribution shape (vocabulary size)
        top_k > 0: keep only top k tokens with highest probability (top-k filtering).
        top_p > 0.0: keep the top tokens with cumulative probability >= top_p (nucleus filtering).
            Nucleus filtering is described in Holtzman et al. (http://arxiv.org/abs/1904.09751)
    From: https://gist.github.com/thomwolf/1a5a29f6962089e871b94cbd09daf317
    """
    assert (
        logits.dim() == 1
    )  # batch size 1 for now - could be updated for more but the code would be less clear
    top_k = min(top_k, logits.size(-1))  # Safety check
    if top_k > 0:
        # Remove all tokens with a probability less than the last token of the top-k
        indices_to_remove = logits < torch.topk(logits, top_k)[0][..., -1, None]
        logits[indices_to_remove] = filter_value
    if top_p > 0.0:
        sorted_logits, sorted_indices = torch.sort(logits, descending=True)
        cumulative_probs = torch.cumsum(F.softmax(sorted_logits, dim=-1), dim=-1)

        # Remove tokens with cumulative probability above the threshold
        sorted_indices_to_remove = cumulative_probs > top_p
        # Shift the indices to the right to keep also the first token above the threshold
        sorted_indices_to_remove[..., 1:] = sorted_indices_to_remove[..., :-1].clone()
        sorted_indices_to_remove[..., 0] = 0
        indices_to_remove = sorted_indices[sorted_indices_to_remove]
        logits[indices_to_remove] = filter_value
    return logits


def sample_sequence(
    model,
    length,
    context,
    tokenizer,
    num_samples=1,
    temperature=1,
    top_k=0,
    top_p=0.0,
    device="cpu",
):
    end_token = tokenizer.convert_tokens_to_ids([""])[0]
    context = torch.tensor(context, dtype=torch.long, device=device)
    context = context.unsqueeze(0).repeat(num_samples, 1)
    generated = context
    with torch.no_grad():
        for _ in trange(length):
            inputs = {"input_ids": generated}
            outputs = model(
                **inputs
            )  # Note: we could also use 'past' with GPT-2/Transfo-XL/XLNet (cached hidden-states)
            next_token_logits = outputs[0][0, -1, :] / temperature
            filtered_logits = top_k_top_p_filtering(
                next_token_logits, top_k=top_k, top_p=top_p
            )
            next_token = torch.multinomial(
                F.softmax(filtered_logits, dim=-1), num_samples=1
            )
            generated = torch.cat((generated, next_token.unsqueeze(0)), dim=1)
            if next_token.item() == end_token:
                print("breaking----->>")
                break
    return generated


set_seed(20)


# Function to start the Ratatouile model with given ingredients
def startRatatouileModel(ingredientsList, region):
    initial_string=""
    size=len(ingredientsList)
    for ing in ingredientsList[:size-1]:
        initial_string+=ing+','
        
    initial_string+=ingredientsList[size-1]+';'
        
    base_model = "llama3_ft"
    tokenizer = AutoTokenizer.from_pretrained(base_model,use_fast=True)
    # model = model_class.from_pretrained('llama_mini')
    model = AutoModelForCausalLM.from_pretrained(
        base_model,
        # low_cpu_mem_usage=True,
        return_dict=True,
        torch_dtype=torch.float16,
        device_map="cpu",
    )
    # model = LlamaModel.from_pretrained('llama_mini')
    model.to(torch.device("cpu"))
    model.eval()
    # print(ingredientsList)
    print(initial_string)
    prepared_input = (
        "<RECIPE_START> "
        + "<REGION_START> "
        + region
        + " <REGION_END> "
        + " <INPUT_START> "
        # + ingredientsList.replace(",", " <next_input> ").replace(";", " <input_end>")
        + initial_string.replace(",", " <NEXT_INPUT> ").replace(";", " <INPUT_END>")
    )

    print(prepared_input)
    context_tokens = tokenizer.encode(prepared_input)

    out = sample_sequence(
        model=model,
        context=context_tokens,
        tokenizer=tokenizer,
        length=10,
        temperature=1,
        top_k=30,
        top_p=1,
        device=torch.device("cpu"),
    )
    out = out[0, len(context_tokens) :].tolist()
    text = tokenizer.decode(out, clean_up_tokenization_spaces=True)
    print(text)
    if "<RECIPE_END>" not in text:
        print(text)
        print("Failed to generate, recipe's too long")
    text = text.split(" <RECIPE_END> ")[0].strip()

    Recipe = get_substring_between_words(text, "<INSTR_START>", "<INSTR_END>")
    Recipe_ingredients = get_substring_between_words(text, "<INGR_START>", "<INGR_END>")
    title = get_substring_between_words(text, "<TITLE_START>", "<TITLE_END>")
    # calories = get_substring_between_words(text, "<calories_start>", "<calories_end>")
    # text = f"TITLE: {title}\nIngredients: {Recipe_ingredients}\nRecipe: {Recipe}\nCalories: {calories}"
    text = f"TITLE: {title}\nIngredients: {Recipe_ingredients}\nRecipe: {Recipe}"

    return text, prepared_input


# Function calls
@app.route("/fetch_ing", methods=["POST"])
def fetch_ingredients():
    data = request.get_json()
    region = data.get("region")
    print(region)

    ingredients = fetch_ingredients_from_region(region, "total2.csv")

    return jsonify({"ingredients": ingredients})

@app.route("/generate_recipe", methods=["POST"])
def generate__():
    data = request.get_json()
    print("Received data:", data)

    try:
        ingredients = data.get("ingredients")
        region = data.get("region")

        if not ingredients or not isinstance(ingredients, list):
            return jsonify({"error": "Invalid ingredients"}), 400
        if not region or not isinstance(region, str):
            return jsonify({"error": "Invalid region"}), 400

        output_text, prepared_input = startRatatouileModel(ingredients, region)
        return jsonify({"output_text": output_text, "prepared_input": prepared_input})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


if __name__ == "__main__":

    # app.run(host="0.0.0.0", port=8003)
    print(startRatatouileModel(['olive','chicken','salt','tomato'],'Italian'))




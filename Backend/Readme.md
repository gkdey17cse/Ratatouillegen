# Ratatouillegen Backend

The **Ratatouillegen Backend** is a Python-based server powered by fine-tuned LLaMA3 models to generate personalized recipe recommendations. It interacts with the frontend via API routes and is deployed across two servers for optimal performance and load balancing.

## 1. Prerequisites

Before deploying the backend, ensure you have the following:

- **Anaconda / Miniconda** (for environment management)
- **Python 3.10+**
- **tmux** (for persistent backend execution)
- Access to:
  - Main Server: `192.168.1.92`
  - Secondary Server: `192.168.3.31`

---

## 2. Project Structure

```
Backend/
├── llama3/
│   ├── llama3_base/               # Base model directories
│   ├── llama3_ft/                 # Fine-tuned models
│   ├── ratagen/                   # Recipe generation modules
│   └── .ipynb_checkpoints/        # Jupyter checkpoints
├── backend_llama.py               # Model service endpoint
├── redirect.py                    # API routing logic
├── requirements.txt               # Python dependencies
```

---

## 3. Deployment Instructions

### 3.1. Activate the Python Environment (on COSYLAB Deployment Server)

On the COSYLAB deployment server (main server), activate the virtual environment:

```sh
source venv/bin/activate
```

> _This environment includes all required packages such as Flask, Requests, and other dependencies needed for deployment._

---

### 3.2. Start the Redirect Server (on COSYLAB Deployment Server / 192.168.3.31)

Start the `redirect.py` Flask server using `tmux` to ensure it stays running in the background:

```sh
tmux new -s ratatouille_redirect
python redirect.py
```

- **Detach session**: `Ctrl + B`, then press `D`
- **Reattach session**: `tmux attach -t ratatouille_redirect`

> _This server handles incoming user requests and redirects them to the model backend._

---

### 3.3. Start the Backend Model Server (on Secondary Server: `192.168.3.31`)

On the secondary backend server (`192.168.3.31`), ensure all required files and model checkpoints are present. Then run the model server script:

```sh
tmux new -s ratatouille_backend
python backend_llama.py
```

- **Detach session**: `Ctrl + B`, then press `D`
- **Reattach session**: `tmux attach -t ratatouille_backend`

> _No virtual environment is required on this server, but make sure all dependencies (e.g., PyTorch, Transformers) are installed system-wide._

---

### 3.4. Syncing Files (Optional)

If needed, use `scp` or `rsync` to copy or update files from the main server to the secondary server:

```sh
scp -r /path/to/project user@192.168.3.31:/destination/path/
```

> _Ensure consistent directory structure and model files between servers._

---

## 4. Backend Maintenance

To kill a tmux session:

```sh
tmux kill-session -t ratatouille_backend
```

To update model weights or recipes logic, restart the server after modifications.

---

## 5. API Endpoints

### `GET /fetch_ing`

- **Description**: Fetches the list of all available ingredients for the dropdown menu . For ex -
- **Response (JSON)**:
  ```json
  {
    "ingredients": ["tomato", "onion", "garlic", "cheese", "basil", ...]
  }
  ```

---

### `POST /generate_recipe`

- **Description**: Generates a recipe based on selected ingredients and cuisine. For ex -
- **Request Body (JSON)**:
  ```json
  {
    "ingredients": ["tomato", "cheese", "basil"],
    "cuisine": "Italian"
  }
  ```
- **Response (JSON)**:
  ```json
  {
    "recipe": "Here's a delicious Italian dish you can make with tomato, cheese, and basil..."
  }
  ```

---

## 6. Internal Working of Backend

<!-- Complete This Portion -->

---

## 7. Conclusion

This backend deployment guide ensures that Ratatouillegen runs smoothly in a production environment. By following the steps for environment setup, tmux usage, and API integration, developers can easily maintain or upgrade the server. For long-term stability, always monitor logs and test API health frequently.

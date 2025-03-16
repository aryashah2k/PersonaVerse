# PersonaVerse
Team StochasticallyYours | Natural Language Processing Project | 2025

## Overview
PersonaVerse is an advanced framework designed to generate persona-based survey responses using large language models (LLMs). It enables researchers to simulate diverse human responses across different demographics and psychographics, making it a powerful tool for survey-based studies.

## Features
- **Persona-Based Response Generation**: Utilizes structured persona descriptions for realistic survey answers.
- **Multiple Question Formats**: Supports multiple-choice, Likert scale, ranking-based, and open-ended questions.
- **Dynamic Survey Management**: Provides a centralized system for creating and managing surveys.
- **LLM Integration**: Leverages various models like LLaMA-2, FLAN-T5, and Mistral-7B for response generation.
- **Evaluation Metrics**: Includes faithfulness, relevance, coherence, and persona consistency for quality assessment.
- **CI/CD Pipeline**: Automated testing and deployment via GitHub Actions.
- **Export & Import Capabilities**: Allows exporting responses in JSON/CSV format for further analysis.

## Installation
To set up PersonaVerse, follow these steps:
```bash
# Clone the repository
git clone https://github.com/your-username/PersonaVerse.git
cd PersonaVerse

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scriptsctivate

# Install dependencies
pip install -r requirements.txt
```

## Usage
Run the PersonaVerse framework with the following command:
```bash
python main.py --config config.yaml
```
Modify the `config.yaml` file to adjust persona attributes, survey types, and model selection.

## Configuration
Edit the `config.yaml` file to customize:
- **Persona Parameters** (demographics, interests, values)
- **Survey Structure** (question format, response generation strategy)
- **Evaluation Metrics** (BLEU, ROUGE, Perplexity, Semantic Alignment)

## Technologies Used
- **Programming Languages**: Python
- **Machine Learning**: TensorFlow, PyTorch, Hugging Face Transformers
- **Data Storage**: JSON, CSV
- **Infrastructure**: GitHub Actions, Docker, Google Colab, Puffer Servers

## Contribution
We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See `LICENSE` for more details.

## Acknowledgments
Special thanks to Dr. Chaklam Silpasuwanchai and Mr. Todsavad Tangtortan for their guidance and support.

## References
For detailed research methodologies and implementations, refer to:
- [ACL 2023 Synthetic Data Generation](https://doi.org/10.18653/v1/2023.acl-long.608)
- [Scaling Synthetic Data with 1,000,000,000 Personas](https://arxiv.org/abs/2406.20094)


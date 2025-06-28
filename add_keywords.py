import pandas as pd
import yake

data_source = pd.read_csv("wiki_movie_plots_deduped.csv")

# Initialize the keyword extractor
kw_extractor = yake.KeywordExtractor(top=50, stopwords=None)

def extract_keywords(plot):
    keywords = kw_extractor.extract_keywords(plot)
    return [kw for kw, score in keywords]

# Apply the function to the 'Plot' column
data_source['keywords'] = data_source['Plot'].apply(extract_keywords)

# Display the first few rows with the new column
print(data_source.head())

# Optionally, save the result to a new CSV
data_source.to_csv("movies_with_keywords.csv", index=False)


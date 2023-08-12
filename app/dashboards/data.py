"""Prepare data for Plotly Dash."""
import pandas as pd


def create_dataframe():
    """Create Pandas DataFrame from local CSV."""
    df = pd.read_csv("data/equity.csv")
    return df

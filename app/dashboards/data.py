"""Prepare data for Plotly Dash."""
import pandas as pd


def create_dataframe():
    """Create Pandas DataFrame from local CSV."""
    df = pd.read_csv("data/equity.csv")
    return df


def singleton(cls):
    instances = {}

    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance


@singleton
class DataManager:
    def __init__(self, data=None):
        self.data = data


@singleton
class ModelManager:
    def __init__(self, models=None):
        if models is None:
            models = []
        self.models = models

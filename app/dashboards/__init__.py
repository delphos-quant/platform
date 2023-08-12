import dash
from dash import html
import dash_bootstrap_components as dbc


from .data import create_dataframe


def singleton(cls):
    instances = {}

    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance


@singleton
class DashboardManager(dash.Dash):
    def __init__(self, server=None, routes_pathname_prefix=None, external_stylesheets=None):
        super().__init__(server=server, routes_pathname_prefix=routes_pathname_prefix,
                         external_stylesheets=external_stylesheets if external_stylesheets else [dbc.themes.BOOTSTRAP])
        self.layout = html.Div()

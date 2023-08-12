"""Routes for parent Flask app."""
from dash import dcc, html
from flask import current_app as app, render_template, g, request
from flask_babel import gettext

from .dashboards import DashboardManager


@app.before_request
def before_request():
    lang_code = request.args.get('lang_code')

    if lang_code and lang_code in app.config['BABEL_SUPPORTED_LOCALES']:
        g.lang_code = lang_code
    else:
        g.lang_code = request.accept_languages.best_match(app.config['BABEL_SUPPORTED_LOCALES'])


@app.route("/")
def index():
    """Landing page."""
    return render_template(
        "index.jinja2",
        title=gettext(u"Plataforma - Delphos"),
        description=gettext(
            "Visualização por meio de dashboards, além de deploy e monitoramento de estratégias em tempo real."),
    )


@app.route("/dxlib")
def about_dxlib():
    """dxlib readme."""
    return render_template(
        "dxlib.jinja2",
        title=gettext(u"dxlib - Delphos"),
        description=gettext(
            "Visualização por meio de dashboards, além de deploy e monitoramento de estratégias em tempo real."),
    )


def create_plot(x, y, plot_type='bar', plot_name='Sample Plot'):
    return dcc.Graph(
        figure={
            'data': [
                {'x': x, 'y': y, 'type': plot_type, 'name': plot_name}
            ],
            'layout': {
                'title': plot_name
            }
        }
    )


@app.route('/strategies')
def strategies():
    # Sample data
    models = [
        {"id": "model1", "name": "Model 1", "description": "Alpha Predictor"},
        {"id": "model2", "name": "Model 2", "description": "Volatility Estimator"}
    ]

    hyperparameters = {
        "learning_rate": 0.01
    }

    dataset_headers = ["Date", "Price", "Volume"]
    dataset_sample = [
        ["2023-08-01", "100", "5000"],
        ["2023-08-02", "105", "5500"]
    ]

    results_headers = ["Strategy", "Return"]
    results = [
        {"Strategy": "Long-Short", "Return": "5%"},
        {"Strategy": "Momentum", "Return": "3%"}
    ]

    data = [
        ([1, 2, 3], [4, 1, 2], 'bar', 'Plot 1'),
        ([1, 2, 3], [2, 4, 5], 'bar', 'Plot 2'),
    ]

    dashboard_manager = DashboardManager()
    dashboard_manager.layout = html.Div([
        create_plot(data[0][0], data[0][1], data[0][2], data[0][3]),
    ])

    model_insights = "Sample insights about the selected model..."

    return render_template("strategies.jinja2",
                           models=models,
                           hyperparameters=hyperparameters,
                           dataset_headers=dataset_headers,
                           dataset_sample=dataset_sample,
                           results_headers=results_headers,
                           results=results,
                           model_insights=model_insights)

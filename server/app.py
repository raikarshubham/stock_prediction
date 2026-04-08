from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import yfinance as yf
import datetime
import traceback

app = Flask(__name__)
CORS(app)

# Load the price model and scaler
try:
    model = joblib.load('price_model.pkl')
    scaler = joblib.load('scaler.pkl')
    print("Price Model and scaler loaded successfully.")
except Exception as e:
    print(f"Error loading price model/scaler: {e}")

# Load the signal model and scaler
try:
    signal_model = joblib.load('signal_model.pkl')
    signal_scaler = joblib.load('signal_scaler.pkl')
    print("Signal Model and scaler loaded successfully.")
except Exception as e:
    print(f"Error loading signal model/scaler: {e}")
# Models
price_model = None
scaler = None
updown_model = None


# =========================
# LOAD MODELS
# =========================
def load_models():
    global price_model, scaler, updown_model
    import os
    base_path = os.path.dirname(os.path.abspath(__file__))

    # Load UP/DOWN model (lives in updown/ subfolder)
    try:
        updown_path = os.path.join(base_path, 'updown', 'up_down_model.pkl')
        updown_model = joblib.load(updown_path)
        print("UPDOWN model loaded ✅")
    except Exception as e:
        print("UPDOWN model not loaded:", e)

    # Load price model (lives in server root)
    try:
        price_model = joblib.load(os.path.join(base_path, 'price_model.pkl'))
        scaler = joblib.load(os.path.join(base_path, 'scaler.pkl'))
        print("Price model loaded ✅")
    except Exception as e:
        print("Price model not loaded:", e)


load_models()


# =========================
# COMMON FEATURE ENGINEERING
# =========================
def prepare_features(df):
    df = df.dropna()

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    # Same features as training
    df['Returns'] = df['Close'].pct_change()
    df['SMA_10'] = df['Close'].rolling(10).mean()
    df['SMA_50'] = df['Close'].rolling(50).mean()
    df['EMA_10'] = df['Close'].ewm(span=10, adjust=False).mean()
    df['Volatility'] = df['Returns'].rolling(10).std()

    # RSI (14-day)
    delta = df['Close'].diff()
    gain = delta.where(delta > 0, 0).rolling(14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))

    df = df.dropna()

    return df


# =========================
# UP/DOWN PREDICTION
# =========================
@app.route('/predict/updown', methods=['POST'])
def predict_updown():
    try:
        if updown_model is None:
            return jsonify({'error': 'UPDOWN model not loaded'}), 500

        data = request.json
        ticker = data.get('ticker', 'RELIANCE.NS')

        # Ensure NSE format
        if not ticker.endswith('.NS') and not ticker.endswith('.BO'):
            ticker = ticker + '.NS'

        # Fetch data
        end_date = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=120)

        df = yf.download(ticker, start=start_date, end=end_date)

        if df.empty:
            return jsonify({'error': 'Stock data not found'}), 400

        df = prepare_features(df)

        if df.empty:
            return jsonify({'error': 'Not enough data'}), 400

        last = df.iloc[-1]

        features = [[
            last['Open'],
            last['High'],
            last['Low'],
            last['Close'],
            last['Volume'],
            last['Returns'],
            last['SMA_10'],
            last['SMA_50'],
            last['Volatility']
        ]]

        pred = updown_model.predict(features)[0]
        proba = updown_model.predict_proba(features)[0]

        # Generate a lightweight history of the last 30 days for Candlestick Charts
        history_df = df[['Open', 'High', 'Low', 'Close', 'Volume']].tail(30)
        historical_data = []
        for index, row in history_df.iterrows():
            historical_data.append({
                'date': index.strftime('%Y-%m-%d') if pd.notnull(index) else str(index),
                'open': float(row['Open']),
                'high': float(row['High']),
                'low': float(row['Low']),
                'close': float(row['Close']),
                'volume': float(row['Volume'])
            })

        def format_volume(vol):
            try:
                vol = float(vol)
                if vol >= 1e7: return f"{vol/1e7:.2f}Cr"
                if vol >= 1e5: return f"{vol/1e5:.2f}L"
                return str(int(vol))
            except:
                return str(vol)

        rsi_b = float(last.get('RSI', 50.0))
        sma_10_b = float(last.get('SMA_10', 0.0))

        return jsonify({
            'prediction': "UP" if pred == 1 else "DOWN",
            'confidence': float(max(proba)) * 100,
            'current_price': float(last['Close']),
            'historical_data': historical_data,
            'metrics': {
                'volume': format_volume(last['Volume']),
                'volatility': f"{float(last['Volatility'])*100:.2f}%",
                'rsi': f"{rsi_b:.1f}",
                'sma_10': f"{sma_10_b:.2f}"
            }
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 400

@app.route('/signal', methods=['POST'])
def signal_endpoint():
    try:
        data = request.json
        ticker = data.get('ticker', 'RELIANCE.NS')
        if not ticker.endswith('.NS') and len(ticker) > 0 and not ticker.endswith('.BO'):
             ticker = ticker + '.NS'
        elif len(ticker) == 0:
             ticker = 'RELIANCE.NS'
             
        import yfinance as yf
        import datetime
        end_date = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=120)
        
        df = yf.download(ticker, start=start_date, end=end_date)
        if df.empty:
            return jsonify({'error': f'Failed to fetch stock data for {ticker}'}), 400
        
        df = df.dropna()
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # Feature Engineering for Signal Model
        df['SMA_10'] = df['Close'].rolling(10).mean()
        df['SMA_50'] = df['Close'].rolling(50).mean()
        df['EMA_10'] = df['Close'].ewm(span=10).mean()
        from ta.momentum import RSIIndicator
        rsi = RSIIndicator(close=df['Close'].squeeze(), window=14)
        df['RSI'] = rsi.rsi()
        df['Returns'] = df['Close'].pct_change()
        df['Volatility'] = df['Returns'].rolling(10).std()
        
        df = df.dropna()
        if df.empty:
            return jsonify({'error': 'Not enough data to calculate features'}), 400

        features_order = ['Close', 'SMA_10', 'SMA_50', 'EMA_10', 'RSI', 'Volume', 'Volatility']
        
        # Predict the signal for the latest day
        last_row = df[features_order].iloc[[-1]]
        pred = signal_model.predict(last_row)
        
        # Probabilities
        proba = signal_model.predict_proba(last_row)
        confidence = float(proba.max() * 100)
        
        # 2 = BUY, 0 = SELL, 1 = HOLD
        signal_val = int(pred[0])
        signal_text = "HOLD"
        expected_move = "+0.0%"
        if signal_val == 2:
            signal_text = "BUY"
            expected_move = "+1.2%"
        elif signal_val == 0:
            signal_text = "SELL"
            expected_move = "-1.5%"
            
        # Get historical signals for chart
        # We process the last 60 days
        sub_df = df.tail(60).copy()
        hist_preds = signal_model.predict(sub_df[features_order])
        sub_df['Signal'] = hist_preds
        
        # Format output data
        chart_data = []
        history_table = []
        for date, row in sub_df.iterrows():
            date_str = date.strftime('%b %d, %Y')
            sig = int(row['Signal'])
            s_text = "WAIT"
            if sig == 2: s_text = "BUY"
            elif sig == 0: s_text = "SELL"
            
            # chart item
            chart_data.append({
                'date': date_str,
                'price': float(row['Close']),
                'signal': s_text
            })
            
            # table item (only add if not WAIT, or just all days? let's take only BUY/SELL signals)
            if sig in [0, 2]:
                history_table.append({
                    'date': date_str,
                    'signal': s_text,
                    'price': float(row['Close'])
                })
                
        # reverse history so newest is top
        history_table.reverse()
        
        current_price = float(last_row['Close'].iloc[0])
        
        rsi_val = float(last_row['RSI'].iloc[0])
        sma10 = float(last_row['SMA_10'].iloc[0])
        sma50 = float(last_row['SMA_50'].iloc[0])
        if signal_val == 2:
           insight = "Stock shows bullish momentum. Buying pressure is accumulating which makes it a favorable entry point."
        elif signal_val == 0:
           insight = "Bearish divergence detected. The predictive model recommends liquidating positions to limit downside."
        else:
           insight = "Momentum is currently neutral. The model indicates holding existing positions until trend stabilizes."

        def f_vol(v):
            try:
                v = float(v)
                if v >= 1e7: return f"{v/1e7:.2f}Cr"
                if v >= 1e5: return f"{v/1e5:.2f}L"
                return str(int(v))
            except:
                return str(v)

        return jsonify({
            'signal': signal_text,
            'confidence': confidence,
            'expectedMove': expected_move,
            'currentPrice': current_price,
            'metrics': {
                'volume': f_vol(last_row['Volume'].iloc[0]),
                'volatility': f"{float(last_row['Volatility'].iloc[0])*100:.2f}%",
                'rsi': f"{rsi_val:.1f}",
                'sma_10': f"{sma10:.2f}",
                'ema_10': f"{float(last_row['EMA_10'].iloc[0]):.2f}"
            },
            'aiInsight': insight,
            'chartData': chart_data,
            'historyTable': history_table[:10]  # top 10 most recent
        })
        
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 400


# =========================
# PRICE PREDICTION (OPTIONAL)
# =========================
@app.route('/predict/price', methods=['POST'])
def predict_price():
    try:
        if price_model is None:
            return jsonify({'error': 'Price model not available'}), 500

        data = request.json
        ticker = data.get('ticker', 'RELIANCE.NS')

        if not ticker.endswith('.NS') and not ticker.endswith('.BO'):
            ticker = ticker + '.NS'

        end_date = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=120)

        df = yf.download(ticker, start=start_date, end=end_date)

        if df.empty:
            return jsonify({'error': 'Stock data not found'}), 400

        df = prepare_features(df)

        if df.empty:
            return jsonify({'error': 'Not enough data'}), 400

        last = df.iloc[[-1]]

        feature_cols = [
            'Close', 'High', 'Low', 'Open', 'Volume',
            'SMA_10', 'SMA_50', 'EMA_10', 'Returns',
            'Volatility', 'RSI'
        ]

        # Safe fallback if missing features
        for col in feature_cols:
            if col not in last.columns:
                last[col] = 0

        X = last[feature_cols].values
        predicted = price_model.predict(X)

        current_price = float(last['Close'].values[0])
        predicted_price = float(predicted[0])
        change_pct = ((predicted_price - current_price) / current_price) * 100

        volume = int(last['Volume'].values[0])
        volatility = round(float(last['Volatility'].values[0]) * 100, 2)
        rsi_val = round(float(last['RSI'].values[0]), 2) if 'RSI' in df.columns and last['RSI'].values[0] != 0 else 50.0
        sma_10 = round(float(last['SMA_10'].values[0]), 2)

        direction = "upward" if predicted_price > current_price else "downward"
        insight = f"AI model predicts a {direction} movement of {abs(change_pct):.2f}% for the next trading session based on technical indicators and recent price action."

        # Generate a lightweight history of the last 30 days for Candlestick Charts
        history_df = df[['Open', 'High', 'Low', 'Close', 'Volume']].tail(30)
        historical_data = []
        for index, row in history_df.iterrows():
            historical_data.append({
                'date': index.strftime('%Y-%m-%d') if pd.notnull(index) else str(index),
                'open': float(row['Open']),
                'high': float(row['High']),
                'low': float(row['Low']),
                'close': float(row['Close']),
                'volume': float(row['Volume'])
            })

        return jsonify({
            "current_price": current_price,
            "predicted_price": predicted_price,
            "confidence": min(95, max(55, round(100 - abs(change_pct) * 5, 1))),
            "aiInsight": insight,
            "historical_data": historical_data,
            "metrics": {
                "volume": f"{volume:,}",
                "volatility": f"{volatility}%",
                "rsi": rsi_val,
                "sma_10": sma_10
            }
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 400


# =========================
# HEALTH CHECK
# =========================
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "Flask ML server running"})


# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(port=5001, debug=True)
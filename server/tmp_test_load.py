import joblib
try:
    model = joblib.load('c:/Users/shubh/OneDrive/Desktop/MAIN/MyProjects/stock_prediction/server/price_model.pkl')
    print("Model loaded successfully")
except Exception as e:
    import traceback
    traceback.print_exc()

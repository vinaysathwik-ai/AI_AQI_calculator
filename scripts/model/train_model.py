import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, r2_score
from xgboost import XGBRegressor

PROJECT_ROOT = Path(__file__).resolve().parents[2]

df = pd.read_csv(
    PROJECT_ROOT / "datasets/raw/historical/city_day.csv"
)

df = df.dropna(subset=["AQI"])

features = [
    "PM2.5",
    "PM10",
    "NO",
    "NO2",
    "NOx",
    "NH3",
    "CO",
    "SO2",
    "O3",
    "Benzene",
    "Toluene",
    "Xylene"
]

X = df[features]

imputer = SimpleImputer(strategy="median")
X = imputer.fit_transform(X)

y = df["AQI"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

model = XGBRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    random_state=42
)

model.fit(X_train, y_train)

pred = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, pred))
print("R2 :", r2_score(y_test, pred))

models = PROJECT_ROOT / "models"
models.mkdir(exist_ok=True)

joblib.dump(model, models / "aqi_model.pkl")
joblib.dump(imputer, models / "imputer.pkl")

print("Model Saved")
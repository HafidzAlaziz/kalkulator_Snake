from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import re

app = FastAPI()

# Konfigurasi CORS agar frontend Next.js dapat mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Struktur data untuk request perhitungan
class CalculationRequest(BaseModel):
    expression: str

# --- FUNGSI REKURSI (KRITERIA UAS) ---

def factorial_recursive(n: int) -> int:
    """Menghitung faktorial menggunakan teknik rekursi."""
    if n < 0:
        raise ValueError("Faktorial tidak didefinisikan untuk angka negatif")
    if n == 0 or n == 1:
        return 1
    return n * factorial_recursive(n - 1)

def power_recursive(base: float, exp: int) -> float:
    """Menghitung pangkat menggunakan teknik rekursi."""
    if exp == 0:
        return 1
    if exp < 0:
        return 1 / power_recursive(base, -exp)
    return base * power_recursive(base, exp - 1)

# --- END FUNGSI REKURSI ---

@app.post("/calculate")
async def calculate(request: CalculationRequest):
    """
    Endpoint utama untuk memproses ekspresi matematika.
    Mendukung operasi dasar, faktorial (!), dan pangkat (^).
    """
    expr = request.expression
    
    # Sanitasi input: mengganti simbol visual dengan operator Python
    sanitized = expr.replace('x', '*').replace('X', '*').replace(':', '/').replace(',', '.')
    
    try:
        # Penanganan khusus untuk Faktorial (contoh: 5!)
        if '!' in sanitized:
            num_match = re.search(r'(\d+)!', sanitized)
            if num_match:
                num = int(num_match.group(1))
                if num > 100: # Batas keamanan untuk rekursi
                    raise HTTPException(status_code=400, detail="Angka terlalu besar untuk faktorial")
                result = factorial_recursive(num)
                return {"expression": expr, "result": result}

        # Penanganan khusus untuk Pangkat (contoh: 2^3)
        if '^' in sanitized:
            parts = sanitized.split('^')
            if len(parts) == 2:
                base = float(parts[0])
                exp = int(float(parts[1])) # Mengonversi ke int untuk rekursi dasar
                if exp > 100: # Batas keamanan
                    raise HTTPException(status_code=400, detail="Pangkat terlalu besar")
                result = power_recursive(base, exp)
                return {"expression": expr, "result": result}

        # Validasi keamanan: hanya izinkan karakter matematika standar
        if not re.match(r'^[0-9+\-*/().\s]*$', sanitized):
            raise HTTPException(status_code=400, detail="Input mengandung karakter tidak valid")

        # Evaluasi ekspresi menggunakan fungsi bawaan Python dengan pengamanan
        # (Memenuhi kriteria Percabangan dan Error Handling)
        result = eval(sanitized, {"__builtins__": {}}, {})
        return {"expression": expr, "result": result}

    except ZeroDivisionError:
        raise HTTPException(status_code=400, detail="Ga Bisa di Bagi Nol Lahh Woyy!")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=400, detail="Liat dong ngetik nya yg bener weyy")

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    # Menjalankan server pada host localhost port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)

import qrcode
import os

url = "https://nonsuspensively-monacidic-raylan.ngrok-free.dev"

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")

# Đảm bảo thư mục static tồn tại trong workspace
os.makedirs("static", exist_ok=True)
img.save("static/ngrok_qr.png")
print("Saved to static/ngrok_qr.png")

# Lưu vào thư mục artifacts của hội thoại hiện tại
artifact_dir = r"C:\Users\User\.gemini\antigravity-ide\brain\ec45031e-34a4-4c93-802c-9bc0c9d9e114"
os.makedirs(artifact_dir, exist_ok=True)
img.save(os.path.join(artifact_dir, "ngrok_qr.png"))
print(f"Saved to artifacts: {os.path.join(artifact_dir, 'ngrok_qr.png')}")

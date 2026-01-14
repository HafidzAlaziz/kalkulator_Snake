def kalkulator():
    print("=============== Kalkulator sederhana ===============")

    while True:
        # inputan dari pengguna
        dari_user = input("Mau Hitung Apa niee?: ")

        # mencegah untuk mengatasi user masukin perkalian/yg lainnya salah misal kali (x diubah -> *) dll 
        masuk_angka = dari_user.replace('x', '*').replace('X', '*').replace(':', '/').replace(',', '.')

        try:
            hasil = eval(masuk_angka) # eval untuk menghitung string expression kayak 1+2*3 dll
            print(f"Hasilnya dari {dari_user} = {hasil}\n")
            print("Benar gaa?? Benar Lah!")

        except ZeroDivisionError:
            print("Ga Bisa di Bagi Nol Lahh Woyy!\n") # kalo ada pembagian nol ga bisa

        except Exception :
            print("Liat dong ngetik nya yg bener weyy\n") # kalo ada kesalahan lain misal ngetik 1+2--3 dll

        pilihan = input("Mau Hitung Lagi? (Y/T): ")
        if pilihan.lower() != 'y':
            print("Okeee Udahan yaaa, Dadahhh!!!")
            break

if __name__ == "__main__":
    kalkulator()
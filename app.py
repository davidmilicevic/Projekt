from flask import Flask, request, jsonify, render_template
import sqlite3
import os

base_dir = os.path.abspath(os.path.dirname(__file__))

db_path = "RezervacijaKarata.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute(
    """CREATE TABLE IF NOT EXISTS Događaj
              (Id INTEGER PRIMARY KEY AUTOINCREMENT, Naziv TEXT, Datum DATE, Vrijeme TIME,
               Mjesto TEXT, Dostupne_karte INTEGER)
           """
)
app = Flask(__name__)


@app.route("/dogadaji", methods=["POST"])
def create_dogadaj():
    data = request.get_json()
    naziv = data["naziv"]
    datum = data["datum"]
    vrijeme = data["vrijeme"]
    mjesto = data["mjesto"]
    dostupne_karte = data["dostupne_karte"]

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO Događaj (Naziv, Datum, Vrijeme, Mjesto, Dostupne_karte) VALUES (?, ?, ?, ?, ?)",
        (naziv, datum, vrijeme, mjesto, dostupne_karte),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Događaj je uspješno kreiran!"})


@app.route("/dogadaji", methods=["GET"])
def get_dogadaji():
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    query = "SELECT * FROM Događaj"
    cur.execute(query)
    dogadaji = cur.fetchall()
    conn.close()

    dogadaji_list = []
    for dogadaj in dogadaji:
        dogadaj_dict = {
            "Id": dogadaj[0],
            "Naziv": dogadaj[1],
            "Datum": dogadaj[2],
            "Vrijeme": dogadaj[3],
            "Mjesto": dogadaj[4],
            "Dostupne_karte": dogadaj[5],
        }
        dogadaji_list.append(dogadaj_dict)

    return jsonify(dogadaji_list)


@app.route("/dogadaji/<int:id>", methods=["GET"])
def get_dogadaj(id):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Dohvati događaj po id-u
    cur.execute("SELECT * FROM Događaj WHERE Id=?", (id,))
    dogadaj = cur.fetchone()
    conn.close()

    if dogadaj:
        dogadaj_dict = {
            "Id": dogadaj[0],
            "Naziv": dogadaj[1],
            "Datum": dogadaj[2],
            "Vrijeme": dogadaj[3],
            "Mjesto": dogadaj[4],
            "Dostupne_karte": dogadaj[5],
        }
        return jsonify(dogadaj_dict)
    else:
        return jsonify({"message": "Događaj nije pronađen!"}), 404


@app.route("/dogadaji/<int:id>", methods=["DELETE"])
def delete_dogadaj(id):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT * FROM Događaj WHERE id = ?", (id,))
    putovanje = cur.fetchone()

    if putovanje is None:
        return jsonify({"message": "Događaj nije pronađen!"}), 404

    cur.execute("DELETE FROM Događaj WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Događaj je uspješno obrisan!"})


# Endpoint za azuriranje putovanja po id-u
@app.route("/dogadaji/<int:id>", methods=["PUT"])
def azurirajDogadaj(id):
    data = request.get_json()
    naziv = data["naziv"]
    datum = data["datum"]
    vrijeme = data["vrijeme"]
    mjesto = data["mjesto"]
    dostupne_karte = data["dostupne_karte"]

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT * FROM Događaj WHERE id = ?", (id,))
    dogadaj = cur.fetchone()

    if dogadaj is None:
        return jsonify({"message": "Događaj nije pronađen!"}), 404

    cur.execute(
        "UPDATE Događaj SET Naziv = ?, Datum = ?, Vrijeme = ?, Mjesto = ?, Dostupne_karte = ? WHERE id = ?",
        (naziv, datum, vrijeme, mjesto, dostupne_karte, id),
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Događaj je uspješno ažuriran!"})


@app.route("/")
def root():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)

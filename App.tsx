import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { derivative, parse } from "mathjs"; // Instalar con: npm install mathjs

export default function App() {
  const [funcion, setFuncion] = useState("");
  const [derivadas, setDerivadas] = useState<{ orden: number; valor: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const calcularDerivadas = () => {
    const trimmed = funcion.trimStart();
    if (trimmed === "") {
      setErrorMsg("⚠️ Ingresa una función antes de calcular.");
      setDerivadas([]);
      return;
    }

    setFuncion(trimmed);
    setErrorMsg("");

    try {
      let expr = parse(trimmed);
      let results = [];
      let current = trimmed;
      let i = 1;

      while (true) {
        let d = derivative(current, "x").toString();

        if (d === "0" || d === "0.0") {
          results.push({ orden: i, valor: "0" });
          break;
        }

        results.push({ orden: i, valor: d });
        current = d;
        i++;

        if (i > 20) {
          results.push({ orden: i, valor: "No se puede resolver (no llega a 0)" });
          break;
        }
      }

      setDerivadas(results);
    } catch (error) {
      setDerivadas([]);
      setErrorMsg("❌ No se puede resolver la función ingresada.");
    }
  };

  const agregarSimbolo = (simbolo: string) => {
    setFuncion((prev) => prev + simbolo);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📘 Calculadora de Derivadas</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresa una función (ej: x^4 - 3x^3 + 2x^2 - x + 5)"
        value={funcion}
        onChangeText={(text) => {
          if (!text.startsWith(" ")) setFuncion(text);
        }}
      />

      {/* Botones de símbolos */}
      <View style={styles.simbolosContainer}>
        {["x", "x^2", "x^3", "^"].map((simbolo) => (
          <TouchableOpacity
            key={simbolo}
            style={styles.simboloBtn}
            onPress={() => agregarSimbolo(simbolo)}
          >
            <Text style={styles.simboloTexto}>{simbolo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Calcular derivadas" onPress={calcularDerivadas} />

      {errorMsg !== "" && <Text style={styles.errorText}>{errorMsg}</Text>}

      {derivadas.length > 0 && (
        <View style={styles.tabla}>
          <Text style={styles.subtitulo}>Resultados:</Text>

          <View style={[styles.fila, styles.encabezado]}>
            <Text style={[styles.celda, styles.celdaTitulo]}>Orden</Text>
            <Text style={[styles.celda, styles.celdaTitulo]}>Derivada</Text>
          </View>

          <FlatList
            data={derivadas}
            keyExtractor={(item) => item.orden.toString()}
            renderItem={({ item }) => (
              <View style={styles.fila}>
                <Text style={[styles.celda, styles.orden]}>{item.orden}</Text>
                <Text style={[styles.celda, styles.resultado]}>{item.valor}</Text>
              </View>
            )}
          />
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  simbolosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
  simboloBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  simboloTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#b30000",
    backgroundColor: "#ffe5e5",
    borderRadius: 10,
    padding: 8,
    width: "100%",
    textAlign: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ffb3b3",
    fontWeight: "bold",
  },
  tabla: {
    marginTop: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  encabezado: {
    backgroundColor: "#d9e6ff",
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  celda: {
    flex: 1,
    textAlign: "center",
  },
  celdaTitulo: {
    fontWeight: "bold",
    fontSize: 16,
  },
  orden: {
    fontWeight: "bold",
  },
  resultado: {
    fontStyle: "italic",
    flex: 2,
  },
});

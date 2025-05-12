import './App.css';
import { useState, useEffect } from "react";
import supabase from "./hooks/supabaseClient";
import { calculatePrecalculatedData } from "./hooks/calculate";

export default function App() {
  const [result, setResult] = useState(null);
  const [source, setSource] = useState("supabase");
  const [chunkSize, setChunkSize] = useState(null);
  const [exportMessage, setExportMessage] = useState("");
  const [estimateMessage, setEstimateMessage] = useState("");

  const handleCalculate = async () => {
    let rules, links;

    if (source === "supabase") {
      const { data: rulesData, error: rulesError } = await supabase
        .from("rules")
        .select("*")
        .order("priority_score", { ascending: false });

      const { data: linksData, error: linksError } = await supabase
        .from("links_maillage")
        .select("*")
        .order("score", { ascending: false });

      if (rulesError || linksError) {
        alert("Erreur lors du chargement des données Supabase");
        return;
      }

      rules = rulesData;
      links = linksData;
    } else if (source === "mysql") {
      try {
        const rulesRes = await fetch("http://localhost:3001/api/rules");
        const linksRes = await fetch("http://localhost:3001/api/links");

        rules = await rulesRes.json();
        links = await linksRes.json();
      } catch (e) {
        console.error("Erreur API MySQL :", e);
        alert("Erreur lors du chargement via MySQL API");
        return;
      }
    }

    const kv = calculatePrecalculatedData(rules, links);
    setResult(kv);
  };

  const splitByKeyCount = (data, keysPerFile = 100) => {
    const entries = Object.entries(data);
    const chunks = [];

    for (let i = 0; i < entries.length; i += keysPerFile) {
      const chunkEntries = entries.slice(i, i + keysPerFile);
      const chunk = Object.fromEntries(chunkEntries);
      chunks.push(chunk);
    }

    return chunks;
  };

  const download = () => {
    setExportMessage("");

    if (!chunkSize) {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kv-data.json";
      a.click();
      setExportMessage(" 1 fichier exporté (kv-data.json)");
      URL.revokeObjectURL(url);
    } else {
      const chunks = splitByKeyCount(result, chunkSize);

      chunks.forEach((chunk, i) => {
        const blob = new Blob([JSON.stringify(chunk, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `kv-data-${i + 1}.json`;
        a.click();
      });

      setExportMessage(`  ${chunks.length} fichiers exportés (${chunkSize} clés max par fichier)`);
    }
  };

  useEffect(() => {
    if (!result) return setEstimateMessage("");

    const fullJSON = JSON.stringify(result, null, 2);
    const totalSize = new TextEncoder().encode(fullJSON).length;

    if (!chunkSize) {
      setEstimateMessage(`  Estimé : 1 fichier ~${(totalSize / 1024).toFixed(1)} Ko`);
    } else {
      const totalKeys = Object.keys(result).length;
      const fileCount = Math.ceil(totalKeys / chunkSize);
      const estPerFile = totalSize / fileCount;
      setEstimateMessage(
        `  Estimé : ${fileCount} fichiers ~${(estPerFile / 1024).toFixed(1)} Ko chacun`
      );
    }
  }, [chunkSize, result]);

  return (
    <div className="p-4">
      <div style={{ marginBottom: "1rem" }}>
        <label>Choisir la source de données :</label>
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="supabase">Supabase</option>
          <option value="mysql">MySQL (via API)</option>
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Fractionner l’export par nombre de clés (optionnel) :</label>
        <input
          type="number"
          min="1"
          placeholder="ex : 100"
          value={chunkSize || ""}
          onChange={(e) => {
            const value = e.target.value;
            setChunkSize(value ? Number(value) : null);
          }}
          style={{ width: "80px", marginLeft: "5px" }}
        />
        <span style={{ marginLeft: "5px", fontStyle: "italic" }}>
          Laisser vide pour un seul fichier complet
        </span>
        {estimateMessage && (
          <p style={{ fontStyle: "italic", color: "#555", marginTop: "0.5rem" }}>
            {estimateMessage}
          </p>
        )}
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={handleCalculate}>Précalculer</button>
        {result && <button onClick={download}>Exporter .json</button>}
      </div>

      {exportMessage && (
        <p style={{ fontWeight: "bold", color: "green" }}>{exportMessage}</p>
      )}

      {result && (
        <>
          <h3>Aperçu des données :</h3>
          <pre style={{ maxHeight: "400px", overflow: "auto", background: "#f9f9f9", padding: "1em" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

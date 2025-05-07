import './App.css';
import { useState } from "react";
import supabase from "./hooks/supabaseClient";
import { calculatePrecalculatedData } from "./hooks/calculate";
import ImportToCloudflare from "./components/ImportToCloudflare";
export default function App() {
  const [result, setResult] = useState(null);
  const [source, setSource] = useState("supabase");


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
  
  console

  const download = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kv-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
<div className="p-4">
  <div style={{ marginBottom: "1rem" }}>
  <label>Choisir la source de données :</label>
  <select value={source} onChange={(e) => setSource(e.target.value)}>
    <option value="supabase">Supabase</option>
    <option value="mysql">MySQL (via API)</option>
  </select>
</div>

  <hr />

  {result ? (
    <>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={handleCalculate}>Précalculer</button>
        <button onClick={download}>Exporter .json</button>
      </div>
      <h3>Aperçu des données :</h3>
      <pre style={{ maxHeight: "400px", overflow: "auto", background: "#f9f9f9", padding: "1em" }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </>
  ) : (
    <button onClick={handleCalculate}>Précalculer</button>
  )}
</div>

    </>
  );
}

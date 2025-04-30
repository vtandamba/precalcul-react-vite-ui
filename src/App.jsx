import './App.css';
import { useState } from "react";
import supabase from "./hooks/supabaseClient";
import { calculatePrecalculatedData } from "./hooks/calculate";
import ImportToCloudflare from "./components/ImportToCloudflare";
export default function App() {
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    const { data: rules, error: rulesError } = await supabase
      .from("rules")
      .select("*")
      .order("priority_score", { ascending: false });

    const { data: links, error: linksError } = await supabase
      .from("links_maillage")
      .select("*")
      .order("score", { ascending: false });

    if (rulesError || linksError) {
      alert("Erreur lors du chargement des données Supabase");
      return;
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
  <ImportToCloudflare />
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

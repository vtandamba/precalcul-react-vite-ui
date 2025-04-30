import './App.css';
import { useEffect, useState } from "react";
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
      console.error("Erreur Supabase:", rulesError, linksError); // 🔁 Ajout important
      alert("Erreur lors du chargement des données Supabase");
      return;
    }
    console.log(rules)
    const kv = calculatePrecalculatedData(rules, links);
    setResult(kv);


  };

  supabase.from("rules").select("*").limit(1).then(({ data, error }) => {
    console.log("Données récupérées (then) :", data);
    //console.error("Erreur (then) :", error);
  });

  const [testData, setTestData] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      const { data, error } = await supabase
        .from("rules")
        .select("*")
        .limit(1);

      if (error) {
        console.error("Erreur test Supabase :", error);
      } else {
        console.log("Test récupéré :", data);
        setTestData(data);
      }
    };

    fetchTest();
  }, []);

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
        <button onClick={handleCalculate}>Précalculer</button>
        {result && (
          <>

            <pre>{JSON.stringify(result, null, 2)}</pre>
            <button onClick={download}>Exporter .json</button>



          </>
        )}
        <hr></hr>
        {testData && (
          <div>
            <h4>Données de test :</h4>
            <pre>{JSON.stringify(testData, null, 2)}</pre>
          </div>
        )}

      </div>
    </>
  );
}

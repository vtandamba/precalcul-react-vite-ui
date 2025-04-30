import { useState } from "react";

export default function ImportToCloudflare() {
  const [importStatus, setImportStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setImportStatus("");

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const response = await fetch("https://import-kv.acces.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
      });

      const result = await response.text();
      setImportStatus(`  Succès : ${result}`);
    } catch (error) {
      console.error("Erreur import :", error);
      setImportStatus("  Échec de l'import");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2>Importer vers Cloudflare KV</h2>
      <input type="file" accept=".json" onChange={handleFileChange} />
      {isLoading && <p>  Importation en cours...</p>}
      <p>{importStatus}</p>
    </div>
  );
}

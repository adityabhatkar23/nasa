import { Copy, Check } from "lucide-react";
import { useState } from "react";

const Api = ({ onApiKeySaved }) => {
  const [copied, setCopied] = useState(false);
  const text = "gaCPPaW0CEkZK1lpls0CDBTbXOZz7eIxh06Rrd62";

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [apiKey, setApiKey] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("apiKey", apiKey);
    setApiKey("");
    onApiKeySaved();
  };

  return (
    <div className="p-6 bg-neutral-950 max-w-lg mx-auto mt-24 rounded-2xl space-y-6">
      <div className="border border-zinc-600 p-6 rounded-xl">
        <p className="text-zinc-300 mb-4">You can use this API key:</p>

        <div className="bg-zinc-900 rounded-lg px-3 py-2 flex justify-between items-center my-3">
          <span className="truncate text-sm font-semibold text-zinc-200">{text}</span>
          <button
            onClick={handleCopy}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
        <p className="text-zinc-400 text-sm">
          However, you may experience issues with daily request limits. To
          create your own key, visit:{" "}
          <a
            href="https://api.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-zinc-300 hover:text-white transition-colors font-medium"
          >
            https://api.nasa.gov/
          </a>
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        <label className="text-xl font-semibold text-zinc-200">NASA API key</label>
        <input
          id="apiKey"
          type="text"
          name="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
          placeholder="Enter your NASA API Key"
          className="px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg outline-none text-white placeholder-zinc-400 focus:border-zinc-400 transition-colors"
        />
        <button
          onClick={handleSubmit}
          className="bg-zinc-800 py-3 rounded-lg cursor-pointer font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          Save API Key
        </button>
      </div>
    </div>
  );
};

export default Api;

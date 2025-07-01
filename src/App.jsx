import Api from "./components/Api";
import { useEffect, useState } from "react";
import APOD from "./pages/APOD";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import NEO from "./pages/NEO";
import Rover from "./pages/Rover";

export default function App() {
  const [isApiKey, setIsApiKey] = useState(false)
  
  useEffect(() => {
    const storedApi = localStorage.getItem("apiKey");
    if (!storedApi) {
      setIsApiKey(true);
    }
  }, []);

  const handleApiKeySaved = () => {
    setIsApiKey(false);
  };

  const handleApiKeyCleared = () => {
    setIsApiKey(true);
  };

  return (
    <BrowserRouter>
    <div className="min-h-screen bg-black text-white ">

      <Sidebar isApiKey={isApiKey} onApiKeyCleared={handleApiKeyCleared} />

      <main className="lg:p-12 p-2  md:ml-64  md:mt-0">
        
       { isApiKey && <Api onApiKeySaved={handleApiKeySaved} />}
       { !isApiKey && (
        <Routes>
          <Route path="/" element={<APOD />} />
          <Route path="/neo" element={<NEO />} />
          <Route path="/rover" element={<Rover />} />
        </Routes>
       )}
      </main>
      
    </div>
    
    </BrowserRouter>
  );
}

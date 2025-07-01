import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "APOD", path: "/" },
  { name: "NEO", path: "/neo" },
  { name: "Mars Rover Photos", path: "/rover" },
];

export default function Sidebar({ isApiKey, onApiKeyCleared }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = () => {
    localStorage.removeItem("apiKey");
    onApiKeyCleared();
  };

  return (
    <>
      
      <div className="fixed top-0 left-0 right-0 bg-zinc-950 shadow-md px-4 py-3   flex justify-between items-center md:hidden z-40">
        <h1 className="text-lg font-semibold text-zinc-200">NASA Dashboard</h1>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      
      <aside className="hidden md:flex fixed top-0 left-0 w-64 h-full bg-zinc-950 shadow-md flex-col z-30">
        <div className="p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-zinc-200">NASA Dashboard</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white font-semibold"
                      : "bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {!isApiKey && (
              <button
                onClick={handleDelete}
                className="w-full mt-8 text-zinc-200 cursor-pointer bg-zinc-900 py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors font-medium"
              >
                Clear API Key
              </button>
            )}
          </nav>
        </div>
      </aside>

      
      {menuOpen && (
        <div className="fixed inset-0 bg-zinc-950 z-30 md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-200">NASA Dashboard</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded-lg transition-colors ${
                      isActive
                        ? "bg-zinc-800 text-white font-semibold"
                        : "bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              
              {!isApiKey && (
                <button
                  onClick={handleDelete}
                  className="w-full mt-8 text-zinc-200 cursor-pointer bg-zinc-900 py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors font-medium"
                >
                  Clear API Key
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

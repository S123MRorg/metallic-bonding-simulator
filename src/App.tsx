import React, { useState, useEffect, useRef } from 'react';
import MetalSimulation, { SimulationMode } from './components/MetalSimulation';
import { Info, Zap, Flame, Move, Play, X, Hexagon, Download, Loader2 } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<SimulationMode>('normal');
  const [showDiy, setShowDiy] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(0.25);
  const [autoMalleable, setAutoMalleable] = useState(false);
  
  // Secret mode state - enabled when user types "secret-git" on the page
  const [secretModeEnabled, setSecretModeEnabled] = useState(false);
  const typedCharsRef = useRef<string>('');
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  // Handle typing to enable secret mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only track printable characters
      if (e.key.length === 1) {
        typedCharsRef.current += e.key;
        
        // Keep only the last 20 characters to check for the trigger
        if (typedCharsRef.current.length > 20) {
          typedCharsRef.current = typedCharsRef.current.slice(-20);
        }
        
        // Check if typed characters contain "secret-git"
        if (typedCharsRef.current.toLowerCase().includes('secret-git')) {
          setSecretModeEnabled(true);
          typedCharsRef.current = ''; // Reset after successful trigger
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleRecordingComplete = (blob: Blob) => {
    setIsRecording(false);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metal-simulation-${mode}.gif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-500/20 border border-slate-500">
              <Hexagon className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Metallic Bonding Simulator</h1>
              <p className="text-xs text-slate-400 font-medium">Interactive Model of Cations & Delocalized Electrons</p>
            </div>
          </div>
          <button
            onClick={() => setShowDiy(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium border border-slate-700"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">DIY Physical Model</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Simulation Mode</h2>
            <div className="space-y-3">
              <button
                onClick={() => setMode('normal')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                  mode === 'normal' 
                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                } border`}
              >
                <Play className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Normal State</div>
                  <div className="text-xs opacity-70">Random electron movement</div>
                </div>
              </button>

              <button
                onClick={() => setMode('malleable')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                  mode === 'malleable' 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                } border`}
              >
                <Move className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Malleability</div>
                  <div className="text-xs opacity-70">Drag layers to slide them</div>
                </div>
              </button>

              {mode === 'malleable' && (
                <div className="pl-4 pr-2 py-2 flex items-center justify-between bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <span className="text-sm text-slate-300">Auto-demonstrate</span>
                  <button
                    onClick={() => setAutoMalleable(!autoMalleable)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoMalleable ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoMalleable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              )}

              <button
                onClick={() => setMode('electrical')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                  mode === 'electrical' 
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' 
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                } border`}
              >
                <Zap className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Electrical Conductivity</div>
                  <div className="text-xs opacity-70">Apply voltage to move electrons</div>
                </div>
              </button>

              <button
                onClick={() => setMode('circuit')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                  mode === 'circuit' 
                    ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' 
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                } border`}
              >
                <Zap className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Complete Circuit</div>
                  <div className="text-xs opacity-70">See electrons flow through a circuit</div>
                </div>
              </button>

              <button
                onClick={() => setMode('heat')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                  mode === 'heat' 
                    ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' 
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                } border`}
              >
                <Flame className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Heat Conductivity</div>
                  <div className="text-xs opacity-70">Guided tour of heat transfer</div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Animation Speed</h2>
            <div className="space-y-4">
              <input 
                type="range" 
                min="0.01" 
                max="10" 
                step="0.01"
                value={animationSpeed} 
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Slow (0.01x)</span>
                <span>{animationSpeed.toFixed(2)}x</span>
                <span>Realistic (10x)</span>
              </div>
              <p className="text-xs text-slate-500">
                In real life, delocalized electrons move at the Fermi velocity (approx. 1,000,000 m/s). 
                The "Realistic" setting better represents this rapid, chaotic movement.
              </p>
            </div>
          </div>

          {/* Secret Mode: Export Section - Only visible when user types on the page */}
          {secretModeEnabled && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Export</h2>
              <button
                onClick={() => setIsRecording(true)}
                disabled={isRecording}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 transition-colors font-medium"
              >
                {isRecording ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Recording... {Math.round(recordingProgress * 100)}%
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    {mode === 'heat' ? 'Download Full Tour GIF' : 'Download Animated GIF'}
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 mt-3 text-center">
                {mode === 'heat' 
                  ? "Captures the full 24-second guided tour animation." 
                  : "Captures an 8-second loop of the current simulation mode."}
              </p>
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-2 sm:p-6 flex-grow flex flex-col items-center justify-center relative overflow-hidden">
            <MetalSimulation 
              mode={mode} 
              isRecording={isRecording}
              animationSpeed={animationSpeed}
              autoMalleable={autoMalleable}
              onRecordingComplete={handleRecordingComplete}
              onRecordingProgress={setRecordingProgress}
            />
            
            {/* Legend / Info Overlay */}
            <div className="mt-6 w-full max-w-[600px] flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 border border-red-700 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">+</span>
                </div>
                <span className="text-slate-300">Metal Cation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">-</span>
                </div>
                <span className="text-slate-300">Delocalized Electron</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-white mb-2">
              {mode === 'normal' && "The 'Sea of Electrons' Model"}
              {mode === 'malleable' && "Malleability & Ductility"}
              {mode === 'electrical' && "Electrical Conductivity"}
              {mode === 'circuit' && "Complete Circuit Animation"}
              {mode === 'heat' && "Thermal Conductivity"}
            </h3>
            <p className="text-slate-400 leading-relaxed">
              {mode === 'normal' && "A metal is composed of an extensive three-dimensional arrangement of positively charged ions (cations) immersed in a 'sea' of delocalized electrons. These mobile electrons can flow freely throughout the entire metallic structure, which explains why metals exhibit their characteristic physical properties."}
              {mode === 'malleable' && "The delocalized electrons function as a dynamic, flexible binding agent within the metal. When an external force is applied—such as dragging a layer of cations—the atomic layers can shift relative to one another without disrupting the metallic bonds. This sliding mechanism underlies the malleability of metals (ability to be flattened into sheets) and ductility (capacity to be stretched into wires)."}
              {mode === 'electrical' && "Applying an electrical potential difference across a metal causes the delocalized electrons to drift systematically toward the positive terminal. This directed movement of electric charge constitutes an electric current. The unrestricted mobility of electrons within the metallic lattice makes metals highly efficient conductors of electricity."}
              {mode === 'circuit' && "In a functioning electrical circuit, the battery serves as an electron pump that drives charges through the system. Electrons exit the negative terminal, travel through the connecting wire into the metal conductor, and emerge from the opposite side. As these electrons pass through the light bulb filament, their kinetic energy transforms into visible light and thermal energy before they complete the circuit by returning to the positive terminal."}
              {mode === 'heat' && "Heating a metal causes its cations to vibrate with increasing intensity. This added kinetic energy spreads through the crystal lattice through coordinated vibrations and is also carried across the metal by the rapidly moving delocalized electrons, enabling efficient thermal conduction."}
            </p>
          </div>
        </div>
      </main>

      {/* DIY Modal */}
      {showDiy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Build a Physical Model at Home
              </h2>
              <button 
                onClick={() => setShowDiy(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6 text-slate-300">
              <p>You can easily build a physical version of this model using everyday household items to demonstrate metallic bonding to a class or for a science project.</p>
              
              <div>
                <h3 className="text-white font-medium mb-3">Materials Needed:</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-400">
                  <li>A clear plastic box or shallow tray (like a Tupperware container)</li>
                  <li>Large, identical spherical objects to represent <strong>cations</strong> (e.g., ping pong balls, marbles, or large beads)</li>
                  <li>Small, highly mobile objects to represent <strong>delocalized electrons</strong> (e.g., small seed beads, BB pellets, or even coarse sand)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-3">How to Build & Demonstrate:</h3>
                <ol className="list-decimal pl-5 space-y-4 text-slate-400">
                  <li>
                    <strong className="text-slate-300">Setup:</strong> Place the large balls (cations) into the clear container so they form a neat, packed layer (a lattice). Pour the small beads (electrons) over them so they fill the gaps.
                  </li>
                  <li>
                    <strong className="text-slate-300">Normal State:</strong> Gently shake the container. Notice how the large balls vibrate slightly in place, while the small beads move freely around and between them.
                  </li>
                  <li>
                    <strong className="text-slate-300">Malleability:</strong> Use a ruler or your hand to push one row of the large balls. Watch how the row slides over the adjacent row, but the small beads immediately flow into the new gaps, keeping the structure "glued" together.
                  </li>
                  <li>
                    <strong className="text-slate-300">Conductivity:</strong> Tilt the container slightly. The large balls will mostly stay in their lattice (if packed tightly), but the small beads will rapidly flow to one side, demonstrating how electrons carry a current or heat.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-4 text-center">
        <p className="text-sm text-slate-500">author: Kirk</p>
      </footer>
    </div>
  );
}

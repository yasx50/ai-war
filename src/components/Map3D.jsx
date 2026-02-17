import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, MapPin, Users, Crosshair } from 'lucide-react';

export default function ForestGameMap() {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedTeam, setSelectedTeam] = useState('team-a');
  const canvasRef = useRef(null);

  const mapWidth = 2000;
  const mapHeight = 1600;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Grass background
    ctx.fillStyle = '#34A853';
    ctx.fillRect(0, 0, mapWidth, mapHeight);

    // Grass texture
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * mapWidth;
      const y = Math.random() * mapHeight;
      ctx.fillStyle = `rgba(52, 168, 83, ${Math.random() * 0.3})`;
      ctx.fillRect(x, y, Math.random() * 8 + 2, Math.random() * 8 + 2);
    }

    // Dirt paths
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(100, 800);
    ctx.lineTo(mapWidth - 100, 800);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1000, 100);
    ctx.lineTo(1000, mapHeight - 100);
    ctx.stroke();

    // Water pond
    ctx.fillStyle = '#1E90FF';
    ctx.beginPath();
    ctx.ellipse(1500, 800, 180, 150, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00BFFF';
    ctx.beginPath();
    ctx.ellipse(1510, 810, 160, 130, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw trees function
    const drawTree = (x, y, size = 1) => {
      const treeScale = size;
      ctx.fillStyle = '#654321';
      ctx.fillRect(x - 8 * treeScale, y, 16 * treeScale, 25 * treeScale);
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.ellipse(x, y - 5 * treeScale, 35 * treeScale, 40 * treeScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#32CD32';
      ctx.beginPath();
      ctx.ellipse(x - 10 * treeScale, y - 8 * treeScale, 15 * treeScale, 20 * treeScale, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    // Forest areas
    const forestAreas = [
      { x: 300, y: 200, density: 40 },
      { x: 1700, y: 200, density: 40 },
      { x: 150, y: 500, density: 35 },
      { x: 1850, y: 500, density: 35 },
      { x: 300, y: 1300, density: 40 },
      { x: 1700, y: 1300, density: 40 },
      { x: 150, y: 1100, density: 35 },
      { x: 1850, y: 1100, density: 35 },
      { x: 700, y: 600, density: 30 },
      { x: 1300, y: 1000, density: 30 },
    ];

    forestAreas.forEach(area => {
      for (let i = 0; i < area.density; i++) {
        const offsetX = (Math.random() - 0.5) * 300;
        const offsetY = (Math.random() - 0.5) * 300;
        const size = Math.random() * 0.6 + 0.6;
        drawTree(area.x + offsetX, area.y + offsetY, size);
      }
    });

    // Team A Spawn - Blue (Bottom Left)
    ctx.fillStyle = '#0047AB';
    ctx.beginPath();
    ctx.ellipse(250, 1450, 120, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1E90FF';
    ctx.beginPath();
    ctx.ellipse(250, 1450, 100, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const spawnX = 250 + Math.cos(angle) * 60;
      const spawnY = 1450 + Math.sin(angle) * 50;
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(spawnX - 15, spawnY - 15, 30, 30);
      ctx.strokeStyle = '#1E90FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(spawnX - 15, spawnY - 15, 30, 30);
    }

    // Team B Spawn - Red (Top Right)
    ctx.fillStyle = '#C41E3A';
    ctx.beginPath();
    ctx.ellipse(1750, 150, 120, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.ellipse(1750, 150, 100, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const spawnX = 1750 + Math.cos(angle) * 60;
      const spawnY = 150 + Math.sin(angle) * 50;
      ctx.fillStyle = '#FFB6C1';
      ctx.fillRect(spawnX - 15, spawnY - 15, 30, 30);
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 2;
      ctx.strokeRect(spawnX - 15, spawnY - 15, 30, 30);
    }

    // Center Objective
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(1000, 800, 80, 80, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(1000, 800, 60, 60, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Landmarks (rocks)
    const rockPositions = [
      { x: 300, y: 800, size: 40 },
      { x: 1700, y: 800, size: 40 },
      { x: 1000, y: 300, size: 35 },
      { x: 1000, y: 1300, size: 35 },
    ];

    rockPositions.forEach(rock => {
      ctx.fillStyle = '#808080';
      ctx.beginPath();
      ctx.ellipse(rock.x, rock.y, rock.size, rock.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#A9A9A9';
      ctx.beginPath();
      ctx.ellipse(rock.x - 5, rock.y - 5, rock.size * 0.6, rock.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    });

  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(Math.max(0.5, Math.min(3, zoom + delta)));
  };

  const handleDrag = (e) => {
    if (e.buttons !== 1) return;
    setPosition(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  const resetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">🌲 FOREST BATTLEFIELD</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Ready to Battle</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 border-r border-slate-700 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Team Selection */}
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase mb-3">Select Team</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTeam('team-a')}
                  className={`w-full py-3 px-4 rounded-lg font-semibold border-2 transition-all ${
                    selectedTeam === 'team-a'
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  🔵 TEAM A
                </button>
                <button
                  onClick={() => setSelectedTeam('team-b')}
                  className={`w-full py-3 px-4 rounded-lg font-semibold border-2 transition-all ${
                    selectedTeam === 'team-b'
                      ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  🔴 TEAM B
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-700"></div>

            {/* Legend */}
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase mb-3">Legend</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full border border-blue-400"></div>
                  <span className="text-slate-300">Team A Spawn</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full border border-red-400"></div>
                  <span className="text-slate-300">Team B Spawn</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-yellow-500 rounded-full border border-yellow-400"></div>
                  <span className="text-slate-300">Objective Point</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-600 rounded"></div>
                  <span className="text-slate-300">Forest Zone</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-cyan-500 rounded"></div>
                  <span className="text-slate-300">Water Body</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-500 rounded"></div>
                  <span className="text-slate-300">Landmark</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-700"></div>

            {/* Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase mb-3">Map Info</h3>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Map Size:</span>
                  <span className="text-slate-200">2000×1600</span>
                </div>
                <div className="flex justify-between">
                  <span>Terrain:</span>
                  <span className="text-slate-200">Forest</span>
                </div>
                <div className="flex justify-between">
                  <span>Teams:</span>
                  <span className="text-slate-200">2</span>
                </div>
                <div className="flex justify-between">
                  <span>Players:</span>
                  <span className="text-slate-200">8+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="flex-1 flex flex-col bg-slate-950">
          <div className="flex-1 relative overflow-hidden bg-black">
            <canvas
              ref={canvasRef}
              width={mapWidth}
              height={mapHeight}
              onWheel={handleWheel}
              onMouseMove={handleDrag}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
              }}
            />
          </div>

          {/* Bottom Controls */}
          <div className="bg-slate-950 border-t border-slate-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                className="p-2 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
              >
                <ZoomOut className="w-5 h-5 text-slate-400" />
              </button>
              <div className="bg-slate-800 border border-slate-700 rounded px-3 py-1">
                <span className="text-slate-300 font-semibold text-sm">{Math.round(zoom * 100)}%</span>
              </div>
              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                className="p-2 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
              >
                <ZoomIn className="w-5 h-5 text-slate-400" />
              </button>
              <div className="w-px h-6 bg-slate-700"></div>
              <button
                onClick={resetView}
                className="px-4 py-2 hover:bg-slate-800 rounded-lg border border-slate-700 text-slate-300 text-sm font-semibold transition-colors"
              >
                Reset View
              </button>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Crosshair className="w-4 h-4" />
              <span>🖱️ Scroll to zoom • Drag to pan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
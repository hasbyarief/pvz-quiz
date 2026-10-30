            }}
          >
            <ProjectileSVG type={proj.type} />
          </div>
        );
      })}

      {/* 6. PARTICLES & VISUAL EFFECTS */}
      {particles.map((pt) => {
        const progress = 1 - pt.lifetime / pt.maxLifetime;

        if (pt.type === 'explosion') {
          return (
            <div
              key={pt.id}
              className="absolute z-35 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                left: pt.x,
                top: pt.y,
                width: 260,
                height: 260
              }}
            >
              <ExplosionEffectSVG progress={progress} />
            </div>
          );
        }

        if (pt.type === 'sunText') {
          return (
            <div
              key={pt.id}
              className="absolute z-40 pointer-events-none -translate-x-1/2 font-black text-amber-300 font-mono text-xl drop-shadow-md select-none transition-all"
              style={{
                left: pt.x,
                top: pt.y - progress * 40,
                opacity: 1 - progress
              }}
            >
              {pt.text || '+25'}
            </div>
          );
        }

        if (pt.type === 'splat' || pt.type === 'frost') {
          return (
            <div
              key={pt.id}
              className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                left: pt.x,
                top: pt.y,
                width: 28,
                height: 28,
                opacity: 1 - progress,
                transform: `scale(${1 + progress * 0.8})`
              }}
            >
              <div
                className={`w-full h-full rounded-full ${
                  pt.type === 'frost' ? 'bg-cyan-300 blur-[1px]' : 'bg-emerald-400'
                }`}
              />
            </div>
          );
        }

        return null;
      })}

      {/* 7. SUNS (HIGH-RESPONSIVENESS CLICK & TAP TARGET) */}
      {suns.map((sun) => {
        return (
          <div
            key={sun.id}
            onPointerDown={(e) => {
              e.stopPropagation();
              onSunClick(sun.id, e);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSunClick(sun.id, e);
            }}
            title={sun.isQuiz ? "Matahari Kuis (+50 Poin) - Jawab Soal" : "Matahari Biasa (+25 Poin)"}
            className="absolute z-40 cursor-pointer flex items-center justify-center select-none"
            style={{
              left: sun.x - 45,
              top: sun.y - 45,
              width: 90,
              height: 90,
              opacity: sun.isCollected ? Math.max(0, 1 - sun.collectAnimProgress) : 1,
              pointerEvents: sun.isCollected ? 'none' : 'auto',
              touchAction: 'none'
            }}
          >
            {/* Decoupled Visual Sun with generous drop-shadow & smooth hover */}
            <div className="w-[72px] h-[72px] pointer-events-none transition-transform duration-150 hover:scale-115 active:scale-95 drop-shadow-[0_0_14px_rgba(250,204,21,0.7)] animate-pulse relative">
              <SunSVG className="w-full h-full" isQuiz={sun.isQuiz} />

              {/* Tanda tanya badge mengambang di pojok matahari quiz */}
              {sun.isQuiz && (
                <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-slate-900 animate-bounce font-mono">
                  ?
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

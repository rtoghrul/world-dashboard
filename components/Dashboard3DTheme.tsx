'use client'

export default function Dashboard3DTheme() {
  return (
    <style jsx global>{`
      body {
        background: radial-gradient(circle at 15% 10%, rgba(59,130,246,.16), transparent 28rem), radial-gradient(circle at 85% 8%, rgba(168,85,247,.18), transparent 30rem), radial-gradient(circle at 50% 100%, rgba(20,184,166,.10), transparent 34rem), linear-gradient(180deg,#02030a 0%,#050511 42%,#030305 100%) !important;
        perspective: 1200px;
      }

      body::before {
        background: linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px), radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,.16), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(139,92,246,.10), transparent), radial-gradient(ellipse 50% 30% at 20% 80%, rgba(34,211,238,.08), transparent) !important;
        background-size: 52px 52px, 52px 52px, auto, auto, auto !important;
        mask-image: linear-gradient(to bottom, black 0%, black 68%, transparent 100%);
        opacity: .9 !important;
      }

      .wd-3d-stage { transform-style: preserve-3d; position: relative; }
      .wd-3d-stage::before,.wd-3d-stage::after { content:''; position:fixed; pointer-events:none; border-radius:9999px; filter:blur(10px); z-index:0; }
      .wd-3d-stage::before { width:22rem; height:22rem; top:5rem; right:-7rem; background:radial-gradient(circle, rgba(99,102,241,.18), transparent 65%); animation:wd-float-orb 12s ease-in-out infinite; }
      .wd-3d-stage::after { width:18rem; height:18rem; left:-6rem; top:22rem; background:radial-gradient(circle, rgba(34,211,238,.13), transparent 68%); animation:wd-float-orb 14s ease-in-out infinite reverse; }

      .wd-3d-hero { transform-style: preserve-3d; position: relative; isolation:isolate; }
      .wd-3d-hero::before { content:''; position:absolute; inset:1rem 4vw auto auto; width:clamp(7rem,13vw,13rem); aspect-ratio:1; border-radius:9999px; background:linear-gradient(135deg, rgba(255,255,255,.28), transparent 30%), radial-gradient(circle at 35% 30%, rgba(34,211,238,.42), transparent 18%), radial-gradient(circle at 65% 70%, rgba(168,85,247,.34), transparent 22%), linear-gradient(145deg, rgba(30,41,59,.55), rgba(3,7,18,.15)); border:1px solid rgba(255,255,255,.16); box-shadow:inset 0 0 30px rgba(255,255,255,.08),0 18px 60px rgba(99,102,241,.22),0 0 100px rgba(34,211,238,.10); transform:translateZ(55px) rotateX(12deg) rotateY(-18deg); animation:wd-globe-float 8s ease-in-out infinite; z-index:-1; }
      .wd-3d-title { text-shadow:0 0 20px rgba(129,140,248,.50),0 0 60px rgba(34,211,238,.16); letter-spacing:-.045em; }

      .wd-3d-stage .rounded-xl.border,.wd-3d-stage .glass,.wd-3d-stage .glass-card,.wd-3d-stage .section-card { position:relative; transform-style:preserve-3d; background:linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018) 35%, rgba(8,10,22,.84)), rgba(10,12,24,.72) !important; border-color:rgba(255,255,255,.09) !important; box-shadow:0 1px 0 rgba(255,255,255,.10) inset,0 18px 45px rgba(0,0,0,.38),0 0 0 1px rgba(255,255,255,.025),0 0 42px rgba(99,102,241,.055); backdrop-filter:blur(22px) saturate(1.55); -webkit-backdrop-filter:blur(22px) saturate(1.55); transition:transform .28s cubic-bezier(.2,.8,.2,1),border-color .28s ease,box-shadow .28s ease,background .28s ease; }
      .wd-3d-stage .rounded-xl.border::before,.wd-3d-stage .glass::before,.wd-3d-stage .section-card::before { content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none; background:linear-gradient(135deg, rgba(255,255,255,.16), transparent 34%, rgba(129,140,248,.10) 72%, transparent); opacity:.8; z-index:0; }
      .wd-3d-stage .rounded-xl.border > *,.wd-3d-stage .glass > *,.wd-3d-stage .section-card > * { position:relative; z-index:1; }
      .wd-3d-stage img.rounded-full { box-shadow:0 7px 20px rgba(0,0,0,.38),0 0 0 1px rgba(255,255,255,.08); }
      .wd-3d-stage .gradient-text { filter:drop-shadow(0 0 18px rgba(129,140,248,.42)); }

      @media (hover:hover) and (pointer:fine) { .wd-3d-stage .rounded-xl.border:hover,.wd-3d-stage .glass:hover,.wd-3d-stage .glass-card:hover,.wd-3d-stage .section-card:hover { transform:translateY(-7px) rotateX(1.6deg) rotateY(-1.2deg) translateZ(18px); border-color:rgba(129,140,248,.42) !important; box-shadow:0 1px 0 rgba(255,255,255,.14) inset,0 28px 70px rgba(0,0,0,.52),0 0 0 1px rgba(129,140,248,.16),0 0 75px rgba(99,102,241,.14),0 0 45px rgba(34,211,238,.06); } }
      @keyframes wd-float-orb { 0%,100%{transform:translate3d(0,0,0) scale(1);opacity:.8} 50%{transform:translate3d(0,-22px,40px) scale(1.06);opacity:1} }
      @keyframes wd-globe-float { 0%,100%{transform:translateZ(55px) translateY(0) rotateX(12deg) rotateY(-18deg)} 50%{transform:translateZ(70px) translateY(-12px) rotateX(16deg) rotateY(18deg)} }
      @media (max-width:768px) { body{perspective:none}.wd-3d-stage::before,.wd-3d-stage::after{opacity:.45;filter:blur(18px)}.wd-3d-hero::before{width:6rem;opacity:.55;right:-1rem;top:.75rem}.wd-3d-stage .rounded-xl.border:hover,.wd-3d-stage .glass:hover,.wd-3d-stage .glass-card:hover,.wd-3d-stage .section-card:hover{transform:translateY(-2px)} }
      @media (prefers-reduced-motion:reduce) { .wd-3d-stage::before,.wd-3d-stage::after,.wd-3d-hero::before{animation:none!important} }
    `}</style>
  )
}

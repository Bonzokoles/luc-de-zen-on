<!-- Optimized BgAnimation - CDN-based loading -->
<div class="bg-animation-optimized">
  <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10"></div>
  <div class="absolute inset-0 opacity-20">
    <div class="grid-pattern"></div>
  </div>
</div>

<style>
  .bg-animation-optimized {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    animation: subtle-pulse 4s ease-in-out infinite;
  }
  
  .grid-pattern {
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    animation: grid-move 20s linear infinite;
  }
  
  @keyframes subtle-pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
  
  @keyframes grid-move {
    0% { transform: translate(0, 0); }
    100% { transform: translate(40px, 40px); }
  }
</style>

<svelte:head>
  <title>På Jobb</title>
  <meta name="description" content="Fra befaring til ferdig jobb." />
</svelte:head>

<main>
  <section class="shell" aria-labelledby="title">
    <div class="mark" aria-hidden="true">PÅ</div>
    <p class="eyebrow">Utviklingsversjon</p>
    <h1 id="title">På Jobb</h1>
    <p class="tagline">Fra befaring til ferdig jobb.</p>
    <div class="status" role="status">
      <span class="dot" aria-hidden="true"></span>
      Grunnmuren er på plass
    </div>
  </section>
</main>

<style>
  :global(*) { box-sizing: border-box; }
  :global(html) { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f4f1ea; color: #1f2421; }
  :global(body) { margin: 0; min-width: 320px; }
  main { min-height: 100svh; display: grid; place-items: center; padding: max(1.5rem, env(safe-area-inset-top)) 1.25rem max(1.5rem, env(safe-area-inset-bottom)); }
  .shell { width: min(100%, 34rem); }
  .mark { width: 4rem; height: 4rem; display: grid; place-items: center; border: 2px solid currentColor; border-radius: 1rem; font-weight: 800; letter-spacing: -.06em; margin-bottom: 2.5rem; }
  .eyebrow { margin: 0 0 .55rem; font-size: .78rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; opacity: .62; }
  h1 { margin: 0; font-size: clamp(3.5rem, 18vw, 6.5rem); line-height: .9; letter-spacing: -.07em; }
  .tagline { margin: 1rem 0 3rem; font-size: clamp(1.15rem, 5vw, 1.55rem); line-height: 1.35; max-width: 24rem; }
  .status { display: inline-flex; align-items: center; gap: .65rem; padding: .8rem 1rem; border: 1px solid #c9c5ba; border-radius: 999px; background: rgba(255,255,255,.45); font-size: .9rem; }
  .dot { width: .6rem; height: .6rem; border-radius: 50%; background: currentColor; }
  @media (min-width: 48rem) { main { padding: 3rem; } }
</style>

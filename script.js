
    /* =====================
       INSTRUÇÕES DE CUSTOMIZAÇÃO (no código):
       - Para trocar símbolos: altere a array `SYMBOLS` abaixo.
       - Para personalizar a declaração: altere a variável `DECLARATION_TEXT`.
       - Para alterar estética: modifique as variáveis CSS em :root.
       =====================*/

    // Symbols can be emojis or SVG strings. Keep short strings.
    const SYMBOLS = ['🌸','🌟','💖','🌺','✨','🌙','💐','💫'];
    const WIN_SYMBOL = '💖'; // símbolo vencedor para o 3º giro
    const DECLARATION_TEXT = `Meu amor, joguei tudo em você — você é meu prêmio. Te amo ❤`;

    // DOM
    const spinBtn = document.getElementById('spinBtn');
    const attemptsEl = document.getElementById('attempts');
    const s1 = document.getElementById('s1');
    const s2 = document.getElementById('s2');
    const s3 = document.getElementById('s3');
    const reels = document.getElementById('reels');
    const winModal = document.getElementById('winModal');
    const prizeText = document.getElementById('prizeText');
    const closeModal = document.getElementById('closeModal');
    const confettiRoot = document.getElementById('confetti');

    let attempts = 0;
    let spinning = false;

    function pickRandom(){
      return SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)];
    }

    function setSymbols(a,b,c){
      s1.textContent = a;
      s2.textContent = b;
      s3.textContent = c;
    }

    // visual spin: rapidly switch symbols for a duration, then stop on values
    function visualSpin(duration = 900, targetSymbols = null){
      spinning = true;
      spinBtn.disabled = true;
      reels.classList.add('spinning');
      const interval = 80; // change symbol every 80ms

      const holders = [s1,s2,s3];
      const timerIds = [];
      const t0 = Date.now();

      // start quick cycling
      let cycleId = setInterval(()=>{
        holders.forEach(h=>h.textContent = pickRandom());
      }, interval);

      // after duration, stop cycling and set final
      setTimeout(()=>{
        clearInterval(cycleId);
        if(targetSymbols){
          setSymbols(targetSymbols[0], targetSymbols[1], targetSymbols[2]);
        } else {
          setSymbols(pickRandom(), pickRandom(), pickRandom());
        }
        reels.classList.remove('spinning');
        spinning = false;
        spinBtn.disabled = false;
      }, duration);
    }

    function playSpin(){
      if(spinning) return;
      attempts++;
      attemptsEl.textContent = attempts;

      if(attempts < 3){
        // first and second spin: random, no prize
        visualSpin(900, null);
        if(attempts === 2){
          // small note: second spin can't win — ensure not three equal
        }
      } else if(attempts === 3){
        // third spin: force a winning combination -- all WIN_SYMBOL
        visualSpin(1200, [WIN_SYMBOL, WIN_SYMBOL, WIN_SYMBOL]);
        // after spin completes show modal slightly later
        setTimeout(()=>{
          prizeText.textContent = DECLARATION_TEXT;
          showModal();
          burstConfetti();
        }, 1400);
        // disable button permanently after win
        spinBtn.disabled = true;
      } else {
        // more than 3: reset or ignore
        // Here we reset for simplicity
        resetGame();
      }
    }

    function showModal(){
      winModal.style.display = 'flex';
    }
    function hideModal(){
      winModal.style.display = 'none';
    }

    closeModal.addEventListener('click', hideModal);
    winModal.addEventListener('click', (e)=>{ if(e.target === winModal) hideModal(); });

    spinBtn.addEventListener('click', playSpin);

    function resetGame(){
      attempts = 0;
      attemptsEl.textContent = attempts;
      setSymbols(pickRandom(), pickRandom(), pickRandom());
      spinBtn.disabled = false;
    }

    // confetti hearts for celebration
    function burstConfetti(){
      confettiRoot.innerHTML = '';
      const count = 18;
      for(let i=0;i<count;i++){
        const div = document.createElement('div');
        div.className = 'c';
        div.style.left = (10 + Math.random()*80) + '%';
        div.style.top = (5 + Math.random()*5) + '%';
        div.style.animationDelay = (Math.random()*400) + 'ms';
        div.innerHTML = heartSVG(randomScale());
        confettiRoot.appendChild(div);
        // remove after animation
        setTimeout(()=>{ div.remove(); }, 2800);
      }
    }

    function randomScale(){ return 0.8 + Math.random()*0.8 }

    function heartSVG(scale=1){
      return `
        <svg viewBox="0 0 24 24" style="transform:scale(${scale});filter:drop-shadow(0 2px 4px rgba(150,40,90,0.25))" xmlns="http://www.w3.org/2000/svg">
          <path fill="${getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#ff6b9a'}" d="M12 21s-7.5-4.9-9.2-7.2C.9 10.9 3.3 6 7.6 6c2.2 0 3.9 1.3 4.4 2.8.5-1.5 2.2-2.8 4.4-2.8 4.3 0 6.7 4.9 4.8 7.8C19.5 16.1 12 21 12 21z"/>
        </svg>`;
    }

    // initialize
    resetGame();

    // Accessibility: allow Enter/Space to spin
    spinBtn.addEventListener('keyup', (e)=>{ if(e.key === 'Enter' || e.key === ' ') playSpin(); });


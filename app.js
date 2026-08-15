// AMSN app-style demo interactions. The production build will replace these local demo actions with API calls.
(() => {
  const qs = (s) => document.querySelector(s);
  const qsa = (s) => [...document.querySelectorAll(s)];

  function setActive(label) {
    qsa('.menu a').forEach(a => a.classList.toggle('active', a.textContent.toLowerCase().includes(label)));
    qsa('.mobilebar a').forEach(a => a.classList.toggle('active', a.textContent.toLowerCase().includes(label)));
  }

  function toast(message) {
    let el = qs('#amsn-toast');
    if (!el) { el = document.createElement('div'); el.id = 'amsn-toast'; document.body.appendChild(el); }
    el.textContent = message; el.classList.add('show');
    clearTimeout(window.__amsnToast); window.__amsnToast = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function createComposer() {
    const input = document.createElement('textarea');
    input.placeholder = 'Share a clinical insight, question or opportunity…';
    input.className = 'amsn-modal-input';
    return input;
  }

  function openCreate(kind = 'post') {
    const overlay = document.createElement('div');
    overlay.className = 'amsn-modal-overlay';
    const title = kind === 'video' ? 'Share a video' : kind === 'case' ? 'Create a clinical case' : kind === 'resource' ? 'Share a resource' : 'Create a post';
    overlay.innerHTML = `<div class="amsn-modal"><button class="amsn-close" aria-label="Close">×</button><h2>${title}</h2><p class="modal-note">Demo mode — your content will be saved to the AMSN account in the production app.</p><div id="modal-body"></div><div class="modal-actions"><button class="amsn-secondary close-modal">Cancel</button><button class="amsn-primary publish-demo">Publish</button></div></div>`;
    document.body.appendChild(overlay);
    const body = qs('#modal-body');
    if (kind === 'video') {
      body.innerHTML = `<label class="media-choice"><span>🎥</span><b>Record video</b><small>Use the device camera</small><input id="recordVideo" type="file" accept="video/*" capture="environment"></label><label class="media-choice"><span>📁</span><b>Upload video</b><small>Select an existing video</small><input id="uploadVideo" type="file" accept="video/*"></label><div id="selected-file"></div>`;
      qsa('input[type=file]').forEach(input => input.addEventListener('change', () => { if (input.files[0]) qs('#selected-file').textContent = `Selected: ${input.files[0].name}`; }));
    } else { body.appendChild(createComposer()); }
    const close = () => overlay.remove();
    overlay.querySelector('.amsn-close').onclick = close; overlay.querySelector('.close-modal').onclick = close;
    overlay.querySelector('.publish-demo').onclick = () => { close(); toast(`${title} ready — production will publish it to your AMSN feed.`); };
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  }

  function wire() {
    const compose = qs('.fakeinput'); if (compose) compose.onclick = () => openCreate('post');
    qsa('.composeactions .smallbtn').forEach(btn => btn.onclick = () => openCreate(btn.textContent.includes('Video') ? 'video' : btn.textContent.includes('case') ? 'case' : 'resource'));
    qsa('.mobilebar a').forEach(a => { if (a.textContent.includes('Create')) a.onclick = e => { e.preventDefault(); openCreate('post'); }; });
    qsa('.postactions span').forEach(action => action.onclick = () => { action.classList.toggle('action-active'); toast(action.textContent.includes('Like') ? 'Reaction updated' : action.textContent.includes('Discuss') ? 'Discussion opened' : 'Share link copied'); });
    const search = qs('.search'); if (search) search.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.value.trim()) { setActive('search'); toast(`Searching AMSN for “${e.target.value.trim()}”`); } });
    qsa('.menu a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); setActive(a.textContent.toLowerCase()); toast(`${a.textContent.trim()} section selected`); }));
    qsa('.toplinks a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); toast(`${a.textContent.trim()} opened`); }));
    const avatar = qs('.avatar'); if (avatar) avatar.onclick = () => { setActive('profile'); toast('Profile opened'); };
  }

  const style = document.createElement('style'); style.textContent = `#amsn-toast{position:fixed;left:50%;bottom:85px;transform:translate(-50%,20px);background:#102d3d;color:#fff;padding:11px 16px;border-radius:9px;font-size:13px;opacity:0;pointer-events:none;transition:.2s;z-index:100}.show{opacity:1!important;transform:translate(-50%,0)!important}.action-active{color:#0b6b57!important;font-weight:800}.amsn-modal-overlay{position:fixed;inset:0;background:#10203380;display:grid;place-items:center;padding:20px;z-index:90}.amsn-modal{width:min(520px,100%);background:#fff;border-radius:16px;padding:24px;box-shadow:0 20px 60px #0004;position:relative}.amsn-modal h2{margin:0 0 6px}.modal-note{font-size:12px;color:#687887}.amsn-close{position:absolute;right:15px;top:12px;border:0;background:none;font-size:27px;color:#687887}.amsn-modal-input{width:100%;min-height:130px;resize:vertical;border:1px solid #d9e1e7;border-radius:10px;padding:13px;font:inherit}.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.amsn-primary,.amsn-secondary{border:0;border-radius:8px;padding:10px 16px;font-weight:800}.amsn-primary{background:#0b6b57;color:#fff}.amsn-secondary{background:#eef2f4;color:#344554}.media-choice{display:flex;align-items:center;gap:12px;border:1px solid #dfe6eb;border-radius:10px;padding:14px;margin-top:10px;cursor:pointer}.media-choice span{font-size:25px}.media-choice b{display:block}.media-choice small{display:block;color:#72808c}.media-choice input{margin-left:auto;max-width:120px}.media-choice input[type=file]{font-size:11px}@media(max-width:680px){.amsn-modal-overlay{align-items:end;padding:0}.amsn-modal{border-radius:18px 18px 0 0;padding:20px}.media-choice input{max-width:105px}}`;
  document.head.appendChild(style);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();

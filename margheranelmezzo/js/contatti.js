// Contatti: "Copia indirizzo" copies the email address and confirms for 2 seconds.
(() => {
const { t } = window.MNM;

const EMAIL = 'margheranelmezzo@gmail.com';
const btn = document.getElementById('copy');
let timer;

btn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
  } catch (e) {
    const tmp = Object.assign(document.createElement('input'), { value: EMAIL });
    document.body.append(tmp); tmp.select(); document.execCommand('copy'); tmp.remove();
  }
  btn.textContent = t('contatti.copied');
  clearTimeout(timer);
  timer = setTimeout(() => { btn.textContent = t('contatti.copy'); }, 2000);
});
})();

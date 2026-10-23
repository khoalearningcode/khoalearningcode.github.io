const copyButton = document.querySelector('#copy-email');
copyButton?.addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('minhkhoaae@gmail.com');
    status.textContent = 'Email copied.';
  } catch {
    status.textContent = 'minhkhoaae@gmail.com';
  }
});

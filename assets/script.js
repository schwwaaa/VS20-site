// Alpha signup. The form posts straight to a Google Form.
// To connect it: open the Google Form, choose Send, and copy the link. Replace FORM_ID below with the
// long ID from that link. Then set each entry ID to the matching question's "entry.NNN" name, found by
// opening the form's preview with "?usp=pp_url" filled in, or from the pre-filled link.
const GOOGLE_FORM = {
  action: 'https://docs.google.com/forms/d/e/FORM_ID/formResponse',
  fields: {
    email: 'entry.EMAIL_ID',
    name: 'entry.NAME_ID',
    notes: 'entry.NOTES_ID',
  },
};

// The demo video. Set data-youtube-id on #demoVideo to the video's ID to show it; until then the
// placeholder stays.
(function () {
  const holder = document.getElementById('demoVideo');
  const id = holder && holder.dataset.youtubeId;
  if (!id || id === 'PLACEHOLDER') return;
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
  frame.title = 'VS20 demo video';
  frame.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  frame.allowFullscreen = true;
  holder.replaceChildren(frame);
})();

(function () {
  const form = document.getElementById('alphaForm');
  const status = document.getElementById('formStatus');
  const button = form.querySelector('button');

  const setStatus = (text, isError) => {
    status.textContent = text;
    status.classList.toggle('error', Boolean(isError));
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Enter a valid email address.', true);
      form.elements.email.focus();
      return;
    }

    if (GOOGLE_FORM.action.includes('FORM_ID')) {
      setStatus('Signup is not connected yet. Please try again later.', true);
      return;
    }

    const body = new URLSearchParams();
    Object.entries(GOOGLE_FORM.fields).forEach(([name, entry]) => {
      body.append(entry, String(data.get(name) || '').trim());
    });

    button.disabled = true;
    setStatus('Sending…');
    try {
      // Google Forms does not send CORS headers, so the request is sent without reading the reply.
      await fetch(GOOGLE_FORM.action, { method: 'POST', mode: 'no-cors', body });
      form.reset();
      setStatus('Thanks. We will be in touch with alpha access.');
    } catch (err) {
      setStatus('Something went wrong. Please try again.', true);
    } finally {
      button.disabled = false;
    }
  });
})();

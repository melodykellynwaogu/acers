    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');
    mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Intersection Observer for content sections to fade in on scroll
    const sections = document.querySelectorAll('.content-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));

    // Typing effect for hero subtitle
    const typingElement = document.querySelector('.typing-effect');
    const words = ['Cybersecurity Threats', 'Daily Conversation', 'Real-time Events', 'Training on Complex Code'];
    let wordIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < words[wordIndex].length) {
        typingElement.textContent += words[wordIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
      } else {
        setTimeout(erase, 2000);
      }
    }

    function erase() {
      if (charIndex > 0) {
        typingElement.textContent = words[wordIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
      } else {
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
      }
    }

    document.addEventListener('DOMContentLoaded', () => setTimeout(type, 500));

    // ===== Chat widget behavior =====
    (() => {
      const CHAT_SERVER_URL = 'https://starbase-h18m.onrender.com/chat'; // <-- REPLACE this with your Render URL

      const chatToggle = document.getElementById('chat-toggle');
      const chatPanel = document.getElementById('chat-panel');
      const chatClose = document.getElementById('chat-close');
      const chatForm = document.getElementById('chat-form');
      const chatInput = document.getElementById('chat-input');
      const chatMessages = document.getElementById('chat-messages');

      if (!chatToggle || !chatPanel) return;

      function openPanel() {
        chatPanel.classList.add('open');
        chatPanel.setAttribute('aria-hidden', 'false');
        chatInput.focus();
      }

      function closePanel() {
        chatPanel.classList.remove('open');
        chatPanel.setAttribute('aria-hidden', 'true');
        chatToggle.focus();
      }

      chatToggle.addEventListener('click', () => {
        if (chatPanel.classList.contains('open')) closePanel(); else openPanel();
      });
      chatClose.addEventListener('click', closePanel);

      function appendMessage(text, who = 'bot') {
        const el = document.createElement('div');
        el.className = 'chat-bubble ' + (who === 'user' ? 'user' : 'bot');
        el.textContent = text;
        chatMessages.appendChild(el);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return el;
      }

      async function sendToServer(messageText) {
        try {
          const resp = await fetch(CHAT_SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageText })
          });
          if (!resp.ok) throw new Error('Network response was not ok');

          // Try to parse JSON first; if it fails, fall back to text
          let data;
          try {
            data = await resp.json();
          } catch (e) {
            const txt = await resp.text();
            return txt;
          }

          // Prefer common keys: bot_message, reply, message
          let reply = data?.bot_message ?? data?.reply ?? data?.message;

          // If reply is an object or array, try to extract common text fields
          if (reply && typeof reply === 'object') {
            if (Array.isArray(reply)) {
              reply = reply.map(item => (typeof item === 'string' ? item : JSON.stringify(item))).join('\n');
            } else {
              reply = reply.text ?? reply.content ?? JSON.stringify(reply);
            }
          }

          if (reply == null) {
            // If no expected fields, try to stringify a top-level string or return a safe representation
            if (typeof data === 'string') return data;
            return JSON.stringify(data);
          }

          return String(reply);
        } catch (err) {
          return 'Sorry, I could not reach the chat server. Check the CHAT_SERVER_URL in `index.js`.';
        }
      }

      chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        appendMessage(text, 'user');
        chatInput.value = '';

        // Add a placeholder bot bubble and keep a reference so we can replace its content
        const placeholder = appendMessage('…', 'bot');
        const reply = await sendToServer(text);
        if (placeholder) placeholder.textContent = reply;
      });

      // Allow Enter to send
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          chatForm.requestSubmit();
        }
      });

    })();
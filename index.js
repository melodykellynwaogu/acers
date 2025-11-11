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
    const words = ['Cybersecurity Threats', 'Quantum Physics', 'Real-time Events', 'Complex Code'];
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
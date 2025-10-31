import "./style.css";

/**
 * Kebler Corner - Main JavaScript
 * Handles interactive features and accessibility
 */

// =====================================================
// FAQ Accordion Functionality
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // Mobile Drawer and Hamburger Menu
  // =====================================================
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const mobileDrawer = document.querySelector(".mobile-drawer");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const mobileNavSubmenus = document.querySelectorAll(".mobile-nav-submenu");

  if (hamburgerMenu && mobileDrawer) {
    // Toggle drawer on hamburger click
    hamburgerMenu.addEventListener("click", () => {
      hamburgerMenu.classList.toggle("active");
      mobileDrawer.classList.toggle("open");
      document.body.classList.toggle("drawer-open");
    });

    // Close drawer when clicking on a nav link
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        // Check if this is a submenu toggle
        const submenu = link.parentElement.querySelector(".mobile-nav-submenu");
        if (submenu) {
          e.preventDefault();
          submenu.classList.toggle("open");
        } else {
          // Close drawer on regular link click
          hamburgerMenu.classList.remove("active");
          mobileDrawer.classList.remove("open");
          document.body.classList.remove("drawer-open");
        }
      });
    });

    // Close drawer when clicking overlay
    document.addEventListener("click", (e) => {
      if (
        e.target === document.body.querySelector("body::before") ||
        (e.target === mobileDrawer && !e.target.contains(hamburgerMenu))
      ) {
        hamburgerMenu.classList.remove("active");
        mobileDrawer.classList.remove("open");
        document.body.classList.remove("drawer-open");
      }
    });

    // Close drawer on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileDrawer.classList.contains("open")) {
        hamburgerMenu.classList.remove("active");
        mobileDrawer.classList.remove("open");
        document.body.classList.remove("drawer-open");
      }
    });
  }

  // =====================================================
  // Hero Dropdown Functionality
  // =====================================================
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", () => {
      const isExpanded =
        dropdownToggle.getAttribute("aria-expanded") === "true";
      dropdownToggle.setAttribute("aria-expanded", !isExpanded);
      dropdownMenu.hidden = isExpanded;
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !dropdownToggle.contains(e.target) &&
        !dropdownMenu.contains(e.target)
      ) {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.hidden = true;
      }
    });
  }

  // FAQ Toggle
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const toggle = item.querySelector(".faq-toggle");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      // Toggle active state
      const isActive = item.classList.contains("active");

      // Close all FAQ items
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        const otherToggle = otherItem.querySelector(".faq-toggle");
        otherAnswer.setAttribute("aria-hidden", "true");
        otherToggle.setAttribute("aria-expanded", "false");
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add("active");
        answer.setAttribute("aria-hidden", "false");
        toggle.setAttribute("aria-expanded", "true");
      }
    });

    // Keyboard accessibility
    question.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        question.click();
      }
    });
  });

  // =====================================================
  // Email Signup Form Handling
  // =====================================================
  const signupForm = document.querySelector(".signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = signupForm.querySelector("#email");
      const email = emailInput.value.trim();

      // Basic email validation
      if (validateEmail(email)) {
        // In production, this would send to a backend
        alert(
          `Thank you for signing up! We'll send promotional emails to ${email}`
        );
        emailInput.value = "";
      } else {
        alert("Please enter a valid email address.");
      }
    });
  }

  // =====================================================
  // Smooth Scrolling for Navigation Links
  // =====================================================
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Skip if it's just "#"
      if (href === "#") {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const headerOffset = 80; // Height of fixed header
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Update active nav link
        document.querySelectorAll(".nav-link").forEach((navLink) => {
          navLink.classList.remove("active");
        });

        if (link.classList.contains("nav-link")) {
          link.classList.add("active");
        }
      }
    });
  });

  // =====================================================
  // Cabin Category and Detail Switching
  // =====================================================
  const cabinCategories = document.querySelectorAll(".cabin-category");
  const cabinListItems = document.querySelectorAll(".cabin-list li");

  // Category switching
  cabinCategories.forEach((category) => {
    category.addEventListener("click", () => {
      // Remove active from all categories
      cabinCategories.forEach((cat) => {
        cat.classList.remove("active");
        cat.setAttribute("aria-selected", "false");
      });

      // Add active to clicked category
      category.classList.add("active");
      category.setAttribute("aria-selected", "true");

      // Show first cabin in category
      const firstCabin = category.querySelector(".cabin-list li");
      if (firstCabin) {
        firstCabin.click();
      }
    });

    // Keyboard navigation for categories
    category.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        category.click();
      }
    });
  });

  // Cabin detail switching
  cabinListItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active from all cabin list items
      cabinListItems.forEach((cabin) => {
        cabin.classList.remove("active");
      });

      // Add active to clicked item
      item.classList.add("active");

      // In a full implementation, this would switch the displayed cabin detail
      // For now, we're just showing The Log House by default
    });
  });

  // =====================================================
  // Header Scroll Effect
  // =====================================================
  let lastScroll = 0;
  //   const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    lastScroll = currentScroll;
  });

  // =====================================================
  // Intersection Observer for Animations
  // =====================================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".cabin-category, .testimonial-card, .faq-item, .signup-card"
  );

  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });
});

// =====================================================
// Helper Functions
// =====================================================

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

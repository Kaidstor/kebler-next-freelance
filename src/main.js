import "./style.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

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
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  dropdownToggles.forEach((dropdownToggle) => {
    const dropdownId = dropdownToggle.getAttribute("aria-controls");
    const dropdownMenu = document.getElementById(dropdownId);

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isExpanded =
          dropdownToggle.getAttribute("aria-expanded") === "true";
        dropdownToggle.setAttribute("aria-expanded", !isExpanded);
        dropdownMenu.hidden = isExpanded;
      });

      // Close dropdown when clicking on a dropdown item
      const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");
      dropdownItems.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const selectedText = item.textContent.trim();
          const label = dropdownToggle.querySelector(".dropdown-label");
          if (label) {
            label.textContent = selectedText;
          }
          dropdownToggle.setAttribute("aria-expanded", "false");
          dropdownMenu.hidden = true;
        });
      });
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    dropdownToggles.forEach((dropdownToggle) => {
      const dropdownId = dropdownToggle.getAttribute("aria-controls");
      const dropdownMenu = document.getElementById(dropdownId);

      if (
        dropdownMenu &&
        !dropdownToggle.contains(e.target) &&
        !dropdownMenu.contains(e.target)
      ) {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.hidden = true;
      }
    });
  });

  // =====================================================
  // Counter Input Functionality (Adults/Children)
  // =====================================================
  const counterInputs = document.querySelectorAll(".counter-input");

  counterInputs.forEach((input) => {
    const wrapper = input.closest("div");
    const minusBtn = wrapper?.querySelector(".counter-btn-minus");
    const plusBtn = wrapper?.querySelector(".counter-btn-plus");
    const minValue = parseInt(input.getAttribute("min")) || 0;
    const maxValue = parseInt(input.getAttribute("max")) || Infinity;

    function updateValue(newValue) {
      const numValue = parseInt(newValue) || 0;
      const clampedValue = Math.max(0, Math.min(maxValue, numValue));

      // Если значение равно 0, очищаем input чтобы показать placeholder
      if (clampedValue === 0) {
        input.value = "";
        if (minusBtn) minusBtn.disabled = true;
        if (plusBtn) plusBtn.disabled = false;
      } else {
        input.value = clampedValue;
        // Update button states - минус активен всегда когда значение > 0
        if (minusBtn) {
          minusBtn.disabled = false;
        }
        if (plusBtn) {
          plusBtn.disabled = clampedValue >= maxValue;
        }
      }
    }

    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        const currentValue = parseInt(input.value) || minValue;
        if (currentValue > 0) {
          // Уменьшаем на 1, если значение > 0
          updateValue(currentValue - 1);
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        const currentValue = parseInt(input.value);
        if (isNaN(currentValue) || currentValue === 0) {
          // Если поле пустое или равно 0, устанавливаем минимальное значение или 1
          const startValue = minValue === 0 ? 1 : minValue;
          updateValue(startValue);
        } else {
          updateValue(currentValue + 1);
        }
      });
    }

    input.addEventListener("input", (e) => {
      const value = e.target.value;
      if (value === "" || value === "0") {
        input.value = "";
        if (minusBtn) minusBtn.disabled = true;
        if (plusBtn) plusBtn.disabled = false;
      } else {
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
          if (numValue < minValue) {
            // Если значение меньше минимума, устанавливаем минимум или 0
            updateValue(minValue);
          } else {
            updateValue(value);
          }
        }
      }
    });

    input.addEventListener("blur", () => {
      const value = input.value;
      if (!value || value === "" || value === "0") {
        input.value = "";
        if (minusBtn) minusBtn.disabled = true;
        if (plusBtn) plusBtn.disabled = false;
      } else {
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
          if (numValue < minValue) {
            updateValue(minValue);
          } else {
            updateValue(value);
          }
        }
      }
    });

    // Initialize button states
    if (input.value && parseInt(input.value) >= minValue) {
      updateValue(input.value);
    } else {
      input.value = "";
      if (minusBtn) minusBtn.disabled = true;
      if (plusBtn) plusBtn.disabled = false;
    }
  });

  // =====================================================
  // Date Picker (Check In / Check Out)
  // =====================================================
  const checkInInput = document.getElementById("check-in-input");
  const checkOutInput = document.getElementById("check-out-input");

  if (checkInInput && checkOutInput) {
    let checkInPicker;
    let checkOutPicker;

    // Инициализация календаря для Check In
    checkInPicker = flatpickr(checkInInput, {
      dateFormat: "Y-m-d",
      minDate: "today",
      onChange: function (selectedDates, dateStr) {
        // При выборе Check In, обновляем минимальную дату для Check Out
        if (checkOutPicker && selectedDates.length > 0) {
          const nextDay = new Date(selectedDates[0]);
          nextDay.setDate(nextDay.getDate() + 1);
          checkOutPicker.set("minDate", nextDay);

          // Если Check Out уже выбран и раньше Check In, очищаем его
          if (checkOutPicker.selectedDates.length > 0) {
            const checkOutDate = checkOutPicker.selectedDates[0];
            if (checkOutDate <= selectedDates[0]) {
              checkOutPicker.clear();
            }
          }
        }
      },
      onClose: function (selectedDates, dateStr) {
        // Можно добавить форматирование даты
        if (dateStr) {
          const date = new Date(dateStr);
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          checkInInput.value = formattedDate;
        }
      },
    });

    // Инициализация календаря для Check Out
    checkOutPicker = flatpickr(checkOutInput, {
      dateFormat: "Y-m-d",
      minDate: "today",
      onChange: function (selectedDates, dateStr) {
        // При выборе Check Out, обновляем максимальную дату для Check In
        if (checkInPicker && selectedDates.length > 0) {
          const prevDay = new Date(selectedDates[0]);
          prevDay.setDate(prevDay.getDate() - 1);
          checkInPicker.set("maxDate", prevDay);
        }
      },
      onClose: function (selectedDates, dateStr) {
        // Можно добавить форматирование даты
        if (dateStr) {
          const date = new Date(dateStr);
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          checkOutInput.value = formattedDate;
        }
      },
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
  // Cabin Sidebar Active State on Scroll
  // =====================================================
  const cabinMenuItems = document.querySelectorAll(".cabin-menu-item");
  const cabinMainContents = document.querySelectorAll(".cabin-main-content");
  const mobileSidebars = document.querySelectorAll(".cabin-listing-sidebar");

  if (cabinMenuItems.length > 0 && cabinMainContents.length > 0) {
    let isScrolling = false;
    let currentActiveIndex = 0;

    // Determine max index based on available elements
    const maxIndex = Math.min(
      cabinMenuItems.length - 1,
      cabinMainContents.length - 1,
      mobileSidebars.length > 0
        ? mobileSidebars[0].querySelectorAll(".size-2").length - 1
        : cabinMainContents.length - 1
    );

    // Function to update active states
    function updateActiveStates(activeIndex) {
      // Clamp index to valid range
      const clampedIndex = Math.max(0, Math.min(activeIndex, maxIndex));
      currentActiveIndex = clampedIndex;

      // Update desktop sidebar
      cabinMenuItems.forEach((item, index) => {
        if (index === currentActiveIndex) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });

      // Update mobile sidebars (dots)
      mobileSidebars.forEach((sidebar) => {
        const dots = sidebar.querySelectorAll(".size-2");
        dots.forEach((dot, index) => {
          if (index === currentActiveIndex) {
            dot.classList.add("active");
          } else {
            dot.classList.remove("active");
          }
        });
      });

      // Update mobile_active class for mobile visibility
      cabinMainContents.forEach((content, index) => {
        if (index === currentActiveIndex) {
          content.classList.add("mobile_active");
        } else {
          content.classList.remove("mobile_active");
        }
      });

      // Update button states
      updateButtonStates();
    }

    // Function to update button enabled/disabled states
    function updateButtonStates() {
      mobileSidebars.forEach((sidebar) => {
        const buttons = sidebar.querySelectorAll("button");
        const prevButton = buttons[0];
        const nextButton = buttons[1];

        if (prevButton) {
          prevButton.disabled = currentActiveIndex <= 0;
          prevButton.style.opacity = currentActiveIndex <= 0 ? "0.5" : "1";
          prevButton.style.cursor =
            currentActiveIndex <= 0 ? "not-allowed" : "pointer";
        }

        if (nextButton) {
          nextButton.disabled = currentActiveIndex >= maxIndex;
          nextButton.style.opacity =
            currentActiveIndex >= maxIndex ? "0.5" : "1";
          nextButton.style.cursor =
            currentActiveIndex >= maxIndex ? "not-allowed" : "pointer";
        }
      });
    }

    // Create intersection observer to track visible cabin sections
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px", // Trigger when section is in upper-middle viewport
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const cabinObserver = new IntersectionObserver((entries) => {
      if (isScrolling) return; // Skip updates during programmatic scrolling

      // Find the section with highest intersection ratio
      let maxRatio = 0;
      let activeIndex = -1;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          activeIndex = Array.from(cabinMainContents).indexOf(entry.target);
        }
      });

      // If we found an active section, update all states
      if (activeIndex !== -1) {
        updateActiveStates(activeIndex);
      }
    }, observerOptions);

    // Observe all cabin sections
    cabinMainContents.forEach((section) => {
      cabinObserver.observe(section);
    });

    // Handle click on sidebar items to scroll to corresponding section
    cabinMenuItems.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        // Set flag to prevent observer from updating during scroll
        isScrolling = true;

        // Update active states
        updateActiveStates(index);

        // Scroll to corresponding cabin section
        if (cabinMainContents[index]) {
          const headerOffset = 100;
          const elementPosition =
            cabinMainContents[index].getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Re-enable observer after scroll completes
          setTimeout(() => {
            isScrolling = false;
          }, 1000);
        } else {
          isScrolling = false;
        }
      });
    });

    // =====================================================
    // Mobile Sidebar Navigation Buttons
    // =====================================================
    mobileSidebars.forEach((sidebar) => {
      const buttons = sidebar.querySelectorAll("button");
      const prevButton = buttons[0]; // Left arrow
      const nextButton = buttons[1]; // Right arrow

      if (prevButton && nextButton) {
        prevButton.addEventListener("click", () => {
          if (currentActiveIndex > 0) {
            updateActiveStates(currentActiveIndex - 1);
          }
        });

        nextButton.addEventListener("click", () => {
          if (currentActiveIndex < maxIndex) {
            updateActiveStates(currentActiveIndex + 1);
          }
        });
      }
    });

    // Initialize: set first item as active
    updateActiveStates(0);
  }

  // =====================================================
  // Cabin Gallery Thumbnail Slider
  // =====================================================
  const cabinGalleries = document.querySelectorAll(".cabin-gallery");

  cabinGalleries.forEach((gallery) => {
    const mainImage = gallery.querySelector(".cabin-main-image img");
    const thumbnails = gallery.querySelectorAll(".cabin-thumbnails .thumbnail");
    const mobileThumbnails = gallery.querySelectorAll(
      ".cabin-thumbnails-wrapper-mobile .thumbnail"
    );

    if (!mainImage || thumbnails.length === 0) return;

    // Handle desktop thumbnails
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        // Remove active class from all thumbnails
        thumbnails.forEach((thumb) => thumb.classList.remove("active"));
        mobileThumbnails.forEach((thumb) => thumb.classList.remove("active"));

        // Add active class to clicked thumbnail
        thumbnail.classList.add("active");
        if (mobileThumbnails[index]) {
          mobileThumbnails[index].classList.add("active");
        }

        // Scroll to active thumbnail
        const wrapper = gallery.querySelector(".cabin-thumbnails-wrapper");
        if (wrapper) {
          thumbnail.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }

        // Update main image
        const thumbnailImg = thumbnail.querySelector("img");
        if (thumbnailImg) {
          mainImage.src = thumbnailImg.src;
          mainImage.alt = thumbnailImg.alt;
        }
      });
    });

    // Handle mobile thumbnails
    mobileThumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        // Remove active class from all thumbnails
        thumbnails.forEach((thumb) => thumb.classList.remove("active"));
        mobileThumbnails.forEach((thumb) => thumb.classList.remove("active"));

        // Add active class to clicked thumbnail
        thumbnail.classList.add("active");
        if (thumbnails[index]) {
          thumbnails[index].classList.add("active");
        }

        // Scroll to active thumbnail (mobile)
        const mobileWrapper = gallery.querySelector(
          ".cabin-thumbnails-wrapper-mobile"
        );
        if (mobileWrapper) {
          thumbnail.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }

        // Update main image
        const thumbnailImg = thumbnail.querySelector("img");
        if (thumbnailImg) {
          mainImage.src = thumbnailImg.src;
          mainImage.alt = thumbnailImg.alt;
        }
      });
    });
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

  // =====================================================
  // RV Sites Image Slider
  // =====================================================

  // Individual card image sliders (fade effect)
  const imageSliders = document.querySelectorAll(".rv-image-slider");

  imageSliders.forEach((slider) => {
    const images = slider.querySelectorAll(".rv-image");
    const prevBtn = slider.querySelector(".rv-prev-btn");
    const nextBtn = slider.querySelector(".rv-next-btn");
    let currentIndex = 0;

    function showImage(index) {
      // Remove active class from all images
      images.forEach((img) => {
        img.classList.remove("active");
        img.style.opacity = "0";
      });

      // Add active class to current image
      images[index].classList.add("active");
      images[index].style.opacity = "1";
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        prevImage();
      });

      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        nextImage();
      });
    }
  });

  // Horizontal card slider
  const rvSliderWrapper = document.querySelector(".rv-slider-wrapper");
  const rvMainPrev = document.querySelector(".rv-main-prev");
  const rvMainNext = document.querySelector(".rv-main-next");

  if (rvSliderWrapper && rvMainPrev && rvMainNext) {
    const cards = rvSliderWrapper.querySelectorAll(".rv-slider-card");
    let currentSlide = 0;

    function getCardsPerView() {
      const width = window.innerWidth;
      if (width >= 768) return 2; // md
      return 1; // mobile
    }

    function updateSlider() {
      const cardsPerView = getCardsPerView();
      const cardWidth = cards[0].offsetWidth;
      const gap = 20; // gap-5 = 20px
      const offset = currentSlide * (cardWidth + gap);
      rvSliderWrapper.style.transform = `translateX(-${offset}px)`;
    }

    function nextSlide() {
      const cardsPerView = getCardsPerView();
      const maxSlide = Math.max(0, cards.length - cardsPerView);
      currentSlide = Math.min(currentSlide + 1, maxSlide);
      updateSlider();
    }

    function prevSlide() {
      currentSlide = Math.max(currentSlide - 1, 0);
      updateSlider();
    }

    rvMainNext.addEventListener("click", nextSlide);
    rvMainPrev.addEventListener("click", prevSlide);

    // Update on window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        currentSlide = 0;
        updateSlider();
      }, 250);
    });
  }
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

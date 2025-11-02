
document.addEventListener('DOMContentLoaded', () => {
  // Initialize intl-tel-input for all tel inputs globally
  if (typeof intlTelInput !== 'undefined') {
    const telInputs = document.querySelectorAll('input[type="tel"]');
    telInputs.forEach(input => {
      // Skip if already initialized
      if (input.closest('.iti')) return;
      
      intlTelInput(input, {
        initialCountry: "auto",
        geoIpLookup: function(callback) {
          fetch("https://ipapi.co/json/")
            .then(function(res) { return res.json(); })
            .then(function(data) { callback(data.country_code); })
            .catch(function() { callback("us"); });
        },
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@21.2.3/build/js/utils.js",
        separateDialCode: true,
        preferredCountries: ["us", "gb", "ca", "au", "in"]
      });
    });
  }

  function attachPasswordToggle(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    const icon = button?.querySelector('i');
    if (!input || !button || !icon) return;
    button.addEventListener('click', () => {
      const isPasswordType = input.type === 'password';
      input.type = isPasswordType ? 'text' : 'password';
      icon.classList.toggle('bi-eye');
      icon.classList.toggle('bi-eye-slash');
      button.setAttribute('aria-label', isPasswordType ? 'Hide password' : 'Show password');
    });
  }
  attachPasswordToggle('password', 'togglePassword');
  attachPasswordToggle('confirmpassword', 'toggleConfirmPassword');

  const otpInputs = document.querySelectorAll('.otp-input');
  if (otpInputs.length > 0) {
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) {
          e.target.value = '';
          return;
        }
        if (value && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        pastedData.split('').forEach((digit, i) => {
          if (otpInputs[i]) {
            otpInputs[i].value = digit;
          }
        });
        const nextEmptyIndex = pastedData.length < otpInputs.length ? pastedData.length : otpInputs.length - 1;
        if (otpInputs[nextEmptyIndex]) {
          otpInputs[nextEmptyIndex].focus();
        }
      });
    });
  }

  const $country = window.jQuery ? window.jQuery('#countryCodeSelect') : null;
  const $countrySelect = window.jQuery ? window.jQuery('#countrySelect') : null;
  
  if ($country && $country.length) {
    function isoToFlagEmoji(iso) {
      if (!iso) return '';
      return iso
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
    }

    function formatCountry(option) {
      if (!option.id) {
        return option.text;
      }
      const iso = option.element?.getAttribute('data-iso');
      const flag = isoToFlagEmoji(iso);
      const $container = window.jQuery(
        `<span>${flag ? flag + ' ' : ''}${option.text}</span>`
      );
      return $container;
    }

    $country.select2({
      placeholder: 'Country code',
      allowClear: true,
      width: '100%',
      dropdownParent: window.jQuery('#login-form'),
      templateResult: formatCountry,
      templateSelection: formatCountry
    });
  }

  if ($countrySelect && $countrySelect.length) {
    function isoToFlagEmoji(iso) {
      if (!iso) return '';
      return iso
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
    }

    function formatCountry(option) {
      if (!option.id) {
        return option.text;
      }
      const iso = option.element?.getAttribute('data-iso');
      const flag = isoToFlagEmoji(iso);
      const $container = window.jQuery(
        `<span>${flag ? flag + ' ' : ''}${option.text}</span>`
      );
      return $container;
    }

    $countrySelect.select2({
      placeholder: 'Select country',
      allowClear: true,
      width: '100%',
      dropdownParent: window.jQuery('#login-form'),
      templateResult: formatCountry,
      templateSelection: formatCountry
    });
  }

  const $region = window.jQuery ? window.jQuery('#regionSelect') : null;
  const $breed = window.jQuery ? window.jQuery('#breedSelect') : null;
  const $bloodline = window.jQuery ? window.jQuery('#bloodlineSelect') : null;
  const $postType = window.jQuery ? window.jQuery('#postTypeSelect') : null;
  const dropdownParent = window.jQuery('body');
  [$region, $breed, $bloodline, $postType].forEach($el => {
    if ($el && $el.length) {
      $el.select2({
        placeholder: 'Select',
        width: '100%',
        allowClear: true,
        dropdownParent
      });
    }
  });

  // Handle all accordion toggle icons
  function initializeAccordionToggle(collapseId, iconId) {
    const toggleIcon = document.getElementById(iconId);
    const collapse = document.getElementById(collapseId);
    
    if (toggleIcon && collapse) {
      collapse.addEventListener('show.bs.collapse', () => {
        toggleIcon.classList.remove('bi-chevron-down');
        toggleIcon.classList.add('bi-chevron-up');
      });
      
      collapse.addEventListener('hide.bs.collapse', () => {
        toggleIcon.classList.remove('bi-chevron-up');
        toggleIcon.classList.add('bi-chevron-down');
      });
    }
  }

  // Initialize all accordions
  initializeAccordionToggle('filtersCollapse', 'filterToggleIcon');
  initializeAccordionToggle('littersFiltersCollapse', 'littersFilterToggleIcon');

  // Initialize Select2 for litters page filters
  const $kennelSelect = window.jQuery ? window.jQuery('#kennelSelect') : null;
  const $breedSelect = window.jQuery ? window.jQuery('#breedSelect') : null;
  const $locationSelect = window.jQuery ? window.jQuery('#locationSelect') : null;
  const littersDropdownParent = window.jQuery('body');
  
  [$kennelSelect, $breedSelect, $locationSelect].forEach($el => {
    if ($el && $el.length) {
      $el.select2({
        placeholder: 'Select',
        width: '100%',
        allowClear: true,
        dropdownParent: littersDropdownParent
      });
    }
  });

  // Handle offcanvas open/close for Select2 dropdowns
  const offcanvasElement = document.getElementById('offcanvasExample');
  if (offcanvasElement) {
    offcanvasElement.addEventListener('show.bs.offcanvas', () => {
      document.body.classList.add('offcanvas-open');
    });
    
    offcanvasElement.addEventListener('hide.bs.offcanvas', () => {
      document.body.classList.remove('offcanvas-open');
    });
  }

  const fileInput = document.getElementById('profileInput');
  const imgPreview = document.getElementById('profilePreview');
  const placeholder = document.querySelector('.avatar-placeholder');
  if (fileInput && imgPreview) {
    if (!imgPreview.getAttribute('src')) {
      if (placeholder) placeholder.classList.remove('d-none');
    }
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        imgPreview.src = String(ev.target?.result || '');
        if (placeholder) placeholder.classList.add('d-none');
      };
      reader.readAsDataURL(file);
    });
  }

  // Homepage post creation functionality
  const dropdownToggle = document.getElementById('postTypeDropdown');
  const typeIndicator = document.querySelector('.type-indicator');
  const textarea = document.querySelector('.post-textarea');
  const sellingForm = document.getElementById('sellingForm');
  const buyingForm = document.getElementById('buyingForm');
  const studForm = document.getElementById('studForm');
  const frozenForm = document.getElementById('frozenForm');
  const randomPostContent = document.getElementById('randomPostContent');

  
  // Initialize dropdown functionality
  if (dropdownToggle) {
    
    // Find the dropdown menu
    const dropdownMenu = dropdownToggle.nextElementSibling;
    
    if (dropdownMenu) {
      // Add click event to toggle button
      dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = dropdownMenu.classList.contains('show');
        
        if (isOpen) {
          dropdownMenu.classList.remove('show');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        } else {
          dropdownMenu.classList.add('show');
          dropdownToggle.setAttribute('aria-expanded', 'true');
          
          // Force visibility
          dropdownMenu.style.display = 'block';
          dropdownMenu.style.visibility = 'visible';
          dropdownMenu.style.opacity = '1';
        }
      });
      
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
          dropdownMenu.classList.remove('show');
          dropdownToggle.setAttribute('aria-expanded', 'false');
          dropdownMenu.style.display = '';
          dropdownMenu.style.visibility = '';
          dropdownMenu.style.opacity = '';
        }
      });
    }
  }
  
  if (dropdownToggle) {
    // Get dropdown items specifically from the post type dropdown
    const dropdownMenu = dropdownToggle.nextElementSibling;
    const dropdownItems = dropdownMenu ? dropdownMenu.querySelectorAll('.dropdown-item') : [];
    
    if (dropdownItems.length > 0) {
      // Handle dropdown item clicks
      dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // Remove active class from all items in this specific dropdown
          dropdownItems.forEach(i => i.classList.remove('active'));
          this.classList.add('active');
          
          const type = this.getAttribute('data-type');
          const text = this.textContent;
          if (typeIndicator) typeIndicator.textContent = text;
          updatePlaceholder(type);
          toggleFormVisibility(type);
          
          // Close dropdown
          if (dropdownMenu) {
            dropdownMenu.classList.remove('show');
            dropdownToggle.setAttribute('aria-expanded', 'false');
            dropdownMenu.style.display = '';
            dropdownMenu.style.visibility = '';
            dropdownMenu.style.opacity = '';
          }
        });
      });
    }
    
    // Update placeholder text based on post type
    function updatePlaceholder(type) {
      const placeholders = {
        'random': 'Tell something about your dog..',
        'buying': 'What kind of dog are you looking to buy?',
        'selling': 'Tell us about the dog you want to sell..',
        'frozensemens': 'Share details about artificial insemination services..',
        'stud': 'Describe your stud service offerings..'
      };
      
      if (textarea) textarea.placeholder = placeholders[type] || placeholders['random'];
    }
    
    function toggleFormVisibility(type) {
      if (sellingForm) sellingForm.style.display = 'none';
      if (buyingForm) buyingForm.style.display = 'none';
      if (studForm) studForm.style.display = 'none';
      if (frozenForm) frozenForm.style.display = 'none';
      if (randomPostContent) randomPostContent.style.display = 'none';
      
      if (type === 'selling' && sellingForm) {
        sellingForm.style.display = 'block';
      } else if (type === 'buying' && buyingForm) {
        buyingForm.style.display = 'block';
      } else if (type === 'stud' && studForm) {
        studForm.style.display = 'block';
      } else if (type === 'frozensemens' && frozenForm) {
        frozenForm.style.display = 'block';
      } else if (type === 'random' && randomPostContent) {
        randomPostContent.style.display = 'block';
      }
    }
    
    
    const postBtn = document.getElementById('postBtn');
    if (postBtn) {
      postBtn.addEventListener('click', function() {
        const content = textarea ? textarea.value.trim() : '';
        const activeItem = document.querySelector('.dropdown-item.active');
        const activeType = activeItem ? activeItem.getAttribute('data-type') : 'random';
        
        if (activeType === 'selling') {
          if (validateSellingForm()) {
            const sellingData = collectSellingFormData();
            alert('Dog listing created successfully!');
            clearSellingForm();
          }
        } else if (activeType === 'buying') {
          if (validateBuyingForm()) {
            const buyingData = collectBuyingFormData();
            alert('Buying request created successfully!');
            clearBuyingForm();
          }
        } else if (activeType === 'stud') {
          if (validateStudForm()) {
            const studData = collectStudFormData();
            alert('Stud dog listing created successfully!');
            clearStudForm();
          }
        } else if (activeType === 'frozensemens') {
          // Validate frozen form
          if (validateFrozenForm()) {
            const frozenData = collectFrozenFormData();
            alert('Frozen semen listing created successfully!');
            clearFrozenForm();
          }
        } else {
          // Regular post validation
          if (content) {
            alert('Post created successfully!');
            if (textarea) textarea.value = '';
          } else {
            alert('Please enter some content before posting.');
          }
        }
      });
    }
    
    // Validate selling form
    function validateSellingForm() {
      const requiredFields = ['breedName', 'bloodline', 'age', 'price'];
      const missingFields = [];
      
      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
          const label = field ? field.previousElementSibling.textContent.replace(' *', '') : fieldId;
          missingFields.push(label);
        }
      });
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return false;
      }
      
      return true;
    }
    
    // Collect selling form data
    function collectSellingFormData() {
      return {
        postType: 'selling',
        content: textarea ? textarea.value.trim() : '',
        dogName: document.getElementById('dogName')?.value.trim() || '',
        breedName: document.getElementById('breedName')?.value.trim() || '',
        bloodline: document.getElementById('bloodline')?.value.trim() || '',
        age: document.getElementById('age')?.value.trim() || '',
        price: document.getElementById('price')?.value.trim() || '',
        gender: document.getElementById('gender')?.value || '',
        status: document.getElementById('status')?.value || '',
        registrationNumber: document.getElementById('registrationNumber')?.value.trim() || '',
        pedigreeLink: document.getElementById('pedigreeLink')?.value.trim() || '',
        description: document.getElementById('description')?.value.trim() || ''
      };
    }
    
    // Clear selling form
    function clearSellingForm() {
      const formFields = [
        'dogName', 'breedName', 'bloodline', 'age', 'price', 
        'gender', 'status', 'registrationNumber', 'pedigreeLink', 'description'
      ];
      
      formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          if (field.tagName === 'SELECT') {
            field.selectedIndex = 0;
          } else {
            field.value = '';
          }
        }
      });
      
      if (textarea) textarea.value = '';
    }
    
    // Validate buying form
    function validateBuyingForm() {
      const requiredFields = ['buyBreedName', 'buyBloodline', 'buyAge', 'buyPrice', 'buyDescription'];
      const missingFields = [];
      
      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
          const label = field ? field.previousElementSibling.textContent.replace(' *', '') : fieldId;
          missingFields.push(label);
        }
      });
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return false;
      }
      
      return true;
    }
    
    // Collect buying form data
    function collectBuyingFormData() {
      return {
        postType: 'buying',
        content: textarea ? textarea.value.trim() : '',
        breedName: document.getElementById('buyBreedName')?.value.trim() || '',
        bloodline: document.getElementById('buyBloodline')?.value.trim() || '',
        age: document.getElementById('buyAge')?.value.trim() || '',
        price: document.getElementById('buyPrice')?.value.trim() || '',
        description: document.getElementById('buyDescription')?.value.trim() || ''
      };
    }
    
    // Clear buying form
    function clearBuyingForm() {
      const formFields = [
        'buyBreedName', 'buyBloodline', 'buyAge', 'buyPrice', 'buyDescription'
      ];
      
      formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          if (field.tagName === 'SELECT') {
            field.selectedIndex = 0;
          } else {
            field.value = '';
          }
        }
      });
      
      if (textarea) textarea.value = '';
    }
    
    // Validate stud form
    function validateStudForm() {
      const requiredFields = ['studDogName', 'studBreedName', 'studBloodline', 'studAge', 'studPrice', 'studSticks', 'studStatus', 'studDescription'];
      const missingFields = [];
      
      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
          const label = field ? field.previousElementSibling.textContent.replace(' *', '') : fieldId;
          missingFields.push(label);
        }
      });
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return false;
      }
      
      return true;
    }
    
    // Collect stud form data
    function collectStudFormData() {
      return {
        postType: 'stud',
        content: textarea ? textarea.value.trim() : '',
        dogName: document.getElementById('studDogName')?.value.trim() || '',
        breedName: document.getElementById('studBreedName')?.value.trim() || '',
        bloodline: document.getElementById('studBloodline')?.value.trim() || '',
        age: document.getElementById('studAge')?.value.trim() || '',
        pricePerBreedingCycle: document.getElementById('studPrice')?.value.trim() || '',
        sticksPerBreedingCycle: document.getElementById('studSticks')?.value.trim() || '',
        status: document.getElementById('studStatus')?.value || '',
        pedigreeLink: document.getElementById('studPedigreeLink')?.value.trim() || '',
        description: document.getElementById('studDescription')?.value.trim() || ''
      };
    }
    
    // Clear stud form
    function clearStudForm() {
      const formFields = [
        'studDogName', 'studBreedName', 'studBloodline', 'studAge', 'studPrice', 
        'studSticks', 'studStatus', 'studPedigreeLink', 'studDescription'
      ];
      
      formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          if (field.tagName === 'SELECT') {
            field.selectedIndex = 0;
          } else {
            field.value = '';
          }
        }
      });
      
      if (textarea) textarea.value = '';
    }
    
    // Validate frozen form
    function validateFrozenForm() {
      const requiredFields = ['frozenDogName', 'frozenBreedName', 'frozenBloodline', 'frozenPrice', 'frozenStoredSince', 'frozenStatus', 'frozenDescription'];
      const missingFields = [];
      
      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
          const label = field ? field.previousElementSibling.textContent.replace(' *', '') : fieldId;
          missingFields.push(label);
        }
      });
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return false;
      }
      
      return true;
    }
    
    // Collect frozen form data
    function collectFrozenFormData() {
      return {
        postType: 'frozensemens',
        content: textarea ? textarea.value.trim() : '',
        dogName: document.getElementById('frozenDogName')?.value.trim() || '',
        breedName: document.getElementById('frozenBreedName')?.value.trim() || '',
        bloodline: document.getElementById('frozenBloodline')?.value.trim() || '',
        pricePer5cc: document.getElementById('frozenPrice')?.value.trim() || '',
        storedSince: document.getElementById('frozenStoredSince')?.value || '',
        status: document.getElementById('frozenStatus')?.value || '',
        pedigreeLink: document.getElementById('frozenPedigreeLink')?.value.trim() || '',
        description: document.getElementById('frozenDescription')?.value.trim() || ''
      };
    }
    
    // Clear frozen form
    function clearFrozenForm() {
      const formFields = [
        'frozenDogName', 'frozenBreedName', 'frozenBloodline', 'frozenPrice', 
        'frozenStoredSince', 'frozenStatus', 'frozenPedigreeLink', 'frozenDescription'
      ];
      
      formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          if (field.tagName === 'SELECT') {
            field.selectedIndex = 0;
          } else {
            field.value = '';
          }
        }
      });
      
      if (textarea) textarea.value = '';
    }
  }

  // Attachment functionality for homepage
  const fileUploadBtn = document.getElementById('fileUploadBtn');
  const homepageFileInput = document.getElementById('fileInput');
  const mediaUploadBtn = document.getElementById('mediaUploadBtn');
  const homepageMediaInput = document.getElementById('mediaInput');

  if (fileUploadBtn && homepageFileInput) {
    fileUploadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      homepageFileInput.click();
    });
    
    homepageFileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        showFilePreview(file);
      });
    });
  }

  if (mediaUploadBtn && homepageMediaInput) {
    mediaUploadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      homepageMediaInput.click();
    });
    
    homepageMediaInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        showFilePreview(file);
      });
    });
  }

  function showFilePreview(file) {
    let previewContainer = document.querySelector('.file-preview');
    if (!previewContainer) {
      previewContainer = document.createElement('div');
      previewContainer.className = 'file-preview mb-3 p-2 bg-light rounded-2 border';
      const postActions = document.querySelector('.post-actions');
      if (postActions) {
        postActions.parentNode.insertBefore(previewContainer, postActions);
      }
    }
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-preview-item d-flex justify-content-between';
    
    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info d-flex align-items-center gap-2';
    
    const fileIcon = document.createElement('div');
    fileIcon.className = 'file-icon d-flex align-items-center justify-content-center text-white bg-light rounded-1';
    fileIcon.textContent = getFileIcon(file.type);
    
    const fileName = document.createElement('span');
    fileName.className = 'file-name';
    fileName.textContent = file.name;
    
    const fileRemove = document.createElement('button');
    fileRemove.className = 'file-remove d-flex align-items-center justify-content-center p-0 fs-6 text-danger border-0 bg-none';
    fileRemove.innerHTML = '&times;';
    fileRemove.addEventListener('click', function() {
      fileItem.remove();
      if (previewContainer.children.length === 0) {
        previewContainer.remove();
      }
    });
    
    fileInfo.appendChild(fileIcon);
    fileInfo.appendChild(fileName);
    fileItem.appendChild(fileInfo);
    fileItem.appendChild(fileRemove);
    previewContainer.appendChild(fileItem);
  }

  // Function to get file icon based on file type
  function getFileIcon(fileType) {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    return '📎';
  }
});

function toggleDescription(descriptionId = 'description-text', readMoreClass = '.read-more') {
  
  const descriptionText = document.getElementById(descriptionId);
  const readMoreBtn = document.querySelector(readMoreClass);
  
  if (descriptionText && readMoreBtn) {
    if (descriptionText.classList.contains('description-text-truncated')) {
        descriptionText.classList.remove('description-text-truncated');
        descriptionText.classList.add('description-text-full');
        readMoreBtn.textContent = '... Read Less';
    } else {
        descriptionText.classList.remove('description-text-full');
        descriptionText.classList.add('description-text-truncated');
        readMoreBtn.textContent = '... Read More';
    }
  } 
}

function toggleDescriptionCommentsModal() {
  toggleDescription('description-text-comments-modal', '.read-more-comments-modal');
}

function checkTextLength(descriptionText, readMoreBtn) {
  if (!descriptionText || !readMoreBtn) return;
  const textContent = descriptionText.textContent || descriptionText.innerText || '';
  const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  if (wordCount > 50) {
    readMoreBtn.style.display = 'inline';
  } else {
    readMoreBtn.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const descriptions = document.querySelectorAll('[id*="description-text"]');
  descriptions.forEach(description => {
    const readMoreBtn = description.parentElement.querySelector('.read-more, .read-more-comments-modal');
    if (readMoreBtn) {
      checkTextLength(description, readMoreBtn);
    }
  });
});

// Profile modal functions
function saveDetails() {
  const workplace = document.getElementById('workplace').value;
  const education = document.getElementById('education').value;
  const location = document.getElementById('location').value;
  const relationship = document.querySelector('input[name="relationship"]:checked').value;
  const favoriteBreed = document.getElementById('favoriteBreed').value;
  const profession = document.querySelector('input[name="profession"]:checked').value;

  // Update the display elements
  const detailsContainer = document.querySelector('.d-flex.flex-column.gap-3.py-3');
  if (detailsContainer) {
    const details = detailsContainer.querySelectorAll('.d-flex.align-items-start.gap-2');
    
    if (details[0]) details[0].querySelector('p').textContent = `Works at "${workplace}"`;
    if (details[1]) details[1].querySelector('p').textContent = `Studied at "${education}"`;
    if (details[2]) details[2].querySelector('p').textContent = `Lives in "${location}"`;
    if (details[3]) details[3].querySelector('p').textContent = relationship.charAt(0).toUpperCase() + relationship.slice(1);
    if (details[4]) details[4].querySelector('p').textContent = `Favourite Breed is "${favoriteBreed}"`;
    if (details[5]) details[5].querySelector('p').textContent = profession === 'breeder' ? 'Dog Breeder' : 'Dog Fancier';
  }

  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('editDetailsModal'));
  modal.hide();
}

function saveSocialMedia() {
  const website = document.getElementById('website').value;
  const facebook = document.getElementById('facebook').value;
  const instagram = document.getElementById('instagram').value;

  // Update the display elements
  const socialContainer = document.querySelectorAll('.d-flex.flex-column.gap-3.py-3')[1];
  if (socialContainer) {
    const socialLinks = socialContainer.querySelectorAll('.d-flex.align-items-start.gap-2');
    
    if (socialLinks[0]) {
      const link = socialLinks[0].querySelector('a');
      if (link) {
        link.textContent = website.replace('https://', '').replace('http://', '');
        link.href = website;
      }
    }
    if (socialLinks[1]) {
      const link = socialLinks[1].querySelector('a');
      if (link) {
        link.textContent = facebook.replace('https://', '').replace('http://', '');
        link.href = facebook;
      }
    }
    if (socialLinks[2]) {
      const link = socialLinks[2].querySelector('a');
      if (link) {
        link.textContent = instagram.replace('https://', '').replace('http://', '');
        link.href = instagram;
      }
    }
  }

  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('editSocialModal'));
  modal.hide();
}


// Initialize Select2 for favorite breed dropdown in profile modal
document.addEventListener('DOMContentLoaded', function() {
  const $ = window.jQuery;
  const $favoriteBreed = $('#favoriteBreed');

  function initFavoriteBreedSelect2() {
    if (!$favoriteBreed || !$favoriteBreed.length) return;
    // If already initialized, skip
    if ($favoriteBreed.hasClass('select2-hidden-accessible')) return;
    const $modal = $('#editDetailsModal');
    const dropdownParent = $modal.length ? $modal : $('body');
    $favoriteBreed.select2({
      placeholder: 'Select favorite breed',
      width: '100%',
      allowClear: true,
      dropdownParent
    });
  }

  // Initialize when modal opens to avoid focus trap issues
  const detailsModalEl = document.getElementById('editDetailsModal');
  if (detailsModalEl) {
    detailsModalEl.addEventListener('shown.bs.modal', initFavoriteBreedSelect2);
  }

  // As a fallback, initialize on load if modal isn't used yet
  initFavoriteBreedSelect2();
});

// Report post modal wiring
document.addEventListener('DOMContentLoaded', function () {
  const reportButtons = document.querySelectorAll('.report-post-btn');
  const reportPostIdInput = document.getElementById('reportPostId');
  const submitBtn = document.getElementById('submitReportBtn');

  reportButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const postId = btn.getAttribute('data-post-id') || '';
      if (reportPostIdInput) reportPostIdInput.value = postId;
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const postId = reportPostIdInput ? reportPostIdInput.value : '';
      const reasonEl = document.querySelector('input[name="reportReason"]:checked');
      const reason = reasonEl ? reasonEl.value : '';
      const details = (document.getElementById('reportDetails') || {}).value || '';

      if (!reason) {
        alert('Please select a reason.');
        return;
      }

      // TODO: Replace with real API call
      console.log('Submitting report:', { postId, reason, details });

      // Give quick UX feedback
      const modalEl = document.getElementById('reportPostModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
      }
      // Optionally show a toast/snackbar
      alert('Report submitted. Thank you for your feedback.');
    });
  }
});

 
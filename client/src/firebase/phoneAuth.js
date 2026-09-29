import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './config';

/**
 * Initialize or retrieve RecaptchaVerifier on the specified HTML container element
 * @param {string} containerId - DOM ID of the container element
 * @returns {RecaptchaVerifier}
 */
export const setupRecaptcha = (containerId = 'recaptcha-container') => {
  if (typeof window === 'undefined') return null;

  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Recaptcha container #${containerId} not found in DOM.`);
    return null;
  }

  // Clear previous verifier instance if existing
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.warn('Clearing previous RecaptchaVerifier:', e);
    }
    window.recaptchaVerifier = null;
  }

  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('Firebase Recaptcha resolved successfully.');
      },
      'expired-callback': () => {
        console.warn('Firebase Recaptcha expired. Re-verification required.');
      },
    });
    return window.recaptchaVerifier;
  } catch (err) {
    console.error('Failed to initialize RecaptchaVerifier:', err);
    return null;
  }
};

/**
 * Format mobile phone to international E.164 format (+91 for India by default if missing)
 * @param {string} rawPhone 
 * @returns {string}
 */
export const formatPhoneNumber = (rawPhone) => {
  const cleaned = rawPhone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  return `+91${cleaned}`;
};

/**
 * Send Firebase SMS OTP to phone number using RecaptchaVerifier
 * @param {string} phone 
 * @param {string} containerId 
 * @returns {Promise<{success: boolean, confirmationResult?: any, error?: string, isFallback?: boolean}>}
 */
export const sendFirebasePhoneOtp = async (phone, containerId = 'recaptcha-container') => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const verifier = setupRecaptcha(containerId);
    
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    window.confirmationResult = confirmationResult;

    return {
      success: true,
      confirmationResult,
      formattedPhone,
      message: `Firebase OTP code dispatched to ${formattedPhone}`,
    };
  } catch (err) {
    console.warn('Firebase Phone Auth send error:', err);
    let userFriendlyMsg = err.message || 'Firebase OTP delivery failed.';
    if (err.code === 'auth/billing-not-enabled') {
      userFriendlyMsg = 'Firebase requires Blaze Plan for real SMS dispatch, OR add your number under "Phone numbers for testing" in Firebase Console for free.';
    } else if (err.code === 'auth/operation-not-allowed') {
      userFriendlyMsg = 'SMS Region Policy is not enabled in Firebase Console. Please enable India (+91) under Authentication > Settings > SMS Region Policy, or add your number under "Phone numbers for testing".';
    } else if (err.code === 'auth/too-many-requests') {
      userFriendlyMsg = 'Too many OTP requests sent. Please try again in a few minutes.';
    } else if (err.code === 'auth/invalid-phone-number') {
      userFriendlyMsg = 'Invalid phone number format. Please provide a valid mobile number with country code.';
    } else if (err.code === 'auth/captcha-check-failed') {
      userFriendlyMsg = 'reCAPTCHA verification failed. Please refresh and try again.';
    }

    return {
      success: false,
      error: userFriendlyMsg,
      code: err.code,
    };
  }
};

/**
 * Verify received SMS OTP with Firebase confirmationResult
 * @param {any} confirmationResult 
 * @param {string} otpCode 
 * @returns {Promise<{success: boolean, user?: any, idToken?: string, error?: string}>}
 */
export const verifyFirebasePhoneOtp = async (confirmationResult, otpCode) => {
  try {
    const activeConfirmation = confirmationResult || window.confirmationResult;
    if (!activeConfirmation) {
      throw new Error('No active OTP session found. Please request a new verification code.');
    }

    const userCredential = await activeConfirmation.confirm(otpCode);
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    return {
      success: true,
      user,
      idToken,
      phoneNumber: user.phoneNumber,
      uid: user.uid,
    };
  } catch (err) {
    console.error('Firebase OTP verify error:', err);
    return {
      success: false,
      error: err.message || 'Invalid or expired OTP verification code.',
      code: err.code,
    };
  }
};

/**
 * App Configuration
 */

import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    // Android emulator uses 10.0.2.2 to reach host machine.
    // iOS simulator can use localhost, but a PHYSICAL device must use the
    // Mac's LAN IP (localhost on the phone = the phone itself).
    return Platform.select({
      android: 'http://10.0.2.2:3001',
      ios: 'http://192.168.1.5:3001',
      default: 'http://192.168.1.5:3001',
    });
  }
  return 'https://api.pujariconnect.com'; // Production URL
};

export const config = {
  API_BASE_URL: getBaseUrl(),
  APP_NAME: 'Pujari Connect',
  APP_TAG: 'BY PUJARI CONNECT',
  APP_VERSION: '1.0.0',
  DEFAULT_LOCATION: 'Guwahati, Assam',
  DEFAULT_LOCATION_DETAIL: 'Pandu College, Maligaon, Guwahati',
  COUNTRY_CODE: '+91',
  PHONE_LENGTH: 10,
  OTP_LENGTH: 6,
  OTP_RESEND_SECONDS: 30,
  DELIVERY_FEE: 50,
  FREE_DELIVERY_THRESHOLD: 500,
  CURRENCY_SYMBOL: '₹',
  ITEMS_PER_PAGE: 20,
  MAX_BOOKING_DAYS_AHEAD: 30,
} as const;

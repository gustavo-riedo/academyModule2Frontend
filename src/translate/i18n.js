import i18n from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';

import { messages } from './languages';

i18n.use(languageDetector);
i18n.init({
   debug: false,
   defaultNS: ['translations'],
   fallbackLng: 'en',
   ns: ['translations'],
   resources: messages,
});

export { i18n };

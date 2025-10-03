import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.bookNow': 'Book Now',
      'nav.admin': 'Admin',
      'nav.logout': 'Logout',
      
      // Hero Section
      'hero.title': 'Book Your Service Online',
      'hero.subtitle': 'Simple, fast, and convenient booking for all your needs',
      'hero.cta': 'Book Now',
      
      // Services
      'services.title': 'Our Services',
      'services.duration': '{{minutes}} minutes',
      'services.select': 'Select',
      
      // Booking Form
      'booking.title': 'Book Your Appointment',
      'booking.selectDate': 'Select Date',
      'booking.selectTime': 'Select Time',
      'booking.name': 'Your Name',
      'booking.phone': 'Phone Number',
      'booking.email': 'Email (Optional)',
      'booking.notes': 'Additional Notes',
      'booking.confirm': 'Confirm Booking',
      'booking.success': 'Booking Confirmed!',
      'booking.successMessage': 'Your appointment has been successfully booked. You will receive a confirmation message shortly.',
      'booking.backToHome': 'Back to Home',
      
      // Admin
      'admin.login': 'Admin Login',
      'admin.email': 'Email',
      'admin.password': 'Password',
      'admin.signIn': 'Sign In',
      'admin.dashboard': 'Dashboard',
      'admin.services': 'Services',
      'admin.schedule': 'Schedule',
      'admin.bookings': 'Bookings',
      'admin.profile': 'Business Profile',
      
      // Common
      'common.loading': 'Loading...',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.add': 'Add',
      'common.price': 'Price',
      'common.duration': 'Duration',
      'common.status': 'Status',
      'common.date': 'Date',
      'common.time': 'Time',
    },
  },
  he: {
    translation: {
      'nav.home': 'בית',
      'nav.bookNow': 'הזמן עכשיו',
      'nav.admin': 'ניהול',
      'nav.logout': 'התנתק',
      
      'hero.title': 'הזמן את השירות שלך באינטרנט',
      'hero.subtitle': 'הזמנה פשוטה, מהירה ונוחה לכל הצרכים שלך',
      'hero.cta': 'הזמן עכשיו',
      
      'services.title': 'השירותים שלנו',
      'services.duration': '{{minutes}} דקות',
      'services.select': 'בחר',
      
      'booking.title': 'הזמן פגישה',
      'booking.selectDate': 'בחר תאריך',
      'booking.selectTime': 'בחר שעה',
      'booking.name': 'שם מלא',
      'booking.phone': 'מספר טלפון',
      'booking.email': 'אימייל (אופציונלי)',
      'booking.notes': 'הערות נוספות',
      'booking.confirm': 'אשר הזמנה',
      'booking.success': 'ההזמנה אושרה!',
      'booking.successMessage': 'הפגישה שלך נקבעה בהצלחה. תקבל אישור בקרוב.',
      'booking.backToHome': 'חזור לדף הבית',
      
      'admin.login': 'כניסה למנהל',
      'admin.email': 'אימייל',
      'admin.password': 'סיסמה',
      'admin.signIn': 'התחבר',
      'admin.dashboard': 'לוח בקרה',
      'admin.services': 'שירותים',
      'admin.schedule': 'לוח זמנים',
      'admin.bookings': 'הזמנות',
      'admin.profile': 'פרופיל עסק',
      
      'common.loading': 'טוען...',
      'common.save': 'שמור',
      'common.cancel': 'בטל',
      'common.edit': 'ערוך',
      'common.delete': 'מחק',
      'common.add': 'הוסף',
      'common.price': 'מחיר',
      'common.duration': 'משך',
      'common.status': 'סטטוס',
      'common.date': 'תאריך',
      'common.time': 'שעה',
    },
  },
  ar: {
    translation: {
      'nav.home': 'الرئيسية',
      'nav.bookNow': 'احجز الآن',
      'nav.admin': 'الإدارة',
      'nav.logout': 'تسجيل الخروج',
      
      'hero.title': 'احجز خدمتك عبر الإنترنت',
      'hero.subtitle': 'حجز بسيط وسريع ومريح لجميع احتياجاتك',
      'hero.cta': 'احجز الآن',
      
      'services.title': 'خدماتنا',
      'services.duration': '{{minutes}} دقيقة',
      'services.select': 'اختر',
      
      'booking.title': 'احجز موعدك',
      'booking.selectDate': 'اختر التاريخ',
      'booking.selectTime': 'اختر الوقت',
      'booking.name': 'الاسم الكامل',
      'booking.phone': 'رقم الهاتف',
      'booking.email': 'البريد الإلكتروني (اختياري)',
      'booking.notes': 'ملاحظات إضافية',
      'booking.confirm': 'تأكيد الحجز',
      'booking.success': 'تم تأكيد الحجز!',
      'booking.successMessage': 'تم حجز موعدك بنجاح. ستتلقى رسالة تأكيد قريباً.',
      'booking.backToHome': 'العودة للرئيسية',
      
      'admin.login': 'تسجيل دخول المسؤول',
      'admin.email': 'البريد الإلكتروني',
      'admin.password': 'كلمة المرور',
      'admin.signIn': 'تسجيل الدخول',
      'admin.dashboard': 'لوحة التحكم',
      'admin.services': 'الخدمات',
      'admin.schedule': 'الجدول الزمني',
      'admin.bookings': 'الحجوزات',
      'admin.profile': 'ملف العمل',
      
      'common.loading': 'جار التحميل...',
      'common.save': 'حفظ',
      'common.cancel': 'إلغاء',
      'common.edit': 'تعديل',
      'common.delete': 'حذف',
      'common.add': 'إضافة',
      'common.price': 'السعر',
      'common.duration': 'المدة',
      'common.status': 'الحالة',
      'common.date': 'التاريخ',
      'common.time': 'الوقت',
    },
  },
  fr: {
    translation: {
      'nav.home': 'Accueil',
      'nav.bookNow': 'Réserver',
      'nav.admin': 'Admin',
      'nav.logout': 'Déconnexion',
      
      'hero.title': 'Réservez votre service en ligne',
      'hero.subtitle': 'Réservation simple, rapide et pratique pour tous vos besoins',
      'hero.cta': 'Réserver maintenant',
      
      'services.title': 'Nos services',
      'services.duration': '{{minutes}} minutes',
      'services.select': 'Sélectionner',
      
      'booking.title': 'Réserver votre rendez-vous',
      'booking.selectDate': 'Sélectionner la date',
      'booking.selectTime': 'Sélectionner l\'heure',
      'booking.name': 'Nom complet',
      'booking.phone': 'Numéro de téléphone',
      'booking.email': 'Email (facultatif)',
      'booking.notes': 'Notes supplémentaires',
      'booking.confirm': 'Confirmer la réservation',
      'booking.success': 'Réservation confirmée !',
      'booking.successMessage': 'Votre rendez-vous a été réservé avec succès. Vous recevrez un message de confirmation sous peu.',
      'booking.backToHome': 'Retour à l\'accueil',
      
      'admin.login': 'Connexion Admin',
      'admin.email': 'Email',
      'admin.password': 'Mot de passe',
      'admin.signIn': 'Se connecter',
      'admin.dashboard': 'Tableau de bord',
      'admin.services': 'Services',
      'admin.schedule': 'Horaires',
      'admin.bookings': 'Réservations',
      'admin.profile': 'Profil d\'entreprise',
      
      'common.loading': 'Chargement...',
      'common.save': 'Sauvegarder',
      'common.cancel': 'Annuler',
      'common.edit': 'Modifier',
      'common.delete': 'Supprimer',
      'common.add': 'Ajouter',
      'common.price': 'Prix',
      'common.duration': 'Durée',
      'common.status': 'Statut',
      'common.date': 'Date',
      'common.time': 'Heure',
    },
  },
  es: {
    translation: {
      'nav.home': 'Inicio',
      'nav.bookNow': 'Reservar',
      'nav.admin': 'Admin',
      'nav.logout': 'Cerrar sesión',
      
      'hero.title': 'Reserva tu servicio en línea',
      'hero.subtitle': 'Reserva simple, rápida y conveniente para todas tus necesidades',
      'hero.cta': 'Reservar ahora',
      
      'services.title': 'Nuestros servicios',
      'services.duration': '{{minutes}} minutos',
      'services.select': 'Seleccionar',
      
      'booking.title': 'Reserva tu cita',
      'booking.selectDate': 'Seleccionar fecha',
      'booking.selectTime': 'Seleccionar hora',
      'booking.name': 'Nombre completo',
      'booking.phone': 'Número de teléfono',
      'booking.email': 'Email (opcional)',
      'booking.notes': 'Notas adicionales',
      'booking.confirm': 'Confirmar reserva',
      'booking.success': '¡Reserva confirmada!',
      'booking.successMessage': 'Tu cita ha sido reservada con éxito. Recibirás un mensaje de confirmación pronto.',
      'booking.backToHome': 'Volver al inicio',
      
      'admin.login': 'Iniciar sesión Admin',
      'admin.email': 'Email',
      'admin.password': 'Contraseña',
      'admin.signIn': 'Iniciar sesión',
      'admin.dashboard': 'Panel de control',
      'admin.services': 'Servicios',
      'admin.schedule': 'Horario',
      'admin.bookings': 'Reservas',
      'admin.profile': 'Perfil de negocio',
      
      'common.loading': 'Cargando...',
      'common.save': 'Guardar',
      'common.cancel': 'Cancelar',
      'common.edit': 'Editar',
      'common.delete': 'Eliminar',
      'common.add': 'Agregar',
      'common.price': 'Precio',
      'common.duration': 'Duración',
      'common.status': 'Estado',
      'common.date': 'Fecha',
      'common.time': 'Hora',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

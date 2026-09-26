import { createFormHandler } from '@/lib/form-endpoint';
import { contactSchema } from '@/lib/validation';

export const POST = createFormHandler(contactSchema, 'CONTACT_WEBHOOK_URL');

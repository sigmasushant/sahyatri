import { createFormHandler } from '@/lib/form-endpoint';
import { earlyAccessSchema } from '@/lib/validation';

export const POST = createFormHandler(earlyAccessSchema, 'EARLY_ACCESS_WEBHOOK_URL');

import { z } from 'zod';
import { profileSchema } from '../components/KycProfileForm';

export type KycSubmissionData = z.infer<typeof profileSchema>;
